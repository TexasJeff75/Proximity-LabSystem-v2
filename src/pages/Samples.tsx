import React, { useState, Children, Component } from 'react';
import { SearchIcon, PlusIcon, TestTubeIcon, BuildingIcon, StethoscopeIcon, XIcon, UserIcon, PhoneIcon, MailIcon, MapPinIcon, CreditCardIcon, ActivityIcon, ClipboardIcon, UsersIcon, HeartHandshakeIcon, CalendarIcon, GraduationCapIcon, ClockIcon, BookIcon } from 'lucide-react';
const samples = [{
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
}, {
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
}, {
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
}, {
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
}, {
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
}];
// Mock organization details data
const organizationDetailsData = {
  ORG001: {
    id: 'ORG001',
    name: 'Metro Health System',
    type: 'Hospital Network',
    status: 'Active',
    address: '123 Medical Center Dr, City, ST 12345',
    phone: '(555) 123-4567',
    email: 'admin@metrohealth.com',
    website: 'www.metrohealthsystem.org',
    salesRep: 'Jennifer Adams',
    salesRepEmail: 'jennifer.adams@labsystem.com',
    salesRepPhone: '(555) 987-6543',
    accountManager: 'Sarah Johnson',
    contractStatus: 'Active',
    contractRenewal: '2024-12-31',
    locationCount: 5,
    providerCount: 23,
    patientCount: 1247,
    staffCount: 45,
    joinDate: '2023-01-15',
    lastInteraction: '2024-01-10',
    billingContact: 'Robert Wilson',
    billingEmail: 'billing@metrohealth.com',
    billingPhone: '(555) 123-4568'
  },
  ORG002: {
    id: 'ORG002',
    name: 'Community Care Clinics',
    type: 'Clinic Chain',
    status: 'Active',
    address: '456 Health Ave, City, ST 12345',
    phone: '(555) 234-5678',
    email: 'info@communitycare.com',
    website: 'www.communitycareclinics.org',
    salesRep: 'Michael Chen',
    salesRepEmail: 'michael.chen@labsystem.com',
    salesRepPhone: '(555) 876-5432',
    accountManager: 'David Wilson',
    contractStatus: 'Renewal Pending',
    contractRenewal: '2024-02-28',
    locationCount: 12,
    providerCount: 67,
    patientCount: 3421,
    staffCount: 89,
    joinDate: '2023-03-22',
    lastInteraction: '2024-01-12',
    billingContact: 'Maria Garcia',
    billingEmail: 'billing@communitycare.com',
    billingPhone: '(555) 234-5679'
  },
  ORG003: {
    id: 'ORG003',
    name: 'Regional Medical Group',
    type: 'Medical Practice',
    status: 'Active',
    address: '789 Wellness Blvd, City, ST 12345',
    phone: '(555) 345-6789',
    email: 'contact@regionalmed.com',
    website: 'www.regionalmedicalgroup.org',
    salesRep: 'Lisa Thompson',
    salesRepEmail: 'lisa.thompson@labsystem.com',
    salesRepPhone: '(555) 765-4321',
    accountManager: 'Jennifer Adams',
    contractStatus: 'Active',
    contractRenewal: '2024-06-30',
    locationCount: 3,
    providerCount: 15,
    patientCount: 892,
    staffCount: 28,
    joinDate: '2023-06-10',
    lastInteraction: '2024-01-05',
    billingContact: 'James Miller',
    billingEmail: 'billing@regionalmed.com',
    billingPhone: '(555) 345-6780'
  }
};
// Mock provider details data
const providerDetailsData = {
  PROV001: {
    id: 'PROV001',
    name: 'Dr. Sarah Johnson',
    title: 'MD',
    specialty: 'Internal Medicine',
    organizationId: 'ORG001',
    organizationName: 'Metro Health System',
    primaryLocation: 'Metro Health Downtown',
    status: 'Active',
    npi: '1234567890',
    licenseNumber: 'MD12345',
    licenseState: 'CA',
    phone: '(555) 111-2222',
    email: 'sjohnson@metrohealth.com',
    address: '123 Medical Center Dr, Suite 200, City, ST 12345',
    education: [{
      degree: 'MD',
      institution: 'Stanford University School of Medicine',
      year: '2010'
    }, {
      degree: 'Residency',
      institution: 'UCSF Medical Center',
      year: '2014'
    }, {
      degree: 'BS',
      institution: 'UCLA',
      year: '2006'
    }],
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
  PROV002: {
    id: 'PROV002',
    name: 'Dr. Michael Chen',
    title: 'MD',
    specialty: 'Cardiology',
    organizationId: 'ORG001',
    organizationName: 'Metro Health System',
    primaryLocation: 'Metro Health North',
    status: 'Active',
    npi: '2345678901',
    licenseNumber: 'MD23456',
    licenseState: 'CA',
    phone: '(555) 111-3333',
    email: 'mchen@metrohealth.com',
    address: '456 North Ave, Suite 300, Northside, ST 12345',
    education: [{
      degree: 'MD',
      institution: 'Johns Hopkins School of Medicine',
      year: '2008'
    }, {
      degree: 'Fellowship',
      institution: 'Cleveland Clinic',
      year: '2015'
    }, {
      degree: 'Residency',
      institution: 'Mayo Clinic',
      year: '2012'
    }, {
      degree: 'BS',
      institution: 'MIT',
      year: '2004'
    }],
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
  PROV003: {
    id: 'PROV003',
    name: 'Dr. Emily Rodriguez',
    title: 'MD',
    specialty: 'Family Medicine',
    organizationId: 'ORG002',
    organizationName: 'Community Care Clinics',
    primaryLocation: 'Community Care Central',
    status: 'Active',
    npi: '3456789012',
    licenseNumber: 'MD34567',
    licenseState: 'CA',
    phone: '(555) 222-4444',
    email: 'erodriguez@communitycare.com',
    address: '789 Central St, Central, ST 12345',
    education: [{
      degree: 'MD',
      institution: 'UCLA School of Medicine',
      year: '2012'
    }, {
      degree: 'Residency',
      institution: 'USC Medical Center',
      year: '2015'
    }, {
      degree: 'BS',
      institution: 'UC Berkeley',
      year: '2008'
    }],
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
  PROV004: {
    id: 'PROV004',
    name: 'Dr. David Kim',
    title: 'MD',
    specialty: 'Pediatrics',
    organizationId: 'ORG002',
    organizationName: 'Community Care Clinics',
    primaryLocation: 'Community Care West',
    status: 'Active',
    npi: '4567890123',
    licenseNumber: 'MD45678',
    licenseState: 'CA',
    phone: '(555) 222-5555',
    email: 'dkim@communitycare.com',
    address: '321 West Blvd, Westside, ST 12345',
    education: [{
      degree: 'MD',
      institution: 'Harvard Medical School',
      year: '2011'
    }, {
      degree: 'Residency',
      institution: "Boston Children's Hospital",
      year: '2014'
    }, {
      degree: 'BS',
      institution: 'Yale University',
      year: '2007'
    }],
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
  PROV005: {
    id: 'PROV005',
    name: 'Dr. Lisa Thompson',
    title: 'MD',
    specialty: 'Dermatology',
    organizationId: 'ORG003',
    organizationName: 'Regional Medical Group',
    primaryLocation: 'Regional Med Main',
    status: 'Active',
    npi: '5678901234',
    licenseNumber: 'MD56789',
    licenseState: 'CA',
    phone: '(555) 333-6666',
    email: 'lthompson@regionalmed.com',
    address: '654 Main St, Midtown, ST 12345',
    education: [{
      degree: 'MD',
      institution: 'University of Pennsylvania School of Medicine',
      year: '2009'
    }, {
      degree: 'Residency',
      institution: 'NYU Langone Medical Center',
      year: '2013'
    }, {
      degree: 'Fellowship',
      institution: 'Mayo Clinic',
      year: '2014'
    }, {
      degree: 'BS',
      institution: 'Cornell University',
      year: '2005'
    }],
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
};
interface PatientDetails {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    county: string;
  };
  contact: {
    homePhone: string;
    cellPhone: string;
    workPhone: string;
    email: string;
  };
  ssn: string;
  maritalStatus: string;
  demographics: {
    race: string;
    ethnicity: string;
  };
  insurance: {
    planName: string;
    priority: string;
    policyNumber: string;
    groupNumber: string;
    relationship: string;
  };
  organization: {
    name: string;
    location: string;
    provider: string;
    network: string;
    group: string;
  };
  account: {
    lastNumber: string;
    lastOrderDate: string;
  };
}
// Mock patient details data
const patientDetailsData: Record<string, PatientDetails> = {
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
export function Samples() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orgFilter, setOrgFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const filteredSamples = samples.filter(sample => {
    const matchesSearch = sample.id.toLowerCase().includes(searchTerm.toLowerCase()) || sample.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || sample.status === statusFilter;
    const matchesOrg = orgFilter === 'All' || sample.organizationId === orgFilter;
    return matchesSearch && matchesStatus && matchesOrg;
  });
  const organizations = Array.from(new Set(samples.map(s => ({
    id: s.organizationId,
    name: s.organizationName
  }))));
  const PatientDetailsPanel = ({
    patientId
  }: {
    patientId: string;
  }) => {
    const patient = patientDetailsData[patientId];
    if (!patient) return null;
    const sections = [{
      title: 'Personal Information',
      icon: UserIcon,
      content: [{
        label: 'Patient ID',
        value: patient.id
      }, {
        label: 'Name',
        value: `${patient.firstName} ${patient.lastName}`
      }, {
        label: 'Gender',
        value: patient.gender
      }, {
        label: 'Date of Birth',
        value: patient.dateOfBirth
      }, {
        label: 'SSN',
        value: patient.ssn
      }, {
        label: 'Marital Status',
        value: patient.maritalStatus
      }]
    }, {
      title: 'Demographics',
      icon: ActivityIcon,
      content: [{
        label: 'Race',
        value: patient.demographics.race
      }, {
        label: 'Ethnicity',
        value: patient.demographics.ethnicity
      }]
    }, {
      title: 'Contact Information',
      icon: PhoneIcon,
      content: [{
        label: 'Home Phone',
        value: patient.contact.homePhone
      }, {
        label: 'Cell Phone',
        value: patient.contact.cellPhone
      }, {
        label: 'Work Phone',
        value: patient.contact.workPhone
      }, {
        label: 'Email',
        value: patient.contact.email
      }]
    }, {
      title: 'Address',
      icon: MapPinIcon,
      content: [{
        label: 'Street',
        value: patient.address.street
      }, {
        label: 'City',
        value: patient.address.city
      }, {
        label: 'State',
        value: patient.address.state
      }, {
        label: 'ZIP',
        value: patient.address.zip
      }, {
        label: 'County',
        value: patient.address.county
      }]
    }, {
      title: 'Insurance',
      icon: CreditCardIcon,
      content: [{
        label: 'Plan Name',
        value: patient.insurance.planName
      }, {
        label: 'Priority',
        value: patient.insurance.priority
      }, {
        label: 'Policy #',
        value: patient.insurance.policyNumber
      }, {
        label: 'Group #',
        value: patient.insurance.groupNumber
      }, {
        label: 'Relationship',
        value: patient.insurance.relationship
      }]
    }, {
      title: 'Organization Details',
      icon: BuildingIcon,
      content: [{
        label: 'Organization',
        value: patient.organization.name
      }, {
        label: 'Location',
        value: patient.organization.location
      }, {
        label: 'Provider',
        value: patient.organization.provider
      }, {
        label: 'Network',
        value: patient.organization.network
      }, {
        label: 'Group',
        value: patient.organization.group
      }]
    }, {
      title: 'Account Information',
      icon: ClipboardIcon,
      content: [{
        label: 'Last Acc#',
        value: patient.account.lastNumber
      }, {
        label: 'Last Order Date',
        value: patient.account.lastOrderDate
      }]
    }];
    return <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto z-50">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Patient Details
            </h2>
            <button onClick={() => setSelectedPatient(null)} className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-8">
          {sections.map(section => {
          const Icon = section.icon;
          return <div key={section.title} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {section.content.map(item => <div key={item.label} className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-gray-500">
                        {item.label}:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.value}
                      </span>
                    </div>)}
                </div>
              </div>;
        })}
        </div>
      </div>;
  };
  // Organization Details Panel Component
  const OrganizationDetailsPanel = ({
    orgId
  }: {
    orgId: string;
  }) => {
    const org = organizationDetailsData[orgId];
    if (!org) return null;
    const sections = [{
      title: 'Organization Information',
      icon: BuildingIcon,
      content: [{
        label: 'Organization ID',
        value: org.id
      }, {
        label: 'Name',
        value: org.name
      }, {
        label: 'Type',
        value: org.type
      }, {
        label: 'Status',
        value: org.status
      }, {
        label: 'Join Date',
        value: org.joinDate
      }]
    }, {
      title: 'Contact Information',
      icon: PhoneIcon,
      content: [{
        label: 'Phone',
        value: org.phone
      }, {
        label: 'Email',
        value: org.email
      }, {
        label: 'Website',
        value: org.website
      }, {
        label: 'Address',
        value: org.address
      }]
    }, {
      title: 'Account Management',
      icon: HeartHandshakeIcon,
      content: [{
        label: 'Sales Rep',
        value: org.salesRep
      }, {
        label: 'Sales Rep Email',
        value: org.salesRepEmail
      }, {
        label: 'Sales Rep Phone',
        value: org.salesRepPhone
      }, {
        label: 'Account Manager',
        value: org.accountManager
      }]
    }, {
      title: 'Contract Information',
      icon: ClipboardIcon,
      content: [{
        label: 'Contract Status',
        value: org.contractStatus
      }, {
        label: 'Renewal Date',
        value: org.contractRenewal
      }, {
        label: 'Last Interaction',
        value: org.lastInteraction
      }]
    }, {
      title: 'Billing Information',
      icon: CreditCardIcon,
      content: [{
        label: 'Billing Contact',
        value: org.billingContact
      }, {
        label: 'Billing Email',
        value: org.billingEmail
      }, {
        label: 'Billing Phone',
        value: org.billingPhone
      }]
    }, {
      title: 'Demographics',
      icon: UsersIcon,
      content: [{
        label: 'Locations',
        value: org.locationCount.toString()
      }, {
        label: 'Providers',
        value: org.providerCount.toString()
      }, {
        label: 'Patients',
        value: org.patientCount.toString()
      }, {
        label: 'Staff',
        value: org.staffCount.toString()
      }]
    }];
    return <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto z-50">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Organization Details
              </h2>
              <span className={`mt-1 inline-block px-2 py-1 text-xs rounded-full ${org.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {org.status}
              </span>
            </div>
            <button onClick={() => setSelectedOrg(null)} className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-8">
          {sections.map(section => {
          const Icon = section.icon;
          return <div key={section.title} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {section.content.map(item => <div key={item.label} className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-gray-500">
                        {item.label}:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.value}
                      </span>
                    </div>)}
                </div>
              </div>;
        })}
          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <PhoneIcon className="h-4 w-4" />
                <span>Contact</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                <CalendarIcon className="h-4 w-4" />
                <span>Schedule</span>
              </button>
            </div>
          </div>
        </div>
      </div>;
  };
  // Provider Details Panel Component
  const ProviderDetailsPanel = ({
    providerId
  }: {
    providerId: string;
  }) => {
    const provider = providerDetailsData[providerId];
    if (!provider) return null;
    const sections = [{
      title: 'Provider Information',
      icon: StethoscopeIcon,
      content: [{
        label: 'Provider ID',
        value: provider.id
      }, {
        label: 'Name',
        value: provider.name
      }, {
        label: 'Title',
        value: provider.title
      }, {
        label: 'Specialty',
        value: provider.specialty
      }, {
        label: 'Status',
        value: provider.status
      }, {
        label: 'NPI Number',
        value: provider.npi
      }, {
        label: 'License',
        value: `${provider.licenseNumber} (${provider.licenseState})`
      }]
    }, {
      title: 'Contact Information',
      icon: PhoneIcon,
      content: [{
        label: 'Phone',
        value: provider.phone
      }, {
        label: 'Email',
        value: provider.email
      }, {
        label: 'Address',
        value: provider.address
      }]
    }, {
      title: 'Organization',
      icon: BuildingIcon,
      content: [{
        label: 'Organization',
        value: provider.organizationName
      }, {
        label: 'Primary Location',
        value: provider.primaryLocation
      }]
    }, {
      title: 'Education & Qualifications',
      icon: GraduationCapIcon,
      content: provider.education.map((edu, index) => ({
        label: edu.degree,
        value: `${edu.institution} (${edu.year})`
      }))
    }, {
      title: 'Practice Information',
      icon: ClockIcon,
      content: [{
        label: 'Accepting New Patients',
        value: provider.acceptingNewPatients ? 'Yes' : 'No'
      }, {
        label: 'Office Hours',
        value: provider.officeHours
      }, {
        label: 'Languages',
        value: provider.languages.join(', ')
      }, {
        label: 'Appointment Types',
        value: provider.appointmentTypes.join(', ')
      }]
    }, {
      title: 'Certifications',
      icon: BookIcon,
      content: provider.certifications.map((cert, index) => ({
        label: `Certification ${index + 1}`,
        value: cert
      }))
    }, {
      title: 'Patient Statistics',
      icon: ActivityIcon,
      content: [{
        label: 'Patient Count',
        value: provider.patientCount.toString()
      }, {
        label: 'Rating',
        value: `${provider.avgRating}/5 (${provider.reviewCount} reviews)`
      }, {
        label: 'Last Order Date',
        value: provider.lastOrderDate
      }, {
        label: 'Order Count',
        value: provider.orderCount.toString()
      }]
    }];
    return <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto z-50">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Provider Details
              </h2>
              <div className="flex items-center mt-1">
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${provider.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {provider.status}
                </span>
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                  {provider.specialty}
                </span>
              </div>
            </div>
            <button onClick={() => setSelectedProvider(null)} className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-8">
          {sections.map(section => {
          const Icon = section.icon;
          return <div key={section.title} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {section.content.map((item, index) => <div key={`${item.label}-${index}`} className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-gray-500">
                        {item.label}:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.value}
                      </span>
                    </div>)}
                </div>
              </div>;
        })}
          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <PhoneIcon className="h-4 w-4" />
                <span>Contact</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                <CalendarIcon className="h-4 w-4" />
                <span>Schedule</span>
              </button>
            </div>
          </div>
        </div>
      </div>;
  };
  return <div className="p-6 w-full relative">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order Management
            </h1>
            <p className="text-gray-600">
              Track and manage laboratory orders across organizations
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4" />
            <span>Add Order</span>
          </button>
        </div>
        <div className="flex space-x-4 mb-4">
          <div className="relative flex-1">
            <SearchIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Search orders by ID or patient name..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={orgFilter} onChange={e => setOrgFilter(e.target.value)}>
            <option value="All">All Organizations</option>
            {organizations.map(org => <option key={org.id} value={org.id}>
                {org.name}
              </option>)}
          </select>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Collection Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSamples.map(sample => <tr key={sample.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <TestTubeIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {sample.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      <button onClick={() => setSelectedPatient(sample.patientId)} className="hover:text-blue-600 cursor-pointer">
                        {sample.patientName}
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      {sample.patientId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BuildingIcon className="h-4 w-4 text-blue-600 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          <button onClick={() => setSelectedOrg(sample.organizationId)} className="hover:text-blue-600 cursor-pointer">
                            {sample.organizationName}
                          </button>
                        </div>
                        <div className="text-sm text-gray-500">
                          {sample.organizationId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <StethoscopeIcon className="h-4 w-4 text-green-600 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          <button onClick={() => setSelectedProvider(sample.providerId)} className="hover:text-blue-600 cursor-pointer">
                            {sample.providerName}
                          </button>
                        </div>
                        <div className="text-sm text-gray-500">
                          {sample.providerId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sample.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                      {sample.test}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sample.collectionDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${sample.priority === 'Urgent' ? 'bg-red-100 text-red-800' : sample.priority === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                      {sample.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${sample.status === 'Completed' ? 'bg-green-100 text-green-800' : sample.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {sample.status}
                    </span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {selectedPatient && <PatientDetailsPanel patientId={selectedPatient} />}
      {selectedOrg && <OrganizationDetailsPanel orgId={selectedOrg} />}
      {selectedProvider && <ProviderDetailsPanel providerId={selectedProvider} />}
    </div>;
}