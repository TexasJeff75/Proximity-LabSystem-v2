import { supabase } from '../services/supabaseClient';
import { 
  TestMethodInsert, 
  TestPanelInsert, 
  insertBulkTestPanels 
} from '../services/testPanelService';
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

    // Prepare test methods for bulk insert
    const testMethodsToInsert: TestMethodInsert[] = Array.from(testMethodsMap.values()).map(tm => ({
      organization_id: tm.organizationId,
      name: tm.name,
      description: `${tm.name} test method`,
      category: getTestMethodCategory(tm.name),
      max_batch_size: 24,
      processing_time: getProcessingTime(tm.name),
      status: 'Active'
    }));

    // Insert test methods with upsert
    const { data: insertedTestMethods, error: testMethodError } = await supabase
      .from('test_methods')
      .upsert(testMethodsToInsert, { 
        onConflict: 'organization_id,name',
        ignoreDuplicates: false 
      })
      .select('id, organization_id, name');

    if (testMethodError) {
      throw new Error(`Failed to insert test methods: ${testMethodError.message}`);
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