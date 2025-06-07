import { supabase } from '../services/supabaseClient';
import { 
  TestMethodInsert, 
  TestPanelInsert, 
  insertBulkTestPanels 
} from '../services/testPanelService';
import { insertBulkTestMethods } from '../services/testMethodService';
import { fetchOrganizations } from '../services/organizationService';

export interface ImportResult {
  success: boolean;
  message: string;
  testMethodsCount: number;
  testPanelsCount: number;
  errors?: string[];
}

export const importTestMethodsAndPanels = async (fileContent: string): Promise<ImportResult> => {
  try {
    // Parse the tab-separated data
    const lines = fileContent.trim().split('\n');
    
    // Skip the header row
    const dataRows = lines.slice(1);
    
    if (dataRows.length === 0) {
      throw new Error('No data rows found in the file');
    }

    // Fetch all organizations to create org_code -> id mapping
    const organizations = await fetchOrganizations();
    const orgCodeToIdMap = new Map(
      organizations.map(org => [org.org_code.trim(), org.id])
    );

    // Parse data and group by test methods
    const testMethodsMap = new Map<string, {
      organizationId: string;
      name: string;
      panels: Array<{ code: string; name: string }>;
    }>();

    const errors: string[] = [];

    dataRows.forEach((row, index) => {
      const columns = row.split('\t').map(col => col.trim());
      
      if (columns.length < 5) {
        errors.push(`Row ${index + 2}: Insufficient columns (expected 5, got ${columns.length})`);
        return;
      }

      const [orgCode, testMethodCode, testMethodName, panelCode, panelName] = columns;

      // Find organization ID
      const organizationId = orgCodeToIdMap.get(orgCode);
      if (!organizationId) {
        errors.push(`Row ${index + 2}: Organization code '${orgCode}' not found`);
        return;
      }

      // Create unique key for test method
      const testMethodKey = `${organizationId}:${testMethodName}`;

      // Initialize test method if not exists
      if (!testMethodsMap.has(testMethodKey)) {
        testMethodsMap.set(testMethodKey, {
          organizationId,
          name: testMethodName,
          panels: []
        });
      }

      // Add panel if panel code and name are provided
      if (panelCode && panelName) {
        const testMethod = testMethodsMap.get(testMethodKey)!;
        testMethod.panels.push({
          code: panelCode,
          name: panelName
        });
      }
    });

    if (errors.length > 0) {
      console.warn('Import warnings:', errors);
    }

    // Prepare test methods for bulk insert with enhanced fields
    const testMethodsToInsert: TestMethodInsert[] = Array.from(testMethodsMap.values()).map(tm => ({
      organization_id: tm.organizationId,
      name: tm.name,
      description: `${tm.name} test method`,
      category: getTestMethodCategory(tm.name),
      max_batch_size: getMaxBatchSize(tm.name),
      processing_time: getProcessingTime(tm.name),
      status: 'Active',
      required_equipment: getRequiredEquipment(tm.name),
      protocols: getProtocols(tm.name),
      regulatory_requirements: getRegulatoryRequirements(tm.name),
      quality_controls: getQualityControls(tm.name)
    }));

    // Insert test methods with upsert
    await insertBulkTestMethods(testMethodsToInsert);

    // Fetch the inserted test methods to get their IDs
    const { data: insertedTestMethods, error: testMethodError } = await supabase
      .from('test_methods')
      .select('id, organization_id, name')
      .in('organization_id', Array.from(new Set(testMethodsToInsert.map(tm => tm.organization_id))))
      .in('name', Array.from(new Set(testMethodsToInsert.map(tm => tm.name))));

    if (testMethodError) {
      throw new Error(`Failed to fetch test methods: ${testMethodError.message}`);
    }

    // Create mapping from (organization_id, name) to test_method_id
    const testMethodIdMap = new Map<string, string>();
    insertedTestMethods?.forEach(tm => {
      const key = `${tm.organization_id}:${tm.name}`;
      testMethodIdMap.set(key, tm.id);
    });

    // Prepare test panels for bulk insert
    const testPanelsToInsert: TestPanelInsert[] = [];
    
    testMethodsMap.forEach((testMethod, testMethodKey) => {
      const testMethodId = testMethodIdMap.get(testMethodKey);
      if (!testMethodId) {
        errors.push(`Test method ID not found for: ${testMethod.name}`);
        return;
      }

      testMethod.panels.forEach(panel => {
        testPanelsToInsert.push({
          test_method_id: testMethodId,
          name: panel.name,
          description: `${panel.name} panel for ${testMethod.name}`,
          panel_code: panel.code
        });
      });
    });

    // Insert test panels
    if (testPanelsToInsert.length > 0) {
      await insertBulkTestPanels(testPanelsToInsert);
    }

    return {
      success: true,
      message: `Successfully imported ${testMethodsToInsert.length} test methods and ${testPanelsToInsert.length} test panels`,
      testMethodsCount: testMethodsToInsert.length,
      testPanelsCount: testPanelsToInsert.length,
      errors: errors.length > 0 ? errors : undefined
    };

  } catch (error) {
    console.error('Import error:', error);
    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      testMethodsCount: 0,
      testPanelsCount: 0
    };
  }
};

// Helper function to determine test method category
const getTestMethodCategory = (testMethodName: string): string => {
  const name = testMethodName.toLowerCase();
  
  if (name.includes('pcr')) {
    return 'Molecular';
  } else if (name.includes('confirmation') || name.includes('screen')) {
    return 'Toxicology';
  } else if (name.includes('saliva')) {
    return 'Specimen Testing';
  } else {
    return 'General';
  }
};

// Helper function to determine max batch size
const getMaxBatchSize = (testMethodName: string): number => {
  const name = testMethodName.toLowerCase();
  
  if (name.includes('pcr')) {
    return 96;
  } else if (name.includes('confirmation')) {
    return 48;
  } else if (name.includes('screen')) {
    return 96;
  } else {
    return 24;
  }
};

// Helper function to determine processing time
const getProcessingTime = (testMethodName: string): string => {
  const name = testMethodName.toLowerCase();
  
  if (name.includes('pcr')) {
    return '2-4 hours';
  } else if (name.includes('confirmation')) {
    return '4-6 hours';
  } else if (name.includes('screen')) {
    return '1-2 hours';
  } else {
    return '2-4 hours';
  }
};

// Helper function to determine required equipment
const getRequiredEquipment = (testMethodName: string): string[] => {
  const name = testMethodName.toLowerCase();
  
  if (name.includes('pcr')) {
    return ['PCR Machine', 'OT2-002', 'Thermal Cycler'];
  } else if (name.includes('confirmation')) {
    return ['LC-MS/MS', 'Centrifuge', 'Extraction Station'];
  } else if (name.includes('screen')) {
    return ['Immunoassay Analyzer', 'Pipettes'];
  } else {
    return ['Standard Lab Equipment'];
  }
};

// Helper function to determine protocols
const getProtocols = (testMethodName: string): string[] => {
  const name = testMethodName.toLowerCase();
  
  if (name.includes('pcr')) {
    return ['P004', 'PCR Setup Protocol'];
  } else if (name.includes('confirmation')) {
    return ['P005', 'LC-MS Confirmation Protocol'];
  } else if (name.includes('screen')) {
    return ['P006', 'Immunoassay Screening Protocol'];
  } else {
    return ['P001', 'Standard Protocol'];
  }
};

// Helper function to determine regulatory requirements
const getRegulatoryRequirements = (testMethodName: string): string[] => {
  const name = testMethodName.toLowerCase();
  
  if (name.includes('pcr')) {
    return ['CLIA', 'FDA EUA', 'ISO 15189'];
  } else if (name.includes('confirmation') || name.includes('screen')) {
    return ['CLIA', 'SAMHSA', 'DOT'];
  } else {
    return ['CLIA', 'CAP'];
  }
};

// Helper function to determine quality controls
const getQualityControls = (testMethodName: string): string[] => {
  const name = testMethodName.toLowerCase();
  
  if (name.includes('pcr')) {
    return ['Positive Control', 'Negative Control', 'Internal Control', 'Extraction Control'];
  } else if (name.includes('confirmation')) {
    return ['Calibrators', 'QC High', 'QC Low', 'Blank'];
  } else if (name.includes('screen')) {
    return ['Positive Control', 'Negative Control', 'Cutoff Control'];
  } else {
    return ['Daily QC', 'Calibration Check'];
  }
};