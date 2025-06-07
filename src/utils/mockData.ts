import { 
  Location, 
  Provider, 
  Staff, 
  Sample, 
  PatientDetails, 
  Robot, 
  Protocol, 
  RunHistory, 
  Report, 
  Message, 
  Role, 
  AuditLog, 
  FeatureRequest, 
  Test,
  DevelopmentLogEntry
} from '../types';

// Mock locations data
export const locations: Location[] = [
  {
    id: 'LOC001',
    name: 'Metro Health Downtown',
    orgId: 'ORG001',
    address: '123 Medical Center Dr',
    city: 'Downtown',
    type: 'Main Hospital',
    status: 'Active'
  },
  {
    id: 'LOC002',
    name: 'Metro Health North',
    orgId: 'ORG001',
    address: '456 North Ave',
    city: 'Northside',
    type: 'Satellite Clinic',
    status: 'Active'
  },
  {
    id: 'LOC003',
    name: 'Community Care Central',
    orgId: 'ORG002',
    address: '789 Central St',
    city: 'Central',
    type: 'Primary Clinic',
    status: 'Active'
  },
  {
    id: 'LOC004',
    name: 'Community Care West',
    orgId: 'ORG002',
    address: '321 West Blvd',
    city: 'Westside',
    type: 'Urgent Care',
    status: 'Active'
  },
  {
    id: 'LOC005',
    name: 'Regional Med Main',
    orgId: 'ORG003',
    address: '654 Main St',
    city: 'Midtown',
    type: 'Medical Office',
    status: 'Active'
  }
];

// Mock providers data
export const providers: Provider[] = [
  {
    id: 'PROV001',
    name: 'Dr. Sarah Johnson',
    orgId: 'ORG001',
    specialty: 'Internal Medicine',
    phone: '(555) 111-2222',
    email: 'sjohnson@metrohealth.com',
    status: 'Active',
    title: 'MD',
    primaryLocation: 'Metro Health Downtown',
    npi: '1234567890',
    licenseNumber: 'MD12345',
    licenseState: 'CA',
    address: '123 Medical Center Dr, Suite 200, City, ST 12345',
    education: [
      { degree: 'MD', institution: 'Stanford University School of Medicine', year: '2010' },
      { degree: 'Residency', institution: 'UCSF Medical Center', year: '2014' },
      { degree: 'BS', institution: 'UCLA', year: '2006' }
    ],
    certifications: ['American Board of Internal Medicine', 'Advanced Cardiac Life Support'],
    languages: ['English', 'Spanish'],
    acceptingNewPatients: true,
    insuranceAccepted: ['Blue Cross', 'Aetna', 'Medicare', 'United Healthcare'],
    appointmentTypes: ['In-person', 'Telehealth'],
    officeHours: 'Mon-Fri: 8:00 AM - 5:00 PM',
    patientCount: 342,
    avgRating: 4.8,
    reviewCount: 76,
    lastOrderDate: '2024-01-15',
    orderCount: 128
  },
  {
    id: 'PROV002',
    name: 'Dr. Michael Chen',
    orgId: 'ORG001',
    specialty: 'Cardiology',
    phone: '(555) 111-3333',
    email: 'mchen@metrohealth.com',
    status: 'Active',
    title: 'MD',
    primaryLocation: 'Metro Health North',
    npi: '2345678901',
    licenseNumber: 'MD23456',
    licenseState: 'CA',
    address: '456 North Ave, Suite 300, Northside, ST 12345',
    education: [
      { degree: 'MD', institution: 'Johns Hopkins School of Medicine', year: '2008' },
      { degree: 'Fellowship', institution: 'Cleveland Clinic', year: '2015' },
      { degree: 'Residency', institution: 'Mayo Clinic', year: '2012' },
      { degree: 'BS', institution: 'MIT', year: '2004' }
    ],
    certifications: ['American Board of Cardiology', 'Advanced Cardiac Life Support'],
    languages: ['English', 'Mandarin'],
    acceptingNewPatients: true,
    insuranceAccepted: ['Blue Cross', 'Aetna', 'Medicare', 'Cigna'],
    appointmentTypes: ['In-person'],
    officeHours: 'Mon-Thurs: 7:30 AM - 4:30 PM, Fri: 7:30 AM - 12:00 PM',
    patientCount: 287,
    avgRating: 4.7,
    reviewCount: 58,
    lastOrderDate: '2024-01-14',
    orderCount: 97
  },
  {
    id: 'PROV003',
    name: 'Dr. Emily Rodriguez',
    orgId: 'ORG002',
    specialty: 'Family Medicine',
    phone: '(555) 222-4444',
    email: 'erodriguez@communitycare.com',
    status: 'Active',
    title: 'MD',
    primaryLocation: 'Community Care Central',
    npi: '3456789012',
    licenseNumber: 'MD34567',
    licenseState: 'CA',
    address: '789 Central St, Central, ST 12345',
    education: [
      { degree: 'MD', institution: 'UCLA School of Medicine', year: '2012' },
      { degree: 'Residency', institution: 'USC Medical Center', year: '2015' },
      { degree: 'BS', institution: 'UC Berkeley', year: '2008' }
    ],
    certifications: ['American Board of Family Medicine'],
    languages: ['English', 'Spanish', 'Portuguese'],
    acceptingNewPatients: true,
    insuranceAccepted: ['Blue Cross', 'Aetna', 'Medicare', 'Medicaid', 'United Healthcare'],
    appointmentTypes: ['In-person', 'Telehealth', 'Home visits'],
    officeHours: 'Mon-Fri: 9:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM',
    patientCount: 521,
    avgRating: 4.9,
    reviewCount: 104,
    lastOrderDate: '2024-01-15',
    orderCount: 215
  },
  {
    id: 'PROV004',
    name: 'Dr. David Kim',
    orgId: 'ORG002',
    specialty: 'Pediatrics',
    phone: '(555) 222-5555',
    email: 'dkim@communitycare.com',
    status: 'Active',
    title: 'MD',
    primaryLocation: 'Community Care West',
    npi: '4567890123',
    licenseNumber: 'MD45678',
    licenseState: 'CA',
    address: '321 West Blvd, Westside, ST 12345',
    education: [
      { degree: 'MD', institution: 'Harvard Medical School', year: '2011' },
      { degree: 'Residency', institution: "Boston Children's Hospital", year: '2014' },
      { degree: 'BS', institution: 'Yale University', year: '2007' }
    ],
    certifications: ['American Board of Pediatrics', 'Pediatric Advanced Life Support'],
    languages: ['English', 'Korean'],
    acceptingNewPatients: true,
    insuranceAccepted: ['Blue Cross', 'Aetna', 'Medicare', 'Medicaid', 'Kaiser'],
    appointmentTypes: ['In-person', 'Telehealth'],
    officeHours: 'Mon-Fri: 8:30 AM - 5:30 PM',
    patientCount: 412,
    avgRating: 4.6,
    reviewCount: 87,
    lastOrderDate: '2024-01-13',
    orderCount: 178
  },
  {
    id: 'PROV005',
    name: 'Dr. Lisa Thompson',
    orgId: 'ORG003',
    specialty: 'Dermatology',
    phone: '(555) 333-6666',
    email: 'lthompson@regionalmed.com',
    status: 'Active',
    title: 'MD',
    primaryLocation: 'Regional Med Main',
    npi: '5678901234',
    licenseNumber: 'MD56789',
    licenseState: 'CA',
    address: '654 Main St, Midtown, ST 12345',
    education: [
      { degree: 'MD', institution: 'University of Pennsylvania School of Medicine', year: '2009' },
      { degree: 'Residency', institution: 'NYU Langone Medical Center', year: '2013' },
      { degree: 'Fellowship', institution: 'Mayo Clinic', year: '2014' },
      { degree: 'BS', institution: 'Cornell University', year: '2005' }
    ],
    certifications: ['American Board of Dermatology'],
    languages: ['English'],
    acceptingNewPatients: false,
    insuranceAccepted: ['Blue Cross', 'Aetna', 'United Healthcare', 'Cigna'],
    appointmentTypes: ['In-person', 'Telehealth'],
    officeHours: 'Mon, Wed, Fri: 8:00 AM - 5:00 PM',
    patientCount: 278,
    avgRating: 4.9,
    reviewCount: 92,
    lastOrderDate: '2024-01-14',
    orderCount: 103
  }
];

// Mock staff data
export const staff: Staff[] = [
  {
    id: 'STAFF001',
    name: 'Jennifer Adams',
    orgId: 'ORG001',
    role: 'Lab Technician',
    department: 'Laboratory',
    phone: '(555) 111-7777',
    email: 'jadams@metrohealth.com',
    status: 'Active'
  },
  {
    id: 'STAFF002',
    name: 'Robert Wilson',
    orgId: 'ORG001',
    role: 'Nurse Manager',
    department: 'Nursing',
    phone: '(555) 111-8888',
    email: 'rwilson@metrohealth.com',
    status: 'Active'
  },
  {
    id: 'STAFF003',
    name: 'Maria Garcia',
    orgId: 'ORG002',
    role: 'Medical Assistant',
    department: 'Clinical',
    phone: '(555) 222-9999',
    email: 'mgarcia@communitycare.com',
    status: 'Active'
  },
  {
    id: 'STAFF004',
    name: 'James Miller',
    orgId: 'ORG003',
    role: 'Lab Coordinator',
    department: 'Laboratory',
    phone: '(555) 333-0000',
    email: 'jmiller@regionalmed.com',
    status: 'Active'
  }
];

// Mock samples data
export const samples: Sample[] = [
  {
    id: 'S001',
    patientName: 'John Doe',
    patientId: 'P001',
    type: 'Blood',
    test: 'Complete Blood Count',
    collectionDate: '2024-01-15',
    status: 'In Progress',
    priority: 'High',
    organizationId: 'ORG001',
    organizationName: 'Metro Health System',
    providerId: 'PROV001',
    providerName: 'Dr. Sarah Johnson'
  },
  {
    id: 'S002',
    patientName: 'Jane Smith',
    patientId: 'P002',
    type: 'Urine',
    test: 'Urinalysis',
    collectionDate: '2024-01-15',
    status: 'Completed',
    priority: 'Normal',
    organizationId: 'ORG002',
    organizationName: 'Community Care Clinics',
    providerId: 'PROV003',
    providerName: 'Dr. Emily Rodriguez'
  },
  {
    id: 'S003',
    patientName: 'Mike Johnson',
    patientId: 'P003',
    type: 'Blood',
    test: 'Lipid Panel',
    collectionDate: '2024-01-14',
    status: 'Pending',
    priority: 'Urgent',
    organizationId: 'ORG001',
    organizationName: 'Metro Health System',
    providerId: 'PROV002',
    providerName: 'Dr. Michael Chen'
  },
  {
    id: 'S004',
    patientName: 'Sarah Wilson',
    patientId: 'P004',
    type: 'Saliva',
    test: 'COVID-19 PCR',
    collectionDate: '2024-01-14',
    status: 'In Progress',
    priority: 'Normal',
    organizationId: 'ORG003',
    organizationName: 'Regional Medical Group',
    providerId: 'PROV005',
    providerName: 'Dr. Lisa Thompson'
  },
  {
    id: 'S005',
    patientName: 'Robert Brown',
    patientId: 'P005',
    type: 'Blood',
    test: 'Comprehensive Metabolic Panel',
    collectionDate: '2024-01-13',
    status: 'Completed',
    priority: 'High',
    organizationId: 'ORG002',
    organizationName: 'Community Care Clinics',
    providerId: 'PROV004',
    providerName: 'Dr. David Kim'
  }
];

// Mock patient details data
export const patientDetailsData: Record<string, PatientDetails> = {
  P001: {
    id: 'P001',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'Male',
    dateOfBirth: '1979-05-15',
    address: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      county: 'Sangamon'
    },
    contact: {
      homePhone: '(555) 123-4567',
      cellPhone: '(555) 234-5678',
      workPhone: '(555) 345-6789',
      email: 'john.doe@email.com'
    },
    ssn: '***-**-1234',
    maritalStatus: 'Married',
    demographics: {
      race: 'White',
      ethnicity: 'Non-Hispanic'
    },
    insurance: {
      planName: 'Blue Cross Blue Shield',
      priority: 'Primary',
      policyNumber: 'BCBS123456789',
      groupNumber: 'GRP987654',
      relationship: 'Self'
    },
    organization: {
      name: 'Metro Health System',
      location: 'Main Campus',
      provider: 'Dr. Sarah Johnson',
      network: 'Metro Health Network',
      group: 'Primary Care'
    },
    account: {
      lastNumber: 'ACC789012',
      lastOrderDate: '2024-01-15'
    }
  },
  P002: {
    id: 'P002',
    firstName: 'Jane',
    lastName: 'Smith',
    gender: 'Female',
    dateOfBirth: '1992-08-23',
    address: {
      street: '456 Oak Avenue',
      city: 'Riverside',
      state: 'CA',
      zip: '92501',
      county: 'Riverside'
    },
    contact: {
      homePhone: '(555) 987-6543',
      cellPhone: '(555) 876-5432',
      workPhone: '(555) 765-4321',
      email: 'jane.smith@email.com'
    },
    ssn: '***-**-5678',
    maritalStatus: 'Single',
    demographics: {
      race: 'Asian',
      ethnicity: 'Non-Hispanic'
    },
    insurance: {
      planName: 'Aetna Health',
      priority: 'Primary',
      policyNumber: 'AETNA87654321',
      groupNumber: 'GRP123456',
      relationship: 'Self'
    },
    organization: {
      name: 'Community Care Clinics',
      location: 'Downtown Branch',
      provider: 'Dr. Emily Rodriguez',
      network: 'Community Health Network',
      group: 'Family Medicine'
    },
    account: {
      lastNumber: 'ACC456789',
      lastOrderDate: '2024-01-15'
    }
  },
  P003: {
    id: 'P003',
    firstName: 'Mike',
    lastName: 'Johnson',
    gender: 'Male',
    dateOfBirth: '1965-11-30',
    address: {
      street: '789 Pine Street',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      county: 'Cook'
    },
    contact: {
      homePhone: '(555) 222-3333',
      cellPhone: '(555) 444-5555',
      workPhone: '(555) 666-7777',
      email: 'mike.johnson@email.com'
    },
    ssn: '***-**-9012',
    maritalStatus: 'Divorced',
    demographics: {
      race: 'Black/African American',
      ethnicity: 'Non-Hispanic'
    },
    insurance: {
      planName: 'United Healthcare',
      priority: 'Primary',
      policyNumber: 'UHC567890123',
      groupNumber: 'GRP654321',
      relationship: 'Self'
    },
    organization: {
      name: 'Metro Health System',
      location: 'North Branch',
      provider: 'Dr. Michael Chen',
      network: 'Metro Health Network',
      group: 'Internal Medicine'
    },
    account: {
      lastNumber: 'ACC234567',
      lastOrderDate: '2024-01-14'
    }
  },
  P004: {
    id: 'P004',
    firstName: 'Sarah',
    lastName: 'Wilson',
    gender: 'Female',
    dateOfBirth: '1988-04-12',
    address: {
      street: '321 Maple Road',
      city: 'Portland',
      state: 'OR',
      zip: '97201',
      county: 'Multnomah'
    },
    contact: {
      homePhone: '(555) 111-9999',
      cellPhone: '(555) 888-7777',
      workPhone: '(555) 666-5555',
      email: 'sarah.wilson@email.com'
    },
    ssn: '***-**-3456',
    maritalStatus: 'Married',
    demographics: {
      race: 'White',
      ethnicity: 'Hispanic/Latino'
    },
    insurance: {
      planName: 'Cigna Health',
      priority: 'Primary',
      policyNumber: 'CIGNA34567890',
      groupNumber: 'GRP345678',
      relationship: 'Self'
    },
    organization: {
      name: 'Regional Medical Group',
      location: 'East Campus',
      provider: 'Dr. Lisa Thompson',
      network: 'Regional Health Network',
      group: 'Dermatology'
    },
    account: {
      lastNumber: 'ACC345678',
      lastOrderDate: '2024-01-14'
    }
  },
  P005: {
    id: 'P005',
    firstName: 'Robert',
    lastName: 'Brown',
    gender: 'Male',
    dateOfBirth: '1957-02-28',
    address: {
      street: '567 Cedar Lane',
      city: 'Boston',
      state: 'MA',
      zip: '02108',
      county: 'Suffolk'
    },
    contact: {
      homePhone: '(555) 777-8888',
      cellPhone: '(555) 999-0000',
      workPhone: '(555) 222-1111',
      email: 'robert.brown@email.com'
    },
    ssn: '***-**-7890',
    maritalStatus: 'Widowed',
    demographics: {
      race: 'White',
      ethnicity: 'Non-Hispanic'
    },
    insurance: {
      planName: 'Medicare',
      priority: 'Primary',
      policyNumber: 'MCARE7890123',
      groupNumber: 'MEDICARE-A',
      relationship: 'Self'
    },
    organization: {
      name: 'Community Care Clinics',
      location: 'South Branch',
      provider: 'Dr. David Kim',
      network: 'Community Health Network',
      group: 'Geriatrics'
    },
    account: {
      lastNumber: 'ACC567890',
      lastOrderDate: '2024-01-13'
    }
  }
};

// Mock robots data
export const robots: Robot[] = [
  {
    id: 'OT2-001',
    name: 'Opentrons OT-2 Alpha',
    status: 'Ready',
    currentProtocol: null,
    lastCalibration: '2024-01-14',
    pipettes: ['P20 Single', 'P300 Multi'],
    temperature: '22°C'
  },
  {
    id: 'OT2-002',
    name: 'Opentrons OT-2 Beta',
    status: 'Running',
    currentProtocol: 'PCR Setup Protocol',
    progress: 65,
    estimatedTime: '12 min remaining',
    lastCalibration: '2024-01-15',
    pipettes: ['P1000 Single', 'P300 Multi'],
    temperature: '23°C'
  },
  {
    id: 'FLEX-001',
    name: 'Opentrons Flex Gamma',
    status: 'Maintenance',
    currentProtocol: null,
    lastCalibration: '2024-01-10',
    pipettes: ['Flex 1-Channel 1000μL', 'Flex 8-Channel 50μL'],
    temperature: '21°C'
  }
];

// Mock protocols data
export const protocols: Protocol[] = [
  {
    id: 'P001',
    name: 'DNA Extraction Protocol',
    description: 'Automated DNA extraction from blood samples',
    duration: '45 min',
    samples: 24,
    status: 'Active',
    lastRun: '2024-01-15',
    testTypes: ['DNA Extraction', 'Blood Analysis'],
    robotCompatibility: ['OT2-001', 'OT2-002'],
    protocolType: 'extraction',
    plateFormat: '96-well',
    sampleCapacity: 24
  },
  {
    id: 'P002',
    name: 'PCR Setup Protocol',
    description: 'Automated PCR reaction setup with master mix',
    duration: '30 min',
    samples: 96,
    status: 'Running',
    lastRun: '2024-01-15',
    testTypes: ['PCR', 'DNA Amplification'],
    robotCompatibility: ['OT2-002'],
    protocolType: 'pcr',
    plateFormat: '96-well',
    sampleCapacity: 96
  },
  {
    id: 'P003',
    name: 'ELISA Plate Setup',
    description: 'Automated ELISA plate preparation and sample loading',
    duration: '60 min',
    samples: 96,
    status: 'Active',
    lastRun: '2024-01-14',
    testTypes: ['ELISA', 'Immunoassay'],
    robotCompatibility: ['OT2-001', 'OT2-002', 'FLEX-001'],
    protocolType: 'immunoassay',
    plateFormat: '96-well',
    sampleCapacity: 96
  },
  {
    id: 'P004',
    name: 'Serial Dilution Protocol',
    description: 'Automated serial dilutions for standard curves',
    duration: '25 min',
    samples: 48,
    status: 'Draft',
    lastRun: '2024-01-12',
    testTypes: ['Dilution Series', 'Standard Curve'],
    robotCompatibility: ['OT2-001', 'OT2-002'],
    protocolType: 'dilution',
    plateFormat: '48-well',
    sampleCapacity: 48
  }
];

// Mock run history data
export const runHistory: RunHistory[] = [
  {
    id: 'R001',
    protocol: 'DNA Extraction Protocol',
    robot: 'OT2-001',
    startTime: '2024-01-15 09:30',
    duration: '43 min',
    status: 'Completed',
    samples: 24
  },
  {
    id: 'R002',
    protocol: 'PCR Setup Protocol',
    robot: 'OT2-002',
    startTime: '2024-01-15 11:15',
    duration: 'In Progress',
    status: 'Running',
    samples: 96
  },
  {
    id: 'R003',
    protocol: 'ELISA Plate Setup',
    robot: 'OT2-001',
    startTime: '2024-01-14 14:20',
    duration: '58 min',
    status: 'Completed',
    samples: 96
  },
  {
    id: 'R004',
    protocol: 'Serial Dilution Protocol',
    robot: 'FLEX-001',
    startTime: '2024-01-14 10:45',
    duration: '23 min',
    status: 'Completed',
    samples: 48
  }
];

// Mock reports data
export const reports: Report[] = [
  {
    id: 'R001',
    title: 'Daily Lab Summary',
    type: 'Summary',
    date: '2024-01-15',
    status: 'Generated',
    size: '2.3 MB'
  },
  {
    id: 'R002',
    title: 'Patient Test Results - John Doe',
    type: 'Patient',
    date: '2024-01-15',
    status: 'Generated',
    size: '1.1 MB'
  },
  {
    id: 'R003',
    title: 'Quality Control Report',
    type: 'QC',
    date: '2024-01-14',
    status: 'Generated',
    size: '3.2 MB'
  },
  {
    id: 'R004',
    title: 'Monthly Statistics',
    type: 'Statistics',
    date: '2024-01-14',
    status: 'Pending',
    size: '-'
  },
  {
    id: 'R005',
    title: 'Equipment Maintenance Log',
    type: 'Maintenance',
    date: '2024-01-13',
    status: 'Generated',
    size: '1.8 MB'
  }
];

// Mock messages data
export const mockMessages: Message[] = [
  {
    id: '1',
    sampleId: 'S001',
    sampleName: 'John Doe - CBC',
    sender: 'other',
    senderName: 'Dr. Sarah Johnson',
    content: 'Please expedite this sample. The patient is waiting for results.',
    timestamp: new Date('2024-01-15T09:30:00'),
    read: false
  },
  {
    id: '2',
    sampleId: 'S001',
    sampleName: 'John Doe - CBC',
    sender: 'user',
    senderName: 'You',
    content: "I'll prioritize it right away. Should be ready within the hour.",
    timestamp: new Date('2024-01-15T09:35:00'),
    read: true
  },
  {
    id: '3',
    sampleId: 'S002',
    sampleName: 'Jane Smith - Urinalysis',
    sender: 'other',
    senderName: 'Dr. Emily Rodriguez',
    content: 'Are there any abnormal findings in this sample?',
    timestamp: new Date('2024-01-15T10:15:00'),
    read: false
  },
  {
    id: '4',
    sampleId: 'S003',
    sampleName: 'Mike Johnson - Lipid Panel',
    sender: 'other',
    senderName: 'Dr. Michael Chen',
    content: 'This is marked as urgent. When can we expect results?',
    timestamp: new Date('2024-01-14T14:20:00'),
    read: false
  },
  {
    id: '5',
    sampleId: 'S003',
    sampleName: 'Mike Johnson - Lipid Panel',
    sender: 'user',
    senderName: 'You',
    content: "We're working on it now. Should be completed by EOD.",
    timestamp: new Date('2024-01-14T14:25:00'),
    read: true
  }
];

// Mock roles data
export const roles: Role[] = [
  {
    id: 'ROLE001',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    userCount: 5,
    permissions: {
      lrm: {
        view: true,
        create: true,
        edit: true,
        delete: true,
        admin: true
      },
      contracts: {
        view: true,
        create: true,
        edit: true,
        delete: true,
        sign: true
      },
      forms: {
        view: true,
        create: true,
        edit: true,
        delete: true,
        send: true
      },
      organizations: {
        view: true,
        create: true,
        edit: true,
        delete: true,
        manage: true
      }
    }
  },
  {
    id: 'ROLE002',
    name: 'Account Manager',
    description: 'Manage client relationships and interactions',
    userCount: 8,
    permissions: {
      lrm: {
        view: true,
        create: true,
        edit: true,
        delete: false,
        admin: false
      },
      contracts: {
        view: true,
        create: true,
        edit: false,
        delete: false,
        sign: false
      },
      forms: {
        view: true,
        create: true,
        edit: true,
        delete: false,
        send: true
      },
      organizations: {
        view: true,
        create: false,
        edit: true,
        delete: false,
        manage: true
      }
    }
  },
  {
    id: 'ROLE003',
    name: 'Sales Representative',
    description: 'Manage sales pipeline and prospects',
    userCount: 12,
    permissions: {
      lrm: {
        view: true,
        create: true,
        edit: false,
        delete: false,
        admin: false
      },
      contracts: {
        view: true,
        create: true,
        edit: false,
        delete: false,
        sign: false
      },
      forms: {
        view: true,
        create: true,
        edit: false,
        delete: false,
        send: true
      },
      organizations: {
        view: true,
        create: true,
        edit: false,
        delete: false,
        manage: false
      }
    }
  },
  {
    id: 'ROLE004',
    name: 'Contracts Manager',
    description: 'Manage and oversee all contract activities',
    userCount: 3,
    permissions: {
      lrm: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        admin: false
      },
      contracts: {
        view: true,
        create: true,
        edit: true,
        delete: true,
        sign: true
      },
      forms: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        send: false
      },
      organizations: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        manage: false
      }
    }
  },
  {
    id: 'ROLE005',
    name: 'Viewer',
    description: 'Read-only access to system data',
    userCount: 15,
    permissions: {
      lrm: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        admin: false
      },
      contracts: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        sign: false
      },
      forms: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        send: false
      },
      organizations: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        manage: false
      }
    }
  }
];

// Mock audit logs
export const auditLogs: AuditLog[] = [
  {
    id: 'LOG001',
    timestamp: '2024-01-15 09:23:45',
    user: 'admin@labsystem.com',
    action: 'Create',
    resource: 'Contract',
    resourceId: 'CONT005',
    details: 'Created new contract for Wellness Family Practice',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'LOG002',
    timestamp: '2024-01-15 10:12:33',
    user: 'sarah.johnson@labsystem.com',
    action: 'Update',
    resource: 'Organization',
    resourceId: 'ORG001',
    details: 'Updated contact information for Metro Health System',
    ipAddress: '192.168.1.23'
  },
  {
    id: 'LOG003',
    timestamp: '2024-01-14 15:45:12',
    user: 'michael.chen@labsystem.com',
    action: 'Send',
    resource: 'Form',
    resourceId: 'FORM003',
    details: 'Sent Contract Renewal Survey to Community Care Clinics',
    ipAddress: '192.168.1.78'
  },
  {
    id: 'LOG004',
    timestamp: '2024-01-14 11:23:09',
    user: 'david.wilson@labsystem.com',
    action: 'Create',
    resource: 'Interaction',
    resourceId: 'INT007',
    details: 'Logged sales presentation meeting with Eastside Medical Center',
    ipAddress: '192.168.1.92'
  },
  {
    id: 'LOG005',
    timestamp: '2024-01-13 14:56:22',
    user: 'admin@labsystem.com',
    action: 'Permission',
    resource: 'Role',
    resourceId: 'ROLE003',
    details: 'Modified permissions for Sales Representative role',
    ipAddress: '192.168.1.45'
  }
];

// Mock feature requests data
export const featureRequests: FeatureRequest[] = [
  {
    id: 'FR001',
    title: 'Batch Sample Processing',
    description: 'Allow processing multiple samples at once with a single click',
    status: 'Completed',
    priority: 'High',
    votes: 42,
    requestDate: '2023-12-05',
    requester: 'Sarah Johnson',
    department: 'Lab Operations',
    comments: 3
  },
  {
    id: 'FR002',
    title: 'Advanced Search Filters',
    description: 'Add more granular search filters for finding specific samples',
    status: 'In Progress',
    priority: 'Medium',
    votes: 28,
    requestDate: '2024-01-03',
    requester: 'Michael Chen',
    department: 'Data Analysis',
    comments: 5
  },
  {
    id: 'FR003',
    title: 'Email Notifications for Results',
    description: 'Send automatic email notifications when test results are ready',
    status: 'Pending',
    priority: 'High',
    votes: 37,
    requestDate: '2024-01-08',
    requester: 'Emily Rodriguez',
    department: 'Client Relations',
    comments: 2
  },
  {
    id: 'FR004',
    title: 'Dark Mode Interface',
    description: 'Add a dark mode option for the entire application',
    status: 'Rejected',
    priority: 'Low',
    votes: 15,
    requestDate: '2023-11-20',
    requester: 'David Wilson',
    department: 'IT',
    comments: 4
  },
  {
    id: 'FR005',
    title: 'Custom Dashboard Widgets',
    description: 'Allow users to customize their dashboard with drag-and-drop widgets',
    status: 'Pending',
    priority: 'Medium',
    votes: 31,
    requestDate: '2024-01-12',
    requester: 'Jennifer Adams',
    department: 'Management',
    comments: 1
  }
];

// Mock tests data
export const tests: Test[] = [
  {
    id: 'T001',
    name: 'Complete Blood Count',
    category: 'Hematology',
    price: '$45.00',
    turnaroundTime: '2-4 hours',
    status: 'Active'
  },
  {
    id: 'T002',
    name: 'Lipid Panel',
    category: 'Chemistry',
    price: '$65.00',
    turnaroundTime: '4-6 hours',
    status: 'Active'
  },
  {
    id: 'T003',
    name: 'Liver Function Test',
    category: 'Chemistry',
    price: '$55.00',
    turnaroundTime: '4-6 hours',
    status: 'Active'
  },
  {
    id: 'T004',
    name: 'Thyroid Panel',
    category: 'Endocrinology',
    price: '$85.00',
    turnaroundTime: '6-8 hours',
    status: 'Active'
  },
  {
    id: 'T005',
    name: 'Urinalysis',
    category: 'Microbiology',
    price: '$25.00',
    turnaroundTime: '1-2 hours',
    status: 'Active'
  },
  {
    id: 'T006',
    name: 'Blood Culture',
    category: 'Microbiology',
    price: '$75.00',
    turnaroundTime: '24-48 hours',
    status: 'Inactive'
  }
];

// Mock development log data
export const developmentLog: DevelopmentLogEntry[] = [
  {
    id: 'DEV001',
    type: 'Feature',
    title: 'Laboratory Relationship Management (LRM) System',
    description: 'Comprehensive CRM-like system for managing client organizations, interactions, contracts, and sales pipeline',
    status: 'Implemented',
    priority: 'High',
    date: '2025-01-05',
    implementedDate: '2025-01-05',
    assignee: 'Development Team',
    relatedFiles: ['src/pages/LRM.tsx', 'src/services/organizationService.ts'],
    dependencies: ['Organizations table', 'Locations table', 'Contacts table'],
    notes: 'Full CRM functionality with organization management, location tracking, and contact management'
  },
  {
    id: 'DEV002',
    type: 'Structural Change',
    title: 'Role-Based Access Control (RBAC) System',
    description: 'Implement role-based permissions for Sales Executive, Sales Rep, and Account Manager roles with appropriate access controls',
    status: 'Implemented',
    priority: 'High',
    date: '2025-01-05',
    implementedDate: '2025-01-05',
    assignee: 'Security Team',
    relatedFiles: ['src/pages/Settings.tsx', 'src/utils/mockData.ts'],
    dependencies: ['User authentication system'],
    notes: 'Three-tier role system with granular permissions for LRM and laboratory functions'
  },
  {
    id: 'DEV003',
    type: 'Database Migration',
    title: 'Organizations Table Enhancement',
    description: 'Enhanced organizations table with comprehensive fields for medical director, CLIA, address, and contact information',
    status: 'Implemented',
    priority: 'High',
    date: '2025-01-05',
    implementedDate: '2025-01-05',
    assignee: 'Database Team',
    relatedFiles: ['supabase/migrations/*.sql', 'src/types/supabase.ts'],
    dependencies: ['Supabase setup'],
    notes: 'Added org_reps relationship table for sales team assignments'
  },
  {
    id: 'DEV004',
    type: 'Database Migration',
    title: 'Locations Table Implementation',
    description: 'Created locations table with foreign key relationship to organizations, including address and contact details',
    status: 'Implemented',
    priority: 'High',
    date: '2025-01-05',
    implementedDate: '2025-01-05',
    assignee: 'Database Team',
    relatedFiles: ['supabase/migrations/20250607043903_late_marsh.sql', 'src/services/locationService.ts'],
    dependencies: ['Organizations table'],
    notes: 'Supports multiple locations per organization with unique location codes'
  },
  {
    id: 'DEV005',
    type: 'Database Migration',
    title: 'Contacts Table Implementation',
    description: 'Created contacts table for managing provider and staff contacts associated with organizations and locations',
    status: 'Implemented',
    priority: 'High',
    date: '2025-01-05',
    implementedDate: '2025-01-05',
    assignee: 'Database Team',
    relatedFiles: ['supabase/migrations/20250607044620_morning_mode.sql', 'src/services/contactService.ts'],
    dependencies: ['Organizations table', 'Locations table'],
    notes: 'Includes provider NPI tracking and many-to-many location relationships'
  },
  {
    id: 'DEV006',
    type: 'Feature',
    title: 'Order Import System',
    description: 'CSV import functionality for bulk order processing with duplicate detection and validation',
    status: 'Implemented',
    priority: 'Medium',
    date: '2025-01-05',
    implementedDate: '2025-01-05',
    assignee: 'Frontend Team',
    relatedFiles: ['src/components/OrderImporter.tsx', 'src/utils/csvParser.ts'],
    dependencies: ['Orders table', 'Supabase integration'],
    notes: 'Supports CSV upload with automatic deduplication and error handling'
  },
  {
    id: 'DEV007',
    type: 'UI Enhancement',
    title: 'Locations Management Modal',
    description: 'Interactive modal for managing organization locations with inline editing capabilities',
    status: 'Implemented',
    priority: 'Medium',
    date: '2025-01-05',
    implementedDate: '2025-01-05',
    assignee: 'Frontend Team',
    relatedFiles: ['src/components/LocationsModal.tsx'],
    dependencies: ['Locations service', 'LRM page'],
    notes: 'Full CRUD operations with real-time validation and error handling'
  },
  {
    id: 'DEV008',
    type: 'UI Enhancement',
    title: 'Contacts Management Modal',
    description: 'Interactive modal for managing organization contacts with provider NPI tracking',
    status: 'Implemented',
    priority: 'Medium',
    date: '2025-01-05',
    implementedDate: '2025-01-05',
    assignee: 'Frontend Team',
    relatedFiles: ['src/components/ContactsModal.tsx'],
    dependencies: ['Contacts service', 'LRM page'],
    notes: 'Supports provider NPI validation and location code assignment'
  },
  {
    id: 'DEV009',
    type: 'Feature',
    title: 'Organization Statistics Integration',
    description: 'Real-time location and contact counts displayed in organization listings',
    status: 'Implemented',
    priority: 'Low',
    date: '2025-01-05',
    implementedDate: '2025-01-05',
    assignee: 'Backend Team',
    relatedFiles: ['src/services/organizationService.ts'],
    dependencies: ['Locations table', 'Contacts table'],
    notes: 'Optimized queries to prevent N+1 problems with count aggregation'
  },
  {
    id: 'DEV010',
    type: 'Feature',
    title: 'Development Log System',
    description: 'PRD-style tracking system for features, structural changes, and implementation status',
    status: 'Implemented',
    priority: 'Medium',
    date: '2025-01-05',
    implementedDate: '2025-01-05',
    assignee: 'Development Team',
    relatedFiles: ['src/pages/Settings.tsx', 'src/types/index.ts', 'src/utils/mockData.ts'],
    dependencies: ['Settings page'],
    notes: 'Comprehensive tracking of all development activities with status, priority, and dependency management'
  },
  {
    id: 'DEV011',
    type: 'Feature',
    title: 'Advanced Order Filtering System',
    description: 'Multi-criteria filtering for orders with status, organization, provider, test method, and date range filters',
    status: 'Planned',
    priority: 'Medium',
    date: '2025-01-05',
    assignee: 'Frontend Team',
    relatedFiles: ['src/pages/Samples.tsx'],
    dependencies: ['Orders table'],
    notes: 'Enhanced search and filter capabilities for better order management'
  },
  {
    id: 'DEV012',
    type: 'Security Update',
    title: 'Row Level Security (RLS) Implementation',
    description: 'Comprehensive RLS policies for all database tables to ensure data security and access control',
    status: 'Implemented',
    priority: 'High',
    date: '2025-01-05',
    implementedDate: '2025-01-05',
    assignee: 'Security Team',
    relatedFiles: ['supabase/migrations/*.sql'],
    dependencies: ['All database tables'],
    notes: 'Applied to orders, organizations, locations, contacts, and org_reps tables'
  },
  {
    id: 'DEV013',
    type: 'Feature',
    title: 'Messaging System Enhancement',
    description: 'Real-time messaging system for sample-specific communications between lab staff and providers',
    status: 'Implemented',
    priority: 'Medium',
    date: '2025-01-05',
    implementedDate: '2025-01-05',
    assignee: 'Frontend Team',
    relatedFiles: ['src/components/MessagingContext.tsx', 'src/components/MessagingPanel.tsx', 'src/components/MessageThread.tsx'],
    dependencies: ['Sample management system'],
    notes: 'Context-based messaging with unread indicators and threaded conversations'
  },
  {
    id: 'DEV014',
    type: 'Feature',
    title: 'Automation Dashboard',
    description: 'Comprehensive automation management for Opentrons robots, protocols, and run history',
    status: 'Implemented',
    priority: 'Medium',
    date: '2025-01-05',
    implementedDate: '2025-01-05',
    assignee: 'Automation Team',
    relatedFiles: ['src/pages/Automation.tsx'],
    dependencies: ['Robot integration APIs'],
    notes: 'Real-time robot status monitoring and protocol management'
  },
  {
    id: 'DEV015',
    type: 'UI Enhancement',
    title: 'Responsive Design Implementation',
    description: 'Mobile-responsive design across all pages with optimized layouts for different screen sizes',
    status: 'In Progress',
    priority: 'Medium',
    date: '2025-01-05',
    assignee: 'Frontend Team',
    relatedFiles: ['src/pages/*.tsx', 'src/components/*.tsx'],
    dependencies: ['Tailwind CSS'],
    notes: 'Progressive enhancement for mobile and tablet devices'
  }
];

// Simulated user data
export const currentUser = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@labsystem.com',
  role: 'Administrator',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};

// Navigation menu items
export const menuItems = [
  { path: '/', label: 'Dashboard', icon: 'HomeIcon' },
  { path: '/organizations', label: 'Organizations', icon: 'BuildingIcon' },
  { path: '/samples', label: 'Orders', icon: 'TestTubeIcon' },
  { path: '/batch-processing', label: 'Batch Processing', icon: 'LayersIcon' },
  { path: '/automation', label: 'Automation', icon: 'CpuIcon' },
  { path: '/lrm', label: 'LRM', icon: 'HeartHandshakeIcon' },
  { path: '/reports', label: 'Reports', icon: 'FileTextIcon' },
  { path: '/settings', label: 'Settings', icon: 'SettingsIcon' }
];