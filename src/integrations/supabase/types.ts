export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alerts_subscriptions: {
        Row: {
          alert_type: Database["public"]["Enums"]["alert_type"]
          city: string | null
          created_at: string
          frequency: Database["public"]["Enums"]["alert_frequency"] | null
          id: string
          is_active: boolean | null
          last_sent_at: string | null
          locality: string | null
          notification_channels: Json | null
          risk_threshold: Database["public"]["Enums"]["risk_threshold"] | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_type: Database["public"]["Enums"]["alert_type"]
          city?: string | null
          created_at?: string
          frequency?: Database["public"]["Enums"]["alert_frequency"] | null
          id?: string
          is_active?: boolean | null
          last_sent_at?: string | null
          locality?: string | null
          notification_channels?: Json | null
          risk_threshold?: Database["public"]["Enums"]["risk_threshold"] | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_type?: Database["public"]["Enums"]["alert_type"]
          city?: string | null
          created_at?: string
          frequency?: Database["public"]["Enums"]["alert_frequency"] | null
          id?: string
          is_active?: boolean | null
          last_sent_at?: string | null
          locality?: string | null
          notification_channels?: Json | null
          risk_threshold?: Database["public"]["Enums"]["risk_threshold"] | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      area_database: {
        Row: {
          area_name: string
          area_sq_km: number | null
          area_type: Database["public"]["Enums"]["area_type"]
          avg_property_rate_per_sqft: number | null
          boundary_geojson: Json | null
          created_at: string
          data_source: string | null
          district_code: string | null
          id: string
          is_active: boolean | null
          last_census_year: number | null
          latitude: number | null
          longitude: number | null
          parent_area_id: string | null
          pincode: string | null
          population: number | null
          project_density: number | null
          risk_index: number | null
          state_code: string | null
          updated_at: string
        }
        Insert: {
          area_name: string
          area_sq_km?: number | null
          area_type: Database["public"]["Enums"]["area_type"]
          avg_property_rate_per_sqft?: number | null
          boundary_geojson?: Json | null
          created_at?: string
          data_source?: string | null
          district_code?: string | null
          id?: string
          is_active?: boolean | null
          last_census_year?: number | null
          latitude?: number | null
          longitude?: number | null
          parent_area_id?: string | null
          pincode?: string | null
          population?: number | null
          project_density?: number | null
          risk_index?: number | null
          state_code?: string | null
          updated_at?: string
        }
        Update: {
          area_name?: string
          area_sq_km?: number | null
          area_type?: Database["public"]["Enums"]["area_type"]
          avg_property_rate_per_sqft?: number | null
          boundary_geojson?: Json | null
          created_at?: string
          data_source?: string | null
          district_code?: string | null
          id?: string
          is_active?: boolean | null
          last_census_year?: number | null
          latitude?: number | null
          longitude?: number | null
          parent_area_id?: string | null
          pincode?: string | null
          population?: number | null
          project_density?: number | null
          risk_index?: number | null
          state_code?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "area_database_parent_area_id_fkey"
            columns: ["parent_area_id"]
            isOneToOne: false
            referencedRelation: "area_database"
            referencedColumns: ["id"]
          },
        ]
      }
      infrastructure_projects: {
        Row: {
          actual_completion_date: string | null
          alignment_geojson: Json | null
          budget_crores: number | null
          buffer_distance_meters: number | null
          cities_affected: string[] | null
          compensation_rate_per_sqm: number | null
          contact_officer_email: string | null
          contact_officer_name: string | null
          contact_officer_phone: string | null
          created_at: string
          data_source: string | null
          districts_covered: string[] | null
          dpr_url: string | null
          expected_completion_date: string | null
          expected_start_date: string | null
          id: string
          implementing_agency: string | null
          is_active: boolean | null
          land_required_hectares: number | null
          last_updated_from_source: string | null
          localities_affected: string[] | null
          notification_date: string | null
          official_gazette_url: string | null
          project_code: string | null
          project_name: string
          project_phase: Database["public"]["Enums"]["project_phase"] | null
          project_type: Database["public"]["Enums"]["project_type"]
          state: string
          tender_document_url: string | null
          total_area_hectares: number | null
          total_length_km: number | null
          updated_at: string
        }
        Insert: {
          actual_completion_date?: string | null
          alignment_geojson?: Json | null
          budget_crores?: number | null
          buffer_distance_meters?: number | null
          cities_affected?: string[] | null
          compensation_rate_per_sqm?: number | null
          contact_officer_email?: string | null
          contact_officer_name?: string | null
          contact_officer_phone?: string | null
          created_at?: string
          data_source?: string | null
          districts_covered?: string[] | null
          dpr_url?: string | null
          expected_completion_date?: string | null
          expected_start_date?: string | null
          id?: string
          implementing_agency?: string | null
          is_active?: boolean | null
          land_required_hectares?: number | null
          last_updated_from_source?: string | null
          localities_affected?: string[] | null
          notification_date?: string | null
          official_gazette_url?: string | null
          project_code?: string | null
          project_name: string
          project_phase?: Database["public"]["Enums"]["project_phase"] | null
          project_type: Database["public"]["Enums"]["project_type"]
          state: string
          tender_document_url?: string | null
          total_area_hectares?: number | null
          total_length_km?: number | null
          updated_at?: string
        }
        Update: {
          actual_completion_date?: string | null
          alignment_geojson?: Json | null
          budget_crores?: number | null
          buffer_distance_meters?: number | null
          cities_affected?: string[] | null
          compensation_rate_per_sqm?: number | null
          contact_officer_email?: string | null
          contact_officer_name?: string | null
          contact_officer_phone?: string | null
          created_at?: string
          data_source?: string | null
          districts_covered?: string[] | null
          dpr_url?: string | null
          expected_completion_date?: string | null
          expected_start_date?: string | null
          id?: string
          implementing_agency?: string | null
          is_active?: boolean | null
          land_required_hectares?: number | null
          last_updated_from_source?: string | null
          localities_affected?: string[] | null
          notification_date?: string | null
          official_gazette_url?: string | null
          project_code?: string | null
          project_name?: string
          project_phase?: Database["public"]["Enums"]["project_phase"] | null
          project_type?: Database["public"]["Enums"]["project_type"]
          state?: string
          tender_document_url?: string | null
          total_area_hectares?: number | null
          total_length_km?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: Json | null
          created_at: string
          full_name: string | null
          id: string
          last_active: string | null
          metadata: Json | null
          phone: string | null
          subscription_end_date: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"] | null
        }
        Insert: {
          address?: Json | null
          created_at?: string
          full_name?: string | null
          id: string
          last_active?: string | null
          metadata?: Json | null
          phone?: string | null
          subscription_end_date?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Update: {
          address?: Json | null
          created_at?: string
          full_name?: string | null
          id?: string
          last_active?: string | null
          metadata?: Json | null
          phone?: string | null
          subscription_end_date?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Relationships: []
      }
      project_updates: {
        Row: {
          created_at: string
          description: string | null
          effective_date: string | null
          id: string
          is_public: boolean | null
          official_document_url: string | null
          project_id: string
          published_date: string | null
          title: string
          update_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          effective_date?: string | null
          id?: string
          is_public?: boolean | null
          official_document_url?: string | null
          project_id: string
          published_date?: string | null
          title: string
          update_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          effective_date?: string | null
          id?: string
          is_public?: boolean | null
          official_document_url?: string | null
          project_id?: string
          published_date?: string | null
          title?: string
          update_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "infrastructure_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      property_assessments: {
        Row: {
          assessment_date: string
          city: string | null
          compensation_estimate: Json | null
          construction_status:
            | Database["public"]["Enums"]["construction_status"]
            | null
          created_at: string
          district: string | null
          id: string
          is_saved: boolean | null
          latitude: number | null
          locality: string | null
          longitude: number | null
          nearby_projects: Json | null
          ownership_type: Database["public"]["Enums"]["ownership_type"] | null
          property_size: number | null
          property_type: Database["public"]["Enums"]["property_type"]
          recommendations: Json | null
          risk_breakdown: Json | null
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          risk_score: number | null
          size_unit: Database["public"]["Enums"]["size_unit"] | null
          state: string
          sub_locality: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_date?: string
          city?: string | null
          compensation_estimate?: Json | null
          construction_status?:
            | Database["public"]["Enums"]["construction_status"]
            | null
          created_at?: string
          district?: string | null
          id?: string
          is_saved?: boolean | null
          latitude?: number | null
          locality?: string | null
          longitude?: number | null
          nearby_projects?: Json | null
          ownership_type?: Database["public"]["Enums"]["ownership_type"] | null
          property_size?: number | null
          property_type: Database["public"]["Enums"]["property_type"]
          recommendations?: Json | null
          risk_breakdown?: Json | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          risk_score?: number | null
          size_unit?: Database["public"]["Enums"]["size_unit"] | null
          state: string
          sub_locality?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_date?: string
          city?: string | null
          compensation_estimate?: Json | null
          construction_status?:
            | Database["public"]["Enums"]["construction_status"]
            | null
          created_at?: string
          district?: string | null
          id?: string
          is_saved?: boolean | null
          latitude?: number | null
          locality?: string | null
          longitude?: number | null
          nearby_projects?: Json | null
          ownership_type?: Database["public"]["Enums"]["ownership_type"] | null
          property_size?: number | null
          property_type?: Database["public"]["Enums"]["property_type"]
          recommendations?: Json | null
          risk_breakdown?: Json | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          risk_score?: number | null
          size_unit?: Database["public"]["Enums"]["size_unit"] | null
          state?: string
          sub_locality?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      alert_frequency: "real_time" | "daily_digest" | "weekly_summary"
      alert_type:
        | "new_project"
        | "project_update"
        | "risk_change"
        | "deadline"
        | "public_hearing"
      app_role: "admin" | "moderator" | "user"
      area_type:
        | "state"
        | "district"
        | "city"
        | "zone"
        | "locality"
        | "sub_locality"
        | "village"
        | "town"
      construction_status:
        | "under_construction"
        | "completed"
        | "dilapidated"
        | "partially_built"
      notification_channel: "email" | "sms" | "push" | "whatsapp"
      ownership_type:
        | "freehold"
        | "leasehold"
        | "power_of_attorney"
        | "agreement_to_sell"
      project_phase:
        | "proposed"
        | "feasibility_study"
        | "dpr_preparation"
        | "approved"
        | "land_notification"
        | "tender_floated"
        | "construction_started"
        | "ongoing"
        | "completed"
      project_type:
        | "highway"
        | "metro"
        | "railway"
        | "airport"
        | "industrial"
        | "smart_city"
        | "port"
        | "power_plant"
      property_type:
        | "agricultural_land"
        | "vacant_plot"
        | "independent_house"
        | "apartment"
        | "commercial"
        | "industrial"
      risk_level: "very_low" | "low" | "medium" | "high" | "critical"
      risk_threshold: "critical_only" | "high_above" | "medium_above" | "all"
      size_unit: "sq_ft" | "sq_m" | "acre" | "hectare"
      subscription_tier: "free" | "basic" | "premium" | "enterprise"
      user_type:
        | "buyer"
        | "owner"
        | "investor"
        | "legal_professional"
        | "government_official"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_frequency: ["real_time", "daily_digest", "weekly_summary"],
      alert_type: [
        "new_project",
        "project_update",
        "risk_change",
        "deadline",
        "public_hearing",
      ],
      app_role: ["admin", "moderator", "user"],
      area_type: [
        "state",
        "district",
        "city",
        "zone",
        "locality",
        "sub_locality",
        "village",
        "town",
      ],
      construction_status: [
        "under_construction",
        "completed",
        "dilapidated",
        "partially_built",
      ],
      notification_channel: ["email", "sms", "push", "whatsapp"],
      ownership_type: [
        "freehold",
        "leasehold",
        "power_of_attorney",
        "agreement_to_sell",
      ],
      project_phase: [
        "proposed",
        "feasibility_study",
        "dpr_preparation",
        "approved",
        "land_notification",
        "tender_floated",
        "construction_started",
        "ongoing",
        "completed",
      ],
      project_type: [
        "highway",
        "metro",
        "railway",
        "airport",
        "industrial",
        "smart_city",
        "port",
        "power_plant",
      ],
      property_type: [
        "agricultural_land",
        "vacant_plot",
        "independent_house",
        "apartment",
        "commercial",
        "industrial",
      ],
      risk_level: ["very_low", "low", "medium", "high", "critical"],
      risk_threshold: ["critical_only", "high_above", "medium_above", "all"],
      size_unit: ["sq_ft", "sq_m", "acre", "hectare"],
      subscription_tier: ["free", "basic", "premium", "enterprise"],
      user_type: [
        "buyer",
        "owner",
        "investor",
        "legal_professional",
        "government_official",
      ],
    },
  },
} as const
