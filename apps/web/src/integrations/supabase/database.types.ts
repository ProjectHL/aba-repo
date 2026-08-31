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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      acquisition_goals: {
        Row: {
          client_id: string
          created_at: string
          id: string
          mastery_criterion: string
          name: string
          position: number
          program_id: string
          skill_area: string
          status: string
          teaching_procedure: string
          test_run_id: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          mastery_criterion: string
          name: string
          position?: number
          program_id: string
          skill_area: string
          status?: string
          teaching_procedure: string
          test_run_id?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          mastery_criterion?: string
          name?: string
          position?: number
          program_id?: string
          skill_area?: string
          status?: string
          teaching_procedure?: string
          test_run_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "acquisition_goals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "acquisition_goals_program_client_fkey"
            columns: ["program_id", "client_id"]
            isOneToOne: false
            referencedRelation: "acquisition_programs"
            referencedColumns: ["id", "client_id"]
          },
        ]
      }
      acquisition_programs: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          test_run_id: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          test_run_id?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          test_run_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "acquisition_programs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          client_id: string
          created_at: string
          id: string
          kind: string
          occurred_on: string | null
          payload: Json
          status: string
          test_run_id: string | null
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          kind: string
          occurred_on?: string | null
          payload?: Json
          status?: string
          test_run_id?: string | null
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          kind?: string
          occurred_on?: string | null
          payload?: Json
          status?: string
          test_run_id?: string | null
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "assessments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          entity_id: string
          entity_type: string
          id: number
          organization_id: string
          test_run_id: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: number
          organization_id: string
          test_run_id?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: number
          organization_id?: string
          test_run_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      behavior_plans: {
        Row: {
          antecedent_strategy: string | null
          client_id: string
          created_at: string
          hypothesized_function: string | null
          id: string
          measurement_unit: string
          name: string
          operational_definition: string
          replacement_behavior: string | null
          response_strategy: string | null
          status: string
          test_run_id: string | null
          updated_at: string
        }
        Insert: {
          antecedent_strategy?: string | null
          client_id: string
          created_at?: string
          hypothesized_function?: string | null
          id?: string
          measurement_unit: string
          name: string
          operational_definition: string
          replacement_behavior?: string | null
          response_strategy?: string | null
          status?: string
          test_run_id?: string | null
          updated_at?: string
        }
        Update: {
          antecedent_strategy?: string | null
          client_id?: string
          created_at?: string
          hypothesized_function?: string | null
          id?: string
          measurement_unit?: string
          name?: string
          operational_definition?: string
          replacement_behavior?: string | null
          response_strategy?: string | null
          status?: string
          test_run_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "behavior_plans_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          birth_date: string
          clinical_id: string
          created_at: string
          id: string
          initials: string
          living_arrangement: string | null
          organization_id: string
          primary_language: string
          status: string
          test_run_id: string | null
          updated_at: string
        }
        Insert: {
          birth_date: string
          clinical_id: string
          created_at?: string
          id?: string
          initials: string
          living_arrangement?: string | null
          organization_id: string
          primary_language: string
          status?: string
          test_run_id?: string | null
          updated_at?: string
        }
        Update: {
          birth_date?: string
          clinical_id?: string
          created_at?: string
          id?: string
          initials?: string
          living_arrangement?: string | null
          organization_id?: string
          primary_language?: string
          status?: string
          test_run_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_audit_events: {
        Row: {
          action: string
          actor_user_id: string | null
          client_id: string
          created_at: string
          entity_id: string
          entity_type: string
          id: number
          organization_id: string
          test_run_id: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          client_id: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: number
          organization_id: string
          test_run_id?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          client_id?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: number
          organization_id?: string
          test_run_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinical_audit_events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_audit_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_sessions: {
        Row: {
          client_id: string
          created_at: string
          id: string
          notes: string | null
          occurred_on: string
          status: string
          test_run_id: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          notes?: string | null
          occurred_on?: string
          status?: string
          test_run_id?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          occurred_on?: string
          status?: string
          test_run_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      guardians: {
        Row: {
          birth_date: string | null
          client_id: string
          created_at: string
          id: string
          initials: string
          position: number
          test_run_id: string | null
        }
        Insert: {
          birth_date?: string | null
          client_id: string
          created_at?: string
          id?: string
          initials: string
          position: number
          test_run_id?: string | null
        }
        Update: {
          birth_date?: string | null
          client_id?: string
          created_at?: string
          id?: string
          initials?: string
          position?: number
          test_run_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guardians_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string
          organization_id: string
          role: string
          status: string
          test_run_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          organization_id: string
          role: string
          status?: string
          test_run_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          organization_id?: string
          role?: string
          status?: string
          test_run_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          status: string
          test_run_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          status?: string
          test_run_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: string
          test_run_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      session_acquisition_trials: {
        Row: {
          client_id: string
          correct: number
          created_at: string
          goal_id: string
          incorrect: number
          session_id: string
          test_run_id: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          correct?: number
          created_at?: string
          goal_id: string
          incorrect?: number
          session_id: string
          test_run_id?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          correct?: number
          created_at?: string
          goal_id?: string
          incorrect?: number
          session_id?: string
          test_run_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_acquisition_trials_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_acquisition_trials_goal_client_fkey"
            columns: ["goal_id", "client_id"]
            isOneToOne: false
            referencedRelation: "acquisition_goals"
            referencedColumns: ["id", "client_id"]
          },
          {
            foreignKeyName: "session_acquisition_trials_session_client_fkey"
            columns: ["session_id", "client_id"]
            isOneToOne: false
            referencedRelation: "clinical_sessions"
            referencedColumns: ["id", "client_id"]
          },
        ]
      }
      session_behavior_measurements: {
        Row: {
          behavior_plan_id: string
          client_id: string
          created_at: string
          interval_observed: number | null
          interval_total: number | null
          measurement_unit: string | null
          session_id: string
          test_run_id: string | null
          updated_at: string
          value: number
        }
        Insert: {
          behavior_plan_id: string
          client_id: string
          created_at?: string
          interval_observed?: number | null
          interval_total?: number | null
          measurement_unit?: string | null
          session_id: string
          test_run_id?: string | null
          updated_at?: string
          value: number
        }
        Update: {
          behavior_plan_id?: string
          client_id?: string
          created_at?: string
          interval_observed?: number | null
          interval_total?: number | null
          measurement_unit?: string | null
          session_id?: string
          test_run_id?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_behavior_measurements_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_behavior_measurements_plan_client_fkey"
            columns: ["behavior_plan_id", "client_id"]
            isOneToOne: false
            referencedRelation: "behavior_plans"
            referencedColumns: ["id", "client_id"]
          },
          {
            foreignKeyName: "session_behavior_measurements_session_client_fkey"
            columns: ["session_id", "client_id"]
            isOneToOne: false
            referencedRelation: "clinical_sessions"
            referencedColumns: ["id", "client_id"]
          },
        ]
      }
      siblings: {
        Row: {
          birth_date: string | null
          client_id: string
          created_at: string
          id: string
          initials: string
          position: number
          test_run_id: string | null
        }
        Insert: {
          birth_date?: string | null
          client_id: string
          created_at?: string
          id?: string
          initials: string
          position: number
          test_run_id?: string | null
        }
        Update: {
          birth_date?: string | null
          client_id?: string
          created_at?: string
          id?: string
          initials?: string
          position?: number
          test_run_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "siblings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_client: {
        Args: {
          p_birth_date: string
          p_clinical_id: string
          p_guardians?: Json
          p_initials: string
          p_living_arrangement?: string
          p_primary_language: string
          p_siblings?: Json
          p_test_run_id?: string
        }
        Returns: {
          birth_date: string
          clinical_id: string
          created_at: string
          id: string
          initials: string
          living_arrangement: string | null
          organization_id: string
          primary_language: string
          status: string
          test_run_id: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "clients"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_clinical_session: {
        Args: {
          p_acquisition_trials: Json
          p_behavior_measurements: Json
          p_client_id: string
          p_notes: string | null
          p_occurred_on: string
          p_test_run_id: string | null
        }
        Returns: {
          client_id: string
          created_at: string
          id: string
          notes: string | null
          occurred_on: string
          status: string
          test_run_id: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "clinical_sessions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
