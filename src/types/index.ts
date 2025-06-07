// Common types used throughout the application

// Organization related types
export interface Organization {
  id: string;
  org_code: string;
  name: string;
  medical_director?: string | null;
  clia?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  phone?: string | null;
  fax?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  // Legacy fields for backward compatibility
  type?: string;
  status?: string;
  email?: string;
  address?: string;
  locationCount?: number;
  providerCount?: number;
  patientCount?: number;
  staffCount?: number;
  joinDate?: string;
  website?: string;
  salesRep?: string;
  salesRepEmail?: string;
  salesRepPhone?: string;
  accountManager?: string;
  contractStatus?: string;
  contractRenewal?: string;
  lastInteraction?: string;
  billingContact?: string;
  billingEmail?: string;
  billingPhone?: string;
}

export interface Location {
  id: string;
  name: string;
  orgId: string;
  address: string;
  city: string;
  type: string;
  status: string;
}

export interface Provider {
  id: string;
  name: string;
  orgId: string;
  specialty: string;
  phone: string;
  email: string;
  status: string;
  title?: string;
  primaryLocation?: string;
  npi?: string;
  licenseNumber?: string;
  licenseState?: string;
  address?: string;
  education?: EducationItem[];
  certifications?: string[];
  languages?: string[];
  acceptingNewPatients?: boolean;
  insuranceAccepted?: string[];
  appointmentTypes?: string[];
  officeHours?: string;
  patientCount?: number;
  avgRating?: number;
  reviewCount?: number;
  lastOrderDate?: string;
  orderCount?: number;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

export interface Staff {
  id: string;
  name: string;
  orgId: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  status: string;
}

// Sample/Order related types
export interface Sample {
  id: string;
  patientName: string;
  patientId: string;
  type: string;
  test: string;
  collectionDate: string;
  status: string;
  priority: string;
  organizationId: string;
  organizationName: string;
  providerId: string;
  providerName: string;
  receivedDate?: string;
  finalizedDate?: string;
  requestDate?: string;
  testMethod?: string;
  orderPanels?: string;
  location?: string;
}

export interface PatientDetails {
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

// Automation related types
export interface Robot {
  id: string;
  name: string;
  status: string;
  currentProtocol: string | null;
  lastCalibration: string;
  pipettes: string[];
  temperature: string;
  progress?: number;
  estimatedTime?: string;
}

export interface Protocol {
  id: string;
  name: string;
  description: string;
  duration: string;
  samples: number;
  status: string;
  lastRun: string;
  testTypes?: string[];
  robotCompatibility?: string[];
  protocolType?: string;
  plateFormat?: string;
  sampleCapacity?: number;
}

export interface RunHistory {
  id: string;
  protocol: string;
  robot: string;
  startTime: string;
  duration: string;
  status: string;
  samples: number;
}

// Report related types
export interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  status: string;
  size: string;
}

// Messaging related types
export interface Message {
  id: string;
  sampleId: string;
  sampleName?: string;
  sender: 'user' | 'other';
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface MessagingContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: Message[];
  unreadCount: number;
  activeSampleId: string | null;
  setActiveSampleId: (id: string | null) => void;
  sendMessage: (content: string) => void;
  markAsRead: (sampleId: string) => void;
}

// Settings related types
export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: Record<string, Record<string, boolean>>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
}

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  votes: number;
  requestDate: string;
  requester: string;
  department: string;
  comments: number;
}

export interface Test {
  id: string;
  name: string;
  category: string;
  price: string;
  turnaroundTime: string;
  status: string;
}

// Raw data types for Supabase integration
export interface RawOrderData {
  accession_id: string;
  status: string;
  organization: string;
  location: string;
  provider: string;
  patient_name: string;
  request_date: string;
  collection_date: string;
  received_date: string | null;
  finalized_date: string | null;
  test_method: string;
  order_panels: string;
}

// Utility types
export type StatusType = 'Ready' | 'Running' | 'Maintenance' | 'Error' | 'Active' | 'Draft' | 'Completed' | 'Pending' | 'In Progress' | 'Rejected' | 'Cancelled' | 'Final' | 'Prelim' | 'Prelim (Review)' | 'Final (Review)';

export type PriorityType = 'High' | 'Normal' | 'Urgent' | 'Low';