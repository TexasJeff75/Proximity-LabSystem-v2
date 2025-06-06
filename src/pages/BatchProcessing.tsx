import React, { useState, Fragment } from 'react';
import { PlayIcon, PauseIcon, ClockIcon, AlertTriangleIcon, CheckCircleIcon, ArrowUpIcon, ArrowDownIcon, SettingsIcon, CpuIcon, TestTubeIcon, FlaskConicalIcon, TrendingUpIcon, UsersIcon, RefreshCwIcon, XIcon, CheckIcon, FileTextIcon, ChevronDownIcon, ChevronUpIcon, PlusIcon, SaveIcon, EditIcon, CopyIcon, TrashIcon, SearchIcon, DownloadIcon, FilterIcon, LayersIcon, BuildingIcon } from 'lucide-react';
const generateSampleData = () => {
  const initialSampleQueue = [{
    id: 'S001',
    patientName: 'John Doe',
    testType: 'Complete Blood Count',
    priority: 'Urgent',
    collectionTime: '08:30',
    estimatedDuration: '15 min',
    batchId: 'B001',
    status: 'Queued'
  }, {
    id: 'S002',
    patientName: 'Jane Smith',
    testType: 'Complete Blood Count',
    priority: 'High',
    collectionTime: '08:45',
    estimatedDuration: '15 min',
    batchId: 'B001',
    status: 'Queued'
  }, {
    id: 'S003',
    patientName: 'Mike Johnson',
    testType: 'Complete Blood Count',
    priority: 'Normal',
    collectionTime: '09:00',
    estimatedDuration: '15 min',
    batchId: 'B001',
    status: 'Queued'
  }, {
    id: 'S004',
    patientName: 'Sarah Wilson',
    testType: 'Lipid Panel',
    priority: 'High',
    collectionTime: '08:15',
    estimatedDuration: '25 min',
    batchId: 'B002',
    status: 'Processing'
  }, {
    id: 'S005',
    patientName: 'Robert Brown',
    testType: 'Lipid Panel',
    priority: 'Normal',
    collectionTime: '08:30',
    estimatedDuration: '25 min',
    batchId: 'B002',
    status: 'Processing'
  }, {
    id: 'S006',
    patientName: 'Emily Davis',
    testType: 'Liver Function',
    priority: 'Urgent',
    collectionTime: '09:15',
    estimatedDuration: '30 min',
    batchId: null,
    status: 'Pending'
  }, {
    id: 'S007',
    patientName: 'David Miller',
    testType: 'Liver Function',
    priority: 'Normal',
    collectionTime: '09:30',
    estimatedDuration: '30 min',
    batchId: null,
    status: 'Pending'
  }];
  const initialBatches = [{
    id: 'METROHEALTH-CBC-20240115',
    customerName: 'Metro Health System',
    testType: 'Complete Blood Count',
    sampleCount: 3,
    optimalSize: 8,
    status: 'Ready',
    assignedRobot: 'OT2-001',
    estimatedTime: '45 min',
    priority: 'High',
    progress: 0,
    protocolId: null,
    protocolName: null,
    createdAt: '2024-01-15'
  }, {
    id: 'COMMUNITYCARE-LIPID-20240115',
    customerName: 'Community Care Clinics',
    testType: 'Lipid Panel',
    sampleCount: 2,
    optimalSize: 6,
    status: 'Processing',
    assignedRobot: 'OT2-002',
    estimatedTime: '50 min',
    priority: 'Normal',
    progress: 35,
    startTime: '09:00',
    protocolId: 'P002',
    protocolName: 'Lipid Analysis Protocol',
    createdAt: '2024-01-15'
  }, {
    id: 'REGIONALMED-THYROID-20240114',
    customerName: 'Regional Medical Group',
    testType: 'Thyroid Panel',
    sampleCount: 4,
    optimalSize: 8,
    status: 'Completed',
    assignedRobot: 'FLEX-001',
    estimatedTime: '60 min',
    priority: 'Normal',
    progress: 100,
    completedTime: '08:45',
    protocolId: 'P004',
    protocolName: 'Thyroid Function Protocol',
    createdAt: '2024-01-14'
  }];
  const initialOperations = [{
    id: 'OP001',
    batchId: 'METROHEALTH-CBC-20240115',
    fileName: 'CBC_Batch_METROHEALTH_20240115.json',
    targetRobot: 'OT2-001',
    status: 'Sent',
    createdAt: '2024-01-15 09:15:23',
    sentAt: '2024-01-15 09:16:45',
    acknowledgedAt: '2024-01-15 09:17:12',
    fileSize: '2.3 KB',
    attempts: 1,
    lastError: null,
    protocolId: 'P001',
    sampleCount: 8,
    priority: 'High',
    jsonContent: {
      protocol_id: 'P001',
      batch_id: 'METROHEALTH-CBC-20240115',
      samples: [{
        id: 'S001',
        position: 'A1',
        patient: 'John Doe',
        test: 'CBC'
      }, {
        id: 'S002',
        position: 'A2',
        patient: 'Jane Smith',
        test: 'CBC'
      }],
      robot_config: {
        pipettes: ['P20 Single', 'P300 Multi'],
        labware: ['96-well-plate', 'tip-rack-20ul']
      }
    }
  }, {
    id: 'OP002',
    batchId: 'COMMUNITYCARE-LIPID-20240115',
    fileName: 'LIPID_Batch_COMMUNITYCARE_20240115.json',
    targetRobot: 'OT2-002',
    status: 'Processing',
    createdAt: '2024-01-15 10:30:15',
    sentAt: '2024-01-15 10:31:22',
    acknowledgedAt: '2024-01-15 10:31:45',
    fileSize: '3.1 KB',
    attempts: 1,
    lastError: null,
    protocolId: 'P002',
    sampleCount: 6,
    priority: 'Normal',
    jsonContent: {
      protocol_id: 'P002',
      batch_id: 'COMMUNITYCARE-LIPID-20240115',
      samples: [{
        id: 'S004',
        position: 'A1',
        patient: 'Sarah Wilson',
        test: 'Lipid Panel'
      }, {
        id: 'S005',
        position: 'A2',
        patient: 'Robert Brown',
        test: 'Lipid Panel'
      }],
      robot_config: {
        pipettes: ['P1000 Single', 'P300 Multi'],
        labware: ['384-well-plate', 'tip-rack-1000ul']
      }
    }
  }, {
    id: 'OP003',
    batchId: 'B004',
    fileName: 'Thyroid_Batch_B004_20240114.json',
    targetRobot: 'FLEX-001',
    status: 'Failed',
    createdAt: '2024-01-14 14:20:10',
    sentAt: '2024-01-14 14:21:33',
    acknowledgedAt: null,
    fileSize: '4.2 KB',
    attempts: 3,
    lastError: 'Robot communication timeout after 30 seconds',
    protocolId: 'P004',
    sampleCount: 12,
    priority: 'Urgent',
    jsonContent: {
      protocol_id: 'P004',
      batch_id: 'B004',
      samples: [{
        id: 'S010',
        position: 'A1',
        patient: 'Michael Davis',
        test: 'Thyroid Panel'
      }, {
        id: 'S011',
        position: 'A2',
        patient: 'Lisa Chen',
        test: 'Thyroid Panel'
      }],
      robot_config: {
        pipettes: ['Flex 1-Channel 1000μL', 'Flex 8-Channel 50μL'],
        labware: ['384-well-plate', 'flex-tip-rack']
      }
    }
  }, {
    id: 'OP004',
    batchId: 'B005',
    fileName: 'DNA_Extract_B005_20240115.json',
    targetRobot: 'OT2-001',
    status: 'Queued',
    createdAt: '2024-01-15 11:45:18',
    sentAt: null,
    acknowledgedAt: null,
    fileSize: '1.8 KB',
    attempts: 0,
    lastError: null,
    protocolId: 'P005',
    sampleCount: 4,
    priority: 'Normal',
    jsonContent: {
      protocol_id: 'P005',
      batch_id: 'B005',
      samples: [{
        id: 'S015',
        position: 'A1',
        patient: 'Emma Johnson',
        test: 'DNA Extraction'
      }, {
        id: 'S016',
        position: 'A2',
        patient: 'David Wilson',
        test: 'DNA Extraction'
      }],
      robot_config: {
        pipettes: ['P20 Single', 'P300 Multi'],
        labware: ['96-well-plate', 'extraction-kit']
      }
    }
  }, {
    id: 'OP005',
    batchId: 'B003',
    fileName: 'CBC_Batch_B003_20240114.json',
    targetRobot: 'FLEX-001',
    status: 'Completed',
    createdAt: '2024-01-14 08:30:45',
    sentAt: '2024-01-14 08:32:12',
    acknowledgedAt: '2024-01-14 08:32:30',
    fileSize: '2.9 KB',
    attempts: 1,
    lastError: null,
    protocolId: 'P001',
    sampleCount: 10,
    priority: 'High',
    jsonContent: {
      protocol_id: 'P001',
      batch_id: 'B003',
      samples: [{
        id: 'S020',
        position: 'A1',
        patient: 'Alex Rodriguez',
        test: 'CBC'
      }, {
        id: 'S021',
        position: 'A2',
        patient: 'Maria Garcia',
        test: 'CBC'
      }],
      robot_config: {
        pipettes: ['Flex 1-Channel 1000μL', 'Flex 8-Channel 50μL'],
        labware: ['96-well-plate', 'flex-tip-rack']
      }
    }
  }];
  const newSampleQueue = [...initialSampleQueue];
  const newBatches = [...initialBatches];
  const newOperations = [...initialOperations];
  // Generate additional sample queue items
  for (let i = 8; i <= 100; i++) {
    newSampleQueue.push({
      id: `S${i.toString().padStart(3, '0')}`,
      patientName: `Patient ${i}`,
      testType: ['Complete Blood Count', 'Lipid Panel', 'Liver Function', 'Thyroid Panel'][Math.floor(Math.random() * 4)],
      priority: ['Urgent', 'High', 'Normal'][Math.floor(Math.random() * 3)],
      collectionTime: `${Math.floor(Math.random() * 12 + 8).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      estimatedDuration: `${Math.floor(Math.random() * 30 + 15)} min`,
      batchId: Math.random() > 0.3 ? `B${Math.floor(Math.random() * 10 + 1).toString().padStart(3, '0')}` : null,
      status: ['Queued', 'Processing', 'Pending'][Math.floor(Math.random() * 3)]
    });
  }
  // Generate additional batches
  const organizations = ['METROHEALTH', 'COMMUNITYCARE', 'REGIONALMED'];
  const testTypes = ['Complete Blood Count', 'Lipid Panel', 'Thyroid Panel', 'Liver Function'];
  const robots = ['OT2-001', 'OT2-002', 'FLEX-001'];
  for (let i = 4; i <= 100; i++) {
    const org = organizations[Math.floor(Math.random() * organizations.length)];
    const testType = testTypes[Math.floor(Math.random() * testTypes.length)];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    newBatches.push({
      id: `${org}-${testType.replace(/\s+/g, '')}-${dateStr}`,
      customerName: org.split('-').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
      testType,
      sampleCount: Math.floor(Math.random() * 6 + 2),
      optimalSize: 8,
      status: ['Ready', 'Processing', 'Completed'][Math.floor(Math.random() * 3)],
      assignedRobot: robots[Math.floor(Math.random() * robots.length)],
      estimatedTime: `${Math.floor(Math.random() * 30 + 30)} min`,
      priority: ['High', 'Normal'][Math.floor(Math.random() * 2)],
      progress: Math.floor(Math.random() * 100),
      protocolId: Math.random() > 0.3 ? `P00${Math.floor(Math.random() * 6 + 1)}` : null,
      protocolName: Math.random() > 0.3 ? `${testType} Protocol` : null,
      createdAt: date.toISOString().split('T')[0]
    });
  }
  // Generate additional operations
  for (let i = 6; i <= 100; i++) {
    const batch = newBatches[Math.floor(Math.random() * newBatches.length)];
    const status = ['Queued', 'Sent', 'Processing', 'Completed', 'Failed'][Math.floor(Math.random() * 5)];
    const createdAt = new Date();
    createdAt.setHours(createdAt.getHours() - Math.floor(Math.random() * 48));
    const operation = {
      id: `OP${i.toString().padStart(3, '0')}`,
      batchId: batch.id,
      fileName: `${batch.testType.replace(/\s+/g, '_')}_Batch_${batch.id.split('-')[0]}_${batch.createdAt.replace(/-/g, '')}.json`,
      targetRobot: batch.assignedRobot,
      status,
      createdAt: createdAt.toISOString().replace('T', ' ').split('.')[0],
      sentAt: status !== 'Queued' ? new Date(createdAt.getTime() + 1000 * 60).toISOString().replace('T', ' ').split('.')[0] : null,
      acknowledgedAt: ['Processing', 'Completed'].includes(status) ? new Date(createdAt.getTime() + 1000 * 120).toISOString().replace('T', ' ').split('.')[0] : null,
      fileSize: `${Math.floor(Math.random() * 3 + 1)}.${Math.floor(Math.random() * 9)}KB`,
      attempts: status === 'Failed' ? Math.floor(Math.random() * 3 + 1) : 1,
      lastError: status === 'Failed' ? 'Communication timeout error' : null,
      protocolId: batch.protocolId,
      sampleCount: batch.sampleCount,
      priority: batch.priority,
      jsonContent: {
        protocol_id: batch.protocolId,
        batch_id: batch.id,
        samples: [{
          id: `S${Math.floor(Math.random() * 100 + 1).toString().padStart(3, '0')}`,
          position: 'A1',
          patient: `Patient ${Math.floor(Math.random() * 100 + 1)}`,
          test: batch.testType
        }],
        robot_config: {
          pipettes: ['P20 Single', 'P300 Multi'],
          labware: ['96-well-plate', 'tip-rack-20ul']
        }
      }
    };
    newOperations.push(operation);
  }
  return {
    sampleQueue: newSampleQueue,
    batches: newBatches,
    operations: newOperations
  };
};
const {
  sampleQueue,
  batches,
  operations
} = generateSampleData();
export function BatchProcessing() {
  const [selectedTab, setSelectedTab] = useState('queue');
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [showProtocolDesigner, setShowProtocolDesigner] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [editingProtocol, setEditingProtocol] = useState<string | null>(null);
  // Operations Management State
  const [selectedOperations, setSelectedOperations] = useState<string[]>([]);
  const [operationsSearchTerm, setOperationsSearchTerm] = useState('');
  const [operationsStatusFilter, setOperationsStatusFilter] = useState('All');
  const [operationsRobotFilter, setOperationsRobotFilter] = useState('All');
  const [operationsDateFilter, setOperationsDateFilter] = useState('All');
  const [expandedOperation, setExpandedOperation] = useState<string | null>(null);
  const [showJsonPreview, setShowJsonPreview] = useState<string | null>(null);
  // Protocol Designer State
  const [designerSampleCapacity, setDesignerSampleCapacity] = useState(24);
  const [designerWellLayout, setDesignerWellLayout] = useState<Record<string, any>>({});
  const [selectedWellType, setSelectedWellType] = useState('sample');
  const [protocolForm, setProtocolForm] = useState({
    name: '',
    description: '',
    testTypes: [] as string[],
    duration: '',
    robotCompatibility: [] as string[],
    protocolType: 'testing',
    plateFormat: '96-well'
  });
  // Add these new state variables inside BatchProcessing component
  const [sortColumn, setSortColumn] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [customerFilter, setCustomerFilter] = useState('All');
  const [batchSearchTerm, setBatchSearchTerm] = useState('');
  // Add these new functions inside BatchProcessing component
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  const getSortedAndFilteredBatches = () => {
    return batches.filter(batch => {
      const matchesSearch = batch.id.toLowerCase().includes(batchSearchTerm.toLowerCase()) || batch.customerName.toLowerCase().includes(batchSearchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || batch.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || batch.priority === priorityFilter;
      const matchesCustomer = customerFilter === 'All' || batch.customerName === customerFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesCustomer;
    }).sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      switch (sortColumn) {
        case 'customerName':
          return direction * a.customerName.localeCompare(b.customerName);
        case 'status':
          return direction * a.status.localeCompare(b.status);
        case 'progress':
          return direction * (a.progress - b.progress);
        case 'sampleCount':
          return direction * (a.sampleCount - b.sampleCount);
        case 'createdAt':
          return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        default:
          return 0;
      }
    });
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return 'bg-blue-600 text-white';
      case 'Ready':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      case 'Protocol Assigned':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getEquipmentStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Running':
        return 'bg-blue-100 text-blue-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const groupedSamples = sampleQueue.reduce((acc, sample) => {
    if (!acc[sample.testType]) {
      acc[sample.testType] = [];
    }
    acc[sample.testType].push(sample);
    return acc;
  }, {} as Record<string, typeof sampleQueue>);
  const handleAssignProtocol = (batchId: string) => {
    setSelectedBatch(batchId);
    setShowProtocolModal(true);
  };
  const handleProtocolAssignment = () => {
    if (selectedBatch && selectedProtocol) {
      console.log(`Assigning protocol ${selectedProtocol} to batch ${selectedBatch}`);
      setShowProtocolModal(false);
      setSelectedBatch(null);
      setSelectedProtocol(null);
    }
  };
  const getCompatibleProtocols = (testType: string, robotId: string) => {
    return availableProtocols.filter(protocol => protocol.testTypes.includes(testType) && protocol.robotCompatibility.includes(robotId));
  };
  const openProtocolDesigner = (protocolId?: string) => {
    if (protocolId) {
      const protocol = availableProtocols.find(p => p.id === protocolId);
      if (protocol) {
        setEditingProtocol(protocolId);
        setProtocolForm({
          name: protocol.name,
          description: protocol.description,
          testTypes: protocol.testTypes,
          duration: protocol.duration,
          robotCompatibility: protocol.robotCompatibility,
          protocolType: protocol.protocolType,
          plateFormat: protocol.plateFormat
        });
        setDesignerSampleCapacity(protocol.sampleCapacity);
        setDesignerWellLayout(protocol.wellLayout || {});
      }
    } else {
      setEditingProtocol(null);
      setProtocolForm({
        name: '',
        description: '',
        testTypes: [],
        duration: '',
        robotCompatibility: [],
        protocolType: 'testing',
        plateFormat: '96-well'
      });
      setDesignerSampleCapacity(24);
      setDesignerWellLayout({});
    }
    setShowProtocolDesigner(true);
  };
  const generatePlateLayout = (sampleCapacity: number) => {
    const is384Well = protocolForm.plateFormat === '384-well';
    const rows = is384Well ? ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'] : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = Array.from({
      length: is384Well ? 24 : 12
    }, (_, i) => i + 1);
    const wells = [];
    for (const row of rows) {
      for (const col of cols) {
        const wellId = `${row}${col}`;
        let type = 'empty';
        let label = '';
        // Auto-assign samples based on capacity
        if (sampleCapacity > 0) {
          for (let i = 0; i < sampleCapacity; i++) {
            const well = wells.find(w => w.id === wellId);
            if (!well) {
              newLayout[wellId] = {
                type: 'sample',
                label: `S${(i + 1).toString().padStart(2, '0')}`
              };
              sampleCount++;
            }
          }
        }
        // Auto-assign controls
        if (sampleCount < 3) {
          const controlTypes = ['control_positive', 'control_negative', 'control_quality'];
          const controlLabels = ['PC', 'NC', 'QC'];
          newLayout[wellId] = {
            type: controlTypes[controlCount],
            label: controlLabels[controlCount]
          };
          controlCount++;
        }
        // Auto-assign standards
        if (controlCount < 3) {
          newLayout[wellId] = {
            type: 'standard',
            label: `STD${standardCount + 1}`
          };
          standardCount++;
        }
        // Auto-assign empty wells
        else {
          newLayout[wellId] = {
            type: 'empty',
            label: ''
          };
        }
      }
    }
    setDesignerWellLayout(newLayout);
  };
  const autoAssignWells = () => {
    const newLayout: Record<string, any> = {};
    const is384Well = protocolForm.plateFormat === '384-well';
    const rows = is384Well ? ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'] : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = Array.from({
      length: is384Well ? 24 : 12
    }, (_, i) => i + 1);
    let sampleCount = 0;
    let controlCount = 0;
    let standardCount = 0;
    // Auto-assign samples based on capacity
    for (const row of rows) {
      for (const col of cols) {
        const wellId = `${row}${col}`;
        if (sampleCount < designerSampleCapacity) {
          newLayout[wellId] = {
            type: 'sample',
            label: `S${(sampleCount + 1).toString().padStart(2, '0')}`
          };
          sampleCount++;
        } else if (controlCount < 3) {
          const controlTypes = ['control_positive', 'control_negative', 'control_quality'];
          const controlLabels = ['PC', 'NC', 'QC'];
          newLayout[wellId] = {
            type: controlTypes[controlCount],
            label: controlLabels[controlCount]
          };
          controlCount++;
        } else if (standardCount < 3) {
          newLayout[wellId] = {
            type: 'standard',
            label: `STD${standardCount + 1}`
          };
          standardCount++;
        } else {
          newLayout[wellId] = {
            type: 'empty',
            label: ''
          };
        }
      }
    }
    setDesignerWellLayout(newLayout);
  };
  const clearAllWells = () => {
    setDesignerWellLayout({});
  };
  const saveProtocol = () => {
    // Here you would save the protocol to your backend
    console.log('Saving protocol:', {
      ...protocolForm,
      sampleCapacity: designerSampleCapacity,
      wellLayout: designerWellLayout
    });
    setShowProtocolDesigner(false);
  };
  const PlateDesigner = () => {
    const is384Well = protocolForm.plateFormat === '384-well';
    const rows = is384Well ? ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'] : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = Array.from({
      length: is384Well ? 24 : 12
    }, (_, i) => i + 1);
    const wells = generatePlateLayout(designerSampleCapacity);
    const getWellColor = (type: string) => {
      const wellType = wellTypes.find(w => w.id === type);
      return wellType?.color || 'bg-gray-100';
    };
    const wellSize = is384Well ? 'w-3 h-3' : 'w-6 h-6';
    const containerSize = is384Well ? 'w-4 h-4' : 'w-8 h-8';
    const headerSize = is384Well ? 'w-4 h-4' : 'w-8 h-8';
    const rowHeaderSize = is384Well ? 'w-4 h-4' : 'w-8 h-8';
    const handleWellClick = (wellId: string) => {
      const newLayout = {
        ...designerWellLayout
      };
      if (selectedWellType === 'empty') {
        delete newLayout[wellId];
      } else {
        let label = '';
        if (selectedWellType === 'sample') {
          const sampleCount = Object.values(designerWellLayout).filter(w => w.type === 'sample').length + 1;
          label = `S${sampleCount.toString().padStart(2, '0')}`;
        } else if (selectedWellType === 'control_positive') {
          label = 'PC';
        } else if (selectedWellType === 'control_negative') {
          label = 'NC';
        } else if (selectedWellType === 'control_quality') {
          label = 'QC';
        } else if (selectedWellType === 'standard') {
          const standardCount = Object.values(designerWellLayout).filter(w => w.type === 'standard').length + 1;
          label = `STD${standardCount}`;
        } else if (selectedWellType === 'blank') {
          label = 'BLK';
        }
        newLayout[wellId] = {
          type: selectedWellType,
          label: label
        };
      }
      setDesignerWellLayout(newLayout);
    };
    return <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              Plate Layout Designer
            </h4>
            <p className="text-sm text-gray-600">
              Click wells to assign contents • Sample Capacity:{' '}
              {designerSampleCapacity} • Format: {protocolForm.plateFormat}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={autoAssignWells} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200">
              Auto Assign
            </button>
            <button onClick={clearAllWells} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-200">
              Clear All
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Well Type Selector */}
          <div className="lg:col-span-1">
            <h5 className="text-sm font-semibold text-gray-900 mb-3">
              Well Types
            </h5>
            <div className="space-y-2">
              {wellTypes.map(wellType => <button key={wellType.id} onClick={() => setSelectedWellType(wellType.id)} className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 ${selectedWellType === wellType.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                  <div className={`w-4 h-4 rounded-full ${wellType.color} border border-gray-300`}></div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {wellType.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {wellType.description}
                    </div>
                  </div>
                </button>)}
            </div>
          </div>
          {/* Plate Layout */}
          <div className="lg:col-span-3">
            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <div className="inline-block min-w-full">
                {/* Column headers */}
                <div className="flex mb-1">
                  <div className={rowHeaderSize}></div>
                  {cols.map(col => <div key={col} className={`${headerSize} flex items-center justify-center text-xs font-semibold text-gray-600`}>
                      {col}
                    </div>)}
                </div>
                {/* Plate grid */}
                {rows.map(row => <div key={row} className="flex mb-1">
                    {/* Row header */}
                    <div className={`${rowHeaderSize} flex items-center justify-center text-xs font-semibold text-gray-600`}>
                      {row}
                    </div>
                    {/* Wells */}
                    {cols.map(col => {
                  const wellId = `${row}${col}`;
                  const well = wells.find(w => w.id === wellId);
                  return <div key={wellId} className={`${containerSize} flex items-center justify-center p-0.5`}>
                          <button onClick={() => handleWellClick(wellId)} className={`${wellSize} rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer shadow-sm ${getWellColor(well?.type || 'empty')} border-gray-300 hover:border-gray-400`} title={`${wellId}${well?.label ? ` - ${well.label}` : ''}`}>
                            {well?.label && well.type !== 'empty' && !is384Well && <span className="text-xs font-bold text-white" style={{
                        fontSize: '8px'
                      }}>
                                  {well.label.length > 2 ? well.label.substring(0, 2) : well.label}
                                </span>}
                          </button>
                        </div>;
                })}
                  </div>)}
              </div>
            </div>
            {/* Well Statistics */}
            <div className="mt-4 grid grid-cols-4 gap-4">
              {wellTypes.slice(0, 4).map(wellType => {
              const count = Object.values(designerWellLayout).filter(w => w.type === wellType.id).length;
              return <div key={wellType.id} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className={`w-4 h-4 rounded-full ${wellType.color} mx-auto mb-1`}></div>
                    <div className="text-sm font-bold text-gray-900">
                      {count}
                    </div>
                    <div className="text-xs text-gray-600">
                      {wellType.label}
                    </div>
                  </div>;
            })}
            </div>
            {/* Plate Format Info */}
            <div className="mt-4 text-center">
              <div className="text-xs bg-gray-100 px-3 py-1 rounded-full inline-block">
                {is384Well ? '384-Well Plate (16×24)' : '96-Well Plate (8×12)'}{' '}
                • {wells.length} total wells
              </div>
            </div>
          </div>
        </div>
      </div>;
  };
  const generate96WellPlate = (batchId: string) => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = Array.from({
      length: 12
    }, (_, i) => i + 1);
    const wells = [];
    for (const row of rows) {
      for (const col of cols) {
        const wellId = `${row}${col}`;
        let type = 'empty';
        let label = '';
        // Sample wells (first 6 columns for samples)
        if (col <= 6 && row <= 'D') {
          type = 'sample';
          label = `S${(rows.indexOf(row) * 6 + col).toString().padStart(2, '0')}`;
        }
        // Control wells
        else if (col === 7 && row <= 'C') {
          if (row === 'A') {
            type = 'control';
            label = 'QC';
          } else if (row === 'B') {
            type = 'control';
            label = 'PC';
          } else if (row === 'C') {
            type = 'control';
            label = 'NC';
          }
        }
        // Standards wells
        else if (col >= 10 && row <= 'B') {
          type = 'standard';
          label = 'STD';
        }
        wells.push({
          id: wellId,
          type,
          label,
          row,
          col
        });
      }
    }
    return wells;
  };
  const generate384WellPlate = (batchId: string) => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
    const cols = Array.from({
      length: 24
    }, (_, i) => i + 1);
    const wells = [];
    for (const row of rows) {
      for (const col of cols) {
        const wellId = `${row}${col}`;
        let type = 'empty';
        let label = '';
        // Sample wells (first 16 columns for samples, alternating pattern)
        if (col <= 16 && row <= 'L') {
          // Create a checkerboard pattern for better sample distribution
          if ((rows.indexOf(row) + col) % 2 === 0) {
            type = 'sample';
            const sampleNum = Math.floor((rows.indexOf(row) * 8 + col) / 2);
            label = `S${sampleNum.toString().padStart(2, '0')}`;
          }
        }
        // Control wells (dedicated area)
        else if (col >= 17 && col <= 20 && row <= 'D') {
          if (row === 'A') {
            type = 'control';
            label = 'QC';
          } else if (row === 'B') {
            type = 'control';
            label = 'PC';
          } else if (row === 'C') {
            type = 'control';
            label = 'NC';
          } else if (row === 'D') {
            type = 'control';
            label = 'BLK';
          }
        }
        // Standards and calibrators
        else if (col >= 21 && row <= 'H') {
          type = 'standard';
          label = 'CAL';
        }
        wells.push({
          id: wellId,
          type,
          label,
          row,
          col
        });
      }
    }
    return wells;
  };
  const PlateLayout = ({
    batchId,
    protocolId
  }: {
    batchId: string;
    protocolId: string;
  }) => {
    const protocol = availableProtocols.find(p => p.id === protocolId);
    const is384Well = protocol?.plateFormat === '384-well';
    const wells = is384Well ? generate384WellPlate(batchId) : generate96WellPlate(batchId);
    const rows = is384Well ? ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'] : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = Array.from({
      length: is384Well ? 24 : 12
    }, (_, i) => i + 1);
    const getWellColor = (type: string) => {
      switch (type) {
        case 'sample':
          return 'bg-green-500 border-green-600';
        case 'control':
          return 'bg-blue-500 border-blue-600';
        case 'standard':
          return 'bg-red-500 border-red-600';
        default:
          return 'bg-gray-100 border-gray-200';
      }
    };
    const wellSize = is384Well ? 'w-3 h-3' : 'w-6 h-6';
    const containerSize = is384Well ? 'w-4 h-4' : 'w-8 h-8';
    const headerSize = is384Well ? 'w-3 h-4' : 'w-8 h-6';
    const rowHeaderSize = is384Well ? 'w-4 h-4' : 'w-8 h-8';
    return <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              {is384Well ? '384-Well' : '96-Well'} Plate Layout
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {protocol?.protocolType === 'extraction' ? 'Extraction Protocol' : 'Testing Protocol'}{' '}
              • {protocol?.name}
            </p>
          </div>
          <div className="flex items-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500 border border-green-600 shadow-sm"></div>
              <span className="text-gray-700 font-medium">Sample</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-600 shadow-sm"></div>
              <span className="text-gray-700 font-medium">Control</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600 shadow-sm"></div>
              <span className="text-gray-700 font-medium">Standard</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200"></div>
              <span className="text-gray-700 font-medium">Empty</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg p-4 shadow-inner">
          <div className="inline-block min-w-full">
            {/* Column headers */}
            <div className="flex mb-1">
              <div className={rowHeaderSize}></div>
              {cols.map(col => <div key={col} className={`${headerSize} flex items-center justify-center text-xs font-semibold text-gray-600`}>
                  {col}
                </div>)}
            </div>
            {/* Plate grid */}
            {rows.map(row => <div key={row} className="flex mb-1">
                {/* Row header */}
                <div className={`${rowHeaderSize} flex items-center justify-center text-xs font-semibold text-gray-600`}>
                  {row}
                </div>
                {/* Wells */}
                {cols.map(col => {
              const well = wells.find(w => w.row === row && w.col === col);
              return <div key={`${row}${col}`} className={`${containerSize} flex items-center justify-center p-0.5`}>
                      <div className={`${wellSize} rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer shadow-sm ${getWellColor(well?.type || 'empty')}`} title={`${row}${col}${well?.label ? ` - ${well.label}` : ''}`}>
                        {well?.label && well.type !== 'empty' && !is384Well && <span className="text-xs font-bold text-white" style={{
                    fontSize: '8px'
                  }}>
                            {well.label.length > 3 ? well.label.substring(0, 2) : well.label}
                          </span>}
                      </div>
                    </div>;
            })}
              </div>)}
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <div>
            <span className="font-medium">Total Wells:</span> {wells.length} |
            <span className="font-medium ml-2">Used:</span>{' '}
            {wells.filter(w => w.type !== 'empty').length} |
            <span className="font-medium ml-2">Available:</span>{' '}
            {wells.filter(w => w.type === 'empty').length}
          </div>
          <div className="text-xs bg-gray-100 px-3 py-1 rounded-full">
            {is384Well ? 'High Density Format' : 'Standard Format'}
          </div>
        </div>
      </div>;
  };
  // Operations Management Functions
  const handleOperationSelect = (operationId: string) => {
    setSelectedOperations(prev => prev.includes(operationId) ? prev.filter(id => id !== operationId) : [...prev, operationId]);
  };
  const handleSelectAllOperations = () => {
    const filteredOps = getFilteredOperations();
    if (selectedOperations.length === filteredOps.length) {
      setSelectedOperations([]);
    } else {
      setSelectedOperations(filteredOps.map(op => op.id));
    }
  };
  const getFilteredOperations = () => {
    return operations.filter(operation => {
      const matchesSearch = operation.fileName.toLowerCase().includes(operationsSearchTerm.toLowerCase()) || operation.batchId.toLowerCase().includes(operationsSearchTerm.toLowerCase()) || operation.id.toLowerCase().includes(operationsSearchTerm.toLowerCase());
      const matchesStatus = operationsStatusFilter === 'All' || operation.status === operationsStatusFilter;
      const matchesRobot = operationsRobotFilter === 'All' || operation.targetRobot === operationsRobotFilter;
      let matchesDate = true;
      if (operationsDateFilter !== 'All') {
        const today = new Date();
        const operationDate = new Date(operation.createdAt);
        if (operationsDateFilter === 'Today') {
          matchesDate = operationDate.toDateString() === today.toDateString();
        } else if (operationsDateFilter === 'Yesterday') {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          matchesDate = operationDate.toDateString() === yesterday.toDateString();
        } else if (operationsDateFilter === 'Last 7 days') {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          matchesDate = operationDate >= weekAgo;
        }
      }
      return matchesSearch && matchesStatus && matchesRobot && matchesDate;
    });
  };
  const handleBulkSend = () => {
    console.log('Sending operations:', selectedOperations);
    // Implementation for bulk send
  };
  const handleBulkRetry = () => {
    console.log('Retrying operations:', selectedOperations);
    // Implementation for bulk retry
  };
  const handleBulkDownload = () => {
    console.log('Downloading operations:', selectedOperations);
    // Implementation for bulk download
  };
  const getOperationStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Sent':
        return 'bg-purple-100 text-purple-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Queued':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getOperationStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'Processing':
        return <PlayIcon className="h-4 w-4" />;
      case 'Sent':
        return <ArrowUpIcon className="h-4 w-4" />;
      case 'Failed':
        return <AlertTriangleIcon className="h-4 w-4" />;
      case 'Queued':
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };
  return <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Batch Processing Pipeline
              </h1>
              <p className="text-gray-600 text-lg">
                Manage sample queues, batch formation, protocol assignment, and
                automated processing
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-gray-50 shadow-sm transition-all duration-200">
                <RefreshCwIcon className="h-5 w-5" />
                <span className="font-medium">Refresh Queue</span>
              </button>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-blue-700 shadow-sm transition-all duration-200">
                <PlayIcon className="h-5 w-5" />
                <span className="font-medium">Start Next Batch</span>
              </button>
            </div>
          </div>
          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <nav className="flex">
              {[{
              key: 'queue',
              label: 'Sample Queue',
              icon: TestTubeIcon
            }, {
              key: 'batches',
              label: 'Active Batches',
              icon: FlaskConicalIcon
            }, {
              key: 'operations',
              label: 'Operations',
              icon: FileTextIcon
            }].map(tab => {
              const Icon = tab.icon;
              return <button key={tab.key} onClick={() => setSelectedTab(tab.key)} className={`flex-1 flex items-center justify-center space-x-3 py-6 px-4 font-medium text-sm transition-all duration-200 ${selectedTab === tab.key ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>;
            })}
            </nav>
          </div>
        </div>
        {/* Sample Queue Tab */}
        {selectedTab === 'queue' && <div className="space-y-8">
            {/* Queue Overview Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[{
            label: 'Total Samples',
            value: sampleQueue.length,
            icon: TestTubeIcon,
            color: 'blue',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600'
          }, {
            label: 'Pending',
            value: sampleQueue.filter(s => s.status === 'Pending').length,
            icon: ClockIcon,
            color: 'yellow',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-600'
          }, {
            label: 'Processing',
            value: sampleQueue.filter(s => s.status === 'Processing').length,
            icon: PlayIcon,
            color: 'blue',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600'
          }, {
            label: 'Urgent',
            value: sampleQueue.filter(s => s.priority === 'Urgent').length,
            icon: AlertTriangleIcon,
            color: 'red',
            bgColor: 'bg-red-100',
            textColor: 'text-red-600'
          }, {
            label: 'High Priority',
            value: sampleQueue.filter(s => s.priority === 'High').length,
            icon: TrendingUpIcon,
            color: 'orange',
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-600'
          }].map(stat => {
            const Icon = stat.icon;
            return <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                        <Icon className={`h-6 w-6 ${stat.textColor}`} />
                      </div>
                    </div>
                  </div>;
          })}
            </div>
            {/* Sample Queue Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Sample Queue
                  </h2>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {sampleQueue.length} samples
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-all duration-200">
                    <PlayIcon className="h-4 w-4" />
                    <span>Process Selected</span>
                  </button>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-all duration-200">
                    <LayersIcon className="h-4 w-4" />
                    <span>Create Batch</span>
                  </button>
                </div>
              </div>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <SearchIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input type="text" placeholder="Search samples..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Queued">Queued</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="All">All Priorities</option>
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>
              {/* Grouped Sample Queue */}
              <div className="space-y-8">
                {Object.entries(sampleQueue.reduce((acc, sample) => {
              // Group by organization first
              const org = sample.batchId?.split('-')[0] || 'Unassigned';
              if (!acc[org]) {
                acc[org] = {};
              }
              // Then by test type
              if (!acc[org][sample.testType]) {
                acc[org][sample.testType] = [];
              }
              acc[org][sample.testType].push(sample);
              return acc;
            }, {} as Record<string, Record<string, typeof sampleQueue>>)).map(([org, testTypes]) => <div key={org} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <BuildingIcon className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {org === 'METROHEALTH' ? 'Metro Health System' : org === 'COMMUNITYCARE' ? 'Community Care Clinics' : org === 'REGIONALMED' ? 'Regional Medical Group' : org}
                        </h3>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {Object.entries(testTypes).map(([testType, samples]) => <div key={testType} className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <FlaskConicalIcon className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {testType}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {samples.length} samples
                                </p>
                              </div>
                            </div>
                            <button className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700">
                              Create Batch
                            </button>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left">
                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sample Details
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Priority
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {samples.map(sample => <tr key={sample.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    </td>
                                    <td className="px-4 py-4">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <TestTubeIcon className="h-5 w-5 text-blue-600" />
                                          </div>
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">
                                            {sample.patientName}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {sample.id}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityColor(sample.priority)}`}>
                                        {sample.priority}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(sample.status)}`}>
                                        {sample.status}
                                      </span>
                                    </td>
                                  </tr>)}
                              </tbody>
                            </table>
                          </div>
                        </div>)}
                    </div>
                  </div>)}
              </div>
            </div>
          </div>}
        {/* Active Batches Tab */}
        {selectedTab === 'batches' && <div className="space-y-8">
            {/* Batch Overview Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[{
            label: 'Total Batches',
            value: batches.length,
            icon: FlaskConicalIcon,
            color: 'blue',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600'
          }, {
            label: 'Processing',
            value: batches.filter(b => b.status === 'Processing').length,
            icon: PlayIcon,
            color: 'blue',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600'
          }, {
            label: 'Ready',
            value: batches.filter(b => b.status === 'Ready').length,
            icon: ClockIcon,
            color: 'yellow',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-600'
          }, {
            label: 'High Priority',
            value: batches.filter(b => b.priority === 'High').length,
            icon: AlertTriangleIcon,
            color: 'orange',
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-600'
          }, {
            label: 'Completed',
            value: batches.filter(b => b.status === 'Completed').length,
            icon: CheckCircleIcon,
            color: 'green',
            bgColor: 'bg-green-100',
            textColor: 'text-green-600'
          }].map(stat => {
            const Icon = stat.icon;
            return <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                        <Icon className={`h-6 w-6 ${stat.textColor}`} />
                      </div>
                    </div>
                  </div>;
          })}
            </div>
            {/* Batch Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Active Batches
                  </h2>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {getSortedAndFilteredBatches().length} batches
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-all duration-200">
                    <PlayIcon className="h-4 w-4" />
                    <span>Start Selected</span>
                  </button>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-all duration-200">
                    <FileTextIcon className="h-4 w-4" />
                    <span>Assign Protocol</span>
                  </button>
                </div>
              </div>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <SearchIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input type="text" placeholder="Search batches..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={batchSearchTerm} onChange={e => setBatchSearchTerm(e.target.value)} />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="All">All Status</option>
                  <option value="Ready">Ready</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                  <option value="All">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={customerFilter} onChange={e => setCustomerFilter(e.target.value)}>
                  <option value="All">All Customers</option>
                  {Array.from(new Set(batches.map(b => b.customerName))).map(customer => <option key={customer} value={customer}>
                        {customer}
                      </option>)}
                </select>
              </div>
              {/* Batch Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                      </th>
                      <th onClick={() => handleSort('customerName')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center space-x-1">
                          <span>Batch Details</span>
                          {sortColumn === 'customerName' && <span>
                              {sortDirection === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                            </span>}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Protocol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Robot
                      </th>
                      <th onClick={() => handleSort('progress')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center space-x-1">
                          <span>Progress</span>
                          {sortColumn === 'progress' && <span>
                              {sortDirection === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                            </span>}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getSortedAndFilteredBatches().map(batch => <Fragment key={batch.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <FlaskConicalIcon className="h-5 w-5 text-blue-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {batch.customerName}
                                  </span>
                                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(batch.status)}`}>
                                    {batch.status}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {batch.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {batch.protocolId ? <div className="flex items-center space-x-2">
                                <FileTextIcon className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium text-gray-900">
                                  {batch.protocolName}
                                </span>
                              </div> : <button onClick={() => handleAssignProtocol(batch.id)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Assign Protocol
                              </button>}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-900">
                                {batch.sampleCount}/{batch.optimalSize}
                              </span>
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{
                            width: `${batch.sampleCount / batch.optimalSize * 100}%`
                          }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <CpuIcon className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-gray-900">
                                {batch.assignedRobot}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {batch.status === 'Processing' ? <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-gray-600">
                                    {batch.progress}%
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Est: {batch.estimatedTime}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{
                            width: `${batch.progress}%`
                          }}></div>
                                </div>
                              </div> : <span className="text-sm text-gray-500">
                                {batch.status === 'Completed' ? `Completed at ${batch.completedTime}` : batch.estimatedTime}
                              </span>}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              {batch.status === 'Processing' ? <>
                                  <button className="p-2 text-yellow-700 hover:bg-yellow-100 rounded-lg transition-all duration-200">
                                    <PauseIcon className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                                    <SettingsIcon className="h-4 w-4" />
                                  </button>
                                </> : batch.status === 'Ready' && batch.protocolId ? <>
                                  <button className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg transition-all duration-200">
                                    <PlayIcon className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                                    <SettingsIcon className="h-4 w-4" />
                                  </button>
                                </> : batch.status === 'Ready' ? <button className="p-2 text-gray-400 cursor-not-allowed">
                                  <PlayIcon className="h-4 w-4" />
                                </button> : <CheckCircleIcon className="h-5 w-5 text-green-600" />}
                              {batch.protocolId && <button onClick={() => setExpandedBatch(expandedBatch === batch.id ? null : batch.id)} className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                                  {expandedBatch === batch.id ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                                </button>}
                            </div>
                          </td>
                        </tr>
                        {/* Expandable Plate Layout */}
                        {expandedBatch === batch.id && batch.protocolId && <tr>
                            <td colSpan={6} className="bg-gray-50 border-t border-gray-200">
                              <div className="p-6">
                                <PlateLayout batchId={batch.id} protocolId={batch.protocolId} />
                              </div>
                            </td>
                          </tr>}
                      </Fragment>)}
                  </tbody>
                </table>
                {getSortedAndFilteredBatches().length === 0 && <div className="text-center py-8 text-gray-500">
                    No batches match the current filters
                  </div>}
              </div>
            </div>
          </div>}
        {/* Operations Management Tab */}
        {selectedTab === 'operations' && <div className="space-y-8">
            {/* Operations Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[{
            label: 'Total Operations',
            value: operations.length,
            icon: FileTextIcon,
            color: 'blue',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600'
          }, {
            label: 'Queued',
            value: operations.filter(op => op.status === 'Queued').length,
            icon: ClockIcon,
            color: 'yellow',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-600'
          }, {
            label: 'Processing',
            value: operations.filter(op => op.status === 'Processing').length,
            icon: PlayIcon,
            color: 'blue',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600'
          }, {
            label: 'Failed',
            value: operations.filter(op => op.status === 'Failed').length,
            icon: AlertTriangleIcon,
            color: 'red',
            bgColor: 'bg-red-100',
            textColor: 'text-red-600'
          }, {
            label: 'Completed',
            value: operations.filter(op => op.status === 'Completed').length,
            icon: CheckCircleIcon,
            color: 'green',
            bgColor: 'bg-green-100',
            textColor: 'text-green-600'
          }].map(stat => {
            const Icon = stat.icon;
            return <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                        <Icon className={`h-6 w-6 ${stat.textColor}`} />
                      </div>
                    </div>
                  </div>;
          })}
            </div>
            {/* Operations Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Operations Queue
                  </h2>
                  {selectedOperations.length > 0 && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedOperations.length} selected
                    </span>}
                </div>
                {/* Bulk Actions */}
                {selectedOperations.length > 0 && <div className="flex items-center space-x-3">
                    <button onClick={handleBulkSend} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-all duration-200">
                      <ArrowUpIcon className="h-4 w-4" />
                      <span>Send ({selectedOperations.length})</span>
                    </button>
                    <button onClick={handleBulkRetry} className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-700 transition-all duration-200">
                      <RefreshCwIcon className="h-4 w-4" />
                      <span>Retry</span>
                    </button>
                    <button onClick={handleBulkDownload} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-all duration-200">
                      <DownloadIcon className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>}
              </div>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <SearchIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input type="text" placeholder="Search operations..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={operationsSearchTerm} onChange={e => setOperationsSearchTerm(e.target.value)} />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={operationsStatusFilter} onChange={e => setOperationsStatusFilter(e.target.value)}>
                  <option value="All">All Status</option>
                  <option value="Queued">Queued</option>
                  <option value="Sent">Sent</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={operationsRobotFilter} onChange={e => setOperationsRobotFilter(e.target.value)}>
                  <option value="All">All Robots</option>
                  <option value="OT2-001">OT2-001</option>
                  <option value="OT2-002">OT2-002</option>
                  <option value="FLEX-001">FLEX-001</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={operationsDateFilter} onChange={e => setOperationsDateFilter(e.target.value)}>
                  <option value="All">All Dates</option>
                  <option value="Today">Today</option>
                  <option value="Yesterday">Yesterday</option>
                  <option value="Last 7 days">Last 7 days</option>
                </select>
              </div>
              {/* Operations Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Operation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Batch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Target Robot
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attempts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredOperations().map(operation => <Fragment key={operation.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={selectedOperations.includes(operation.id)} onChange={() => handleOperationSelect(operation.id)} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <FileTextIcon className="h-5 w-5 text-blue-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {operation.fileName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {operation.id} • {operation.fileSize}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {operation.batchId}
                            </div>
                            <div className="text-sm text-gray-500">
                              {operation.sampleCount} samples
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <CpuIcon className="h-4 w-4 text-blue-600 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {operation.targetRobot}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full font-medium ${getOperationStatusColor(operation.status)}`}>
                              {getOperationStatusIcon(operation.status)}
                              <span>{operation.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(operation.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">
                                {operation.attempts}
                              </span>
                              {operation.attempts > 1 && <AlertTriangleIcon className="h-4 w-4 text-orange-500" />}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button onClick={() => setExpandedOperation(expandedOperation === operation.id ? null : operation.id)} className="text-blue-600 hover:text-blue-900">
                                {expandedOperation === operation.id ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                              </button>
                              <button onClick={() => setShowJsonPreview(operation.id)} className="text-green-600 hover:text-green-900">
                                View JSON
                              </button>
                              {operation.status === 'Failed' && <button className="text-orange-600 hover:text-orange-900">
                                  Retry
                                </button>}
                              {operation.status === 'Queued' && <button className="text-blue-600 hover:text-blue-900">
                                  Send
                                </button>}
                            </div>
                          </td>
                        </tr>
                        {/* Expanded Operation Details */}
                        {expandedOperation === operation.id && <tr>
                            <td colSpan={8} className="px-6 py-4 bg-gray-50">
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                      Timeline
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">
                                          Created:
                                        </span>
                                        <span className="text-gray-900">
                                          {new Date(operation.createdAt).toLocaleString()}
                                        </span>
                                      </div>
                                      {operation.sentAt && <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Sent:
                                          </span>
                                          <span className="text-gray-900">
                                            {new Date(operation.sentAt).toLocaleString()}
                                          </span>
                                        </div>}
                                      {operation.acknowledgedAt && <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Acknowledged:
                                          </span>
                                          <span className="text-gray-900">
                                            {new Date(operation.acknowledgedAt).toLocaleString()}
                                          </span>
                                        </div>}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                      Protocol Info
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">
                                          Protocol ID:
                                        </span>
                                        <span className="text-gray-900">
                                          {operation.protocolId}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">
                                          Priority:
                                        </span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(operation.priority)}`}>
                                          {operation.priority}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                      Communication
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">
                                          Attempts:
                                        </span>
                                        <span className="text-gray-900">
                                          {operation.attempts}
                                        </span>
                                      </div>
                                      {operation.lastError && <div>
                                          <span className="text-gray-600">
                                            Last Error:
                                          </span>
                                          <p className="text-red-600 text-xs mt-1 p-2 bg-red-50 rounded border">
                                            {operation.lastError}
                                          </p>
                                        </div>}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>}
                      </Fragment>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>}
        {/* Protocol Assignment Modal */}
        {showProtocolModal && selectedBatch && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Assign Protocol
                    </h2>
                    <p className="text-gray-600">
                      Select a protocol for batch {selectedBatch}
                    </p>
                  </div>
                  <button onClick={() => setShowProtocolModal(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200">
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  {(() => {
                const batch = batches.find(b => b.id === selectedBatch);
                if (!batch) return null;
                const compatibleProtocols = getCompatibleProtocols(batch.testType, batch.assignedRobot);
                return compatibleProtocols.map(protocol => <div key={protocol.id} className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${selectedProtocol === protocol.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`} onClick={() => setSelectedProtocol(protocol.id)}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedProtocol === protocol.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                                {selectedProtocol === protocol.id && <CheckIcon className="h-3 w-3 text-white" />}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {protocol.name}
                              </h3>
                              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 font-medium">
                                {protocol.plateFormat}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                              {protocol.description}
                            </p>
                            <div className="flex items-center space-x-6 text-sm">
                              <span className="text-gray-500">
                                <span className="font-medium">Duration:</span>{' '}
                                {protocol.duration}
                              </span>
                              <span className="text-gray-500">
                                <span className="font-medium">
                                  Compatible with:
                                </span>{' '}
                                {batch.assignedRobot}
                              </span>
                              <span className="text-gray-500">
                                <span className="font-medium">Type:</span>{' '}
                                {protocol.protocolType}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>);
              })()}
                </div>
              </div>
              <div className="p-8 border-t border-gray-200 bg-gray-50 flex space-x-4">
                <button onClick={() => setShowProtocolModal(false)} className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200">
                  Cancel
                </button>
                <button onClick={handleProtocolAssignment} disabled={!selectedProtocol} className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${selectedProtocol ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                  Assign Protocol
                </button>
              </div>
            </div>
          </div>}
        {/* Protocol Designer Modal */}
        {showProtocolDesigner && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
              <div className="p-8 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {editingProtocol ? 'Edit Protocol' : 'Design New Protocol'}
                    </h2>
                    <p className="text-gray-600">
                      Create custom protocols with specific well layouts and
                      sample capacities
                    </p>
                  </div>
                  <button onClick={() => setShowProtocolDesigner(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200">
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="p-8 space-y-8">
                {/* Protocol Information Form */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Protocol Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Protocol Name
                      </label>
                      <input type="text" value={protocolForm.name} onChange={e => setProtocolForm(prev => ({
                    ...prev,
                    name: e.target.value
                  }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter protocol name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Duration
                      </label>
                      <input type="text" value={protocolForm.duration} onChange={e => setProtocolForm(prev => ({
                    ...prev,
                    duration: e.target.value
                  }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., 30 min" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea value={protocolForm.description} onChange={e => setProtocolForm(prev => ({
                    ...prev,
                    description: e.target.value
                  }))} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Describe the protocol purpose and procedure" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Protocol Type
                      </label>
                      <select value={protocolForm.protocolType} onChange={e => setProtocolForm(prev => ({
                    ...prev,
                    protocolType: e.target.value
                  }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="testing">Testing</option>
                        <option value="extraction">Extraction</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Plate Format
                      </label>
                      <select value={protocolForm.plateFormat} onChange={e => setProtocolForm(prev => ({
                    ...prev,
                    plateFormat: e.target.value
                  }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="96-well">96-Well Plate</option>
                        <option value="384-well">384-Well Plate</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Sample Capacity Selection */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Sample Capacity
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {[6, 12, 24, 36, 48].map(capacity => <button key={capacity} onClick={() => setDesignerSampleCapacity(capacity)} className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${designerSampleCapacity === capacity ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}>
                        {capacity} Samples
                      </button>)}
                  </div>
                  <p className="text-sm text-blue-700 mt-3">
                    Selected capacity:{' '}
                    <span className="font-semibold">
                      {designerSampleCapacity} samples
                    </span>
                  </p>
                </div>
                {/* Plate Designer */}
                <PlateDesigner />
              </div>
              <div className="p-8 border-t border-gray-200 bg-gray-50 flex space-x-4">
                <button onClick={() => setShowProtocolDesigner(false)} className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200">
                  Cancel
                </button>
                <button onClick={saveProtocol} className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 shadow-sm transition-all duration-200 flex items-center justify-center space-x-2">
                  <SaveIcon className="h-5 w-5" />
                  <span>
                    {editingProtocol ? 'Update Protocol' : 'Save Protocol'}
                  </span>
                </button>
              </div>
            </div>
          </div>}
        {/* JSON Preview Modal */}
        {showJsonPreview && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      JSON Preview
                    </h2>
                    <p className="text-gray-600">
                      Operation {showJsonPreview} -{' '}
                      {operations.find(op => op.id === showJsonPreview)?.fileName}
                    </p>
                  </div>
                  <button onClick={() => setShowJsonPreview(null)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200">
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                    {JSON.stringify(operations.find(op => op.id === showJsonPreview)?.jsonContent, null, 2)}
                  </pre>
                </div>
              </div>
              <div className="p-8 border-t border-gray-200 bg-gray-50 flex space-x-4">
                <button onClick={() => setShowJsonPreview(null)} className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200">
                  Close
                </button>
                <button className="bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 shadow-sm transition-all duration-200 flex items-center space-x-2">
                  <DownloadIcon className="h-5 w-5" />
                  <span>Download JSON</span>
                </button>
              </div>
            </div>
          </div>}
      </div>
    </div>;
}