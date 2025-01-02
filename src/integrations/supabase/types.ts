export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dental_records: {
        Row: {
          condition: string
          created_at: string
          id: string
          notes: string | null
          patient_id: string
          sections: Json | null
          tooth_number: number
          treatment_date: string | null
        }
        Insert: {
          condition: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          sections?: Json | null
          tooth_number: number
          treatment_date?: string | null
        }
        Update: {
          condition?: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          sections?: Json | null
          tooth_number?: number
          treatment_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dental_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          age: number | null
          age_group: string | null
          birth_date: string | null
          blood_pressure: string | null
          consultation_reason: string | null
          cpo_ceo_indices: Json | null
          created_at: string
          current_illness: string | null
          email: string | null
          first_name: string
          heart_rate: number | null
          id: string
          last_name: string
          medical_history: string | null
          medical_record_number: string | null
          oral_health_indicators: Json | null
          personal_family_history: string | null
          phone: string | null
          respiratory_rate: number | null
          sex: string | null
          stomatological_exam: Json | null
          systemic_examination: Json | null
          temperature: number | null
        }
        Insert: {
          address?: string | null
          age?: number | null
          age_group?: string | null
          birth_date?: string | null
          blood_pressure?: string | null
          consultation_reason?: string | null
          cpo_ceo_indices?: Json | null
          created_at?: string
          current_illness?: string | null
          email?: string | null
          first_name: string
          heart_rate?: number | null
          id?: string
          last_name: string
          medical_history?: string | null
          medical_record_number?: string | null
          oral_health_indicators?: Json | null
          personal_family_history?: string | null
          phone?: string | null
          respiratory_rate?: number | null
          sex?: string | null
          stomatological_exam?: Json | null
          systemic_examination?: Json | null
          temperature?: number | null
        }
        Update: {
          address?: string | null
          age?: number | null
          age_group?: string | null
          birth_date?: string | null
          blood_pressure?: string | null
          consultation_reason?: string | null
          cpo_ceo_indices?: Json | null
          created_at?: string
          current_illness?: string | null
          email?: string | null
          first_name?: string
          heart_rate?: number | null
          id?: string
          last_name?: string
          medical_history?: string | null
          medical_record_number?: string | null
          oral_health_indicators?: Json | null
          personal_family_history?: string | null
          phone?: string | null
          respiratory_rate?: number | null
          sex?: string | null
          stomatological_exam?: Json | null
          systemic_examination?: Json | null
          temperature?: number | null
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
