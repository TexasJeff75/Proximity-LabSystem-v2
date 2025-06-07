export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          accession_id: string
          status: string
          organization: string
          location: string
          provider: string
          patient_name: string
          request_date: string
          collection_date: string
          received_date: string | null
          finalized_date: string | null
          test_method: string
          order_panels: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          accession_id: string
          status: string
          organization: string
          location: string
          provider: string
          patient_name: string
          request_date: string
          collection_date: string
          received_date?: string | null
          finalized_date?: string | null
          test_method: string
          order_panels: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          accession_id?: string
          status?: string
          organization?: string
          location?: string
          provider?: string
          patient_name?: string
          request_date?: string
          collection_date?: string
          received_date?: string | null
          finalized_date?: string | null
          test_method?: string
          order_panels?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      organizations: {
        Row: {
          id: string
          org_code: string
          name: string
          medical_director: string | null
          clia: string | null
          street: string | null
          city: string | null
          state: string | null
          zip: string | null
          phone: string | null
          fax: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          org_code: string
          name: string
          medical_director?: string | null
          clia?: string | null
          street?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          phone?: string | null
          fax?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          org_code?: string
          name?: string
          medical_director?: string | null
          clia?: string | null
          street?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          phone?: string | null
          fax?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      org_reps: {
        Row: {
          id: string
          organization_id: string
          sales_rep: string | null
          account_manager: string | null
          sales_executive: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          sales_rep?: string | null
          account_manager?: string | null
          sales_executive?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          sales_rep?: string | null
          account_manager?: string | null
          sales_executive?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      locations: {
        Row: {
          id: string
          organization_id: string
          location_code: string
          location_name: string
          street: string | null
          city: string | null
          state: string | null
          zip: string | null
          phone: string | null
          fax: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          location_code: string
          location_name: string
          street?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          phone?: string | null
          fax?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          location_code?: string
          location_name?: string
          street?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          phone?: string | null
          fax?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      contacts: {
        Row: {
          id: string
          first_name: string
          last_name: string
          provider_npi: string | null
          organization_code: string
          organization_name: string
          location_code: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          provider_npi?: string | null
          organization_code: string
          organization_name: string
          location_code: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          provider_npi?: string | null
          organization_code?: string
          organization_name?: string
          location_code?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      contact_locations: {
        Row: {
          id: string
          contact_id: string
          organization_code: string
          organization_name: string
          location_code: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          contact_id: string
          organization_code: string
          organization_name: string
          location_code: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          contact_id?: string
          organization_code?: string
          organization_name?: string
          location_code?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      test_methods: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          category: string
          max_batch_size: number | null
          processing_time: string | null
          status: string | null
          required_equipment: string[] | null
          protocols: string[] | null
          regulatory_requirements: string[] | null
          quality_controls: string[] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          description?: string | null
          category: string
          max_batch_size?: number | null
          processing_time?: string | null
          status?: string | null
          required_equipment?: string[] | null
          protocols?: string[] | null
          regulatory_requirements?: string[] | null
          quality_controls?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          description?: string | null
          category?: string
          max_batch_size?: number | null
          processing_time?: string | null
          status?: string | null
          required_equipment?: string[] | null
          protocols?: string[] | null
          regulatory_requirements?: string[] | null
          quality_controls?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      test_panels: {
        Row: {
          id: string
          test_method_id: string
          name: string
          description: string | null
          panel_code: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          test_method_id: string
          name: string
          description?: string | null
          panel_code: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          test_method_id?: string
          name?: string
          description?: string | null
          panel_code?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      protocols: {
        Row: {
          id: string
          name: string
          description: string | null
          duration: string | null
          robot_compatibility: string[] | null
          protocol_type: string | null
          plate_format: string | null
          sample_capacity: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          duration?: string | null
          robot_compatibility?: string[] | null
          protocol_type?: string | null
          plate_format?: string | null
          sample_capacity?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          duration?: string | null
          robot_compatibility?: string[] | null
          protocol_type?: string | null
          plate_format?: string | null
          sample_capacity?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      test_method_protocols: {
        Row: {
          test_method_id: string
          protocol_id: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          test_method_id: string
          protocol_id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          test_method_id?: string
          protocol_id?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}