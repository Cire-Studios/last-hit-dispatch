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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      playtest_reservations: {
        Row: {
          created_at: string
          email: string
          id: string
          marketing_opt_in: boolean
          name: string
          reminder_24h_sent_at: string | null
          reminder_2h_sent_at: string | null
          reservation_code: string
          seats: number
          session_id: string
          source: string
          status: string
          table_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          marketing_opt_in?: boolean
          name: string
          reminder_24h_sent_at?: string | null
          reminder_2h_sent_at?: string | null
          reservation_code: string
          seats?: number
          session_id: string
          source?: string
          status?: string
          table_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          marketing_opt_in?: boolean
          name?: string
          reminder_24h_sent_at?: string | null
          reminder_2h_sent_at?: string | null
          reservation_code?: string
          seats?: number
          session_id?: string
          source?: string
          status?: string
          table_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "playtest_reservations_session_id_playtest_sessions_id_fk"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "playtest_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playtest_reservations_table_id_playtest_tables_id_fk"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "playtest_table_availability"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playtest_reservations_table_id_playtest_tables_id_fk"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "playtest_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      playtest_sessions: {
        Row: {
          address_line: string
          city: string
          created_at: string
          ends_at: string
          id: string
          is_active: boolean
          notes: string | null
          postal_code: string
          region: string
          starts_at: string
          timezone: string
          updated_at: string
          venue_name: string
        }
        Insert: {
          address_line: string
          city: string
          created_at?: string
          ends_at: string
          id?: string
          is_active?: boolean
          notes?: string | null
          postal_code?: string
          region?: string
          starts_at: string
          timezone?: string
          updated_at?: string
          venue_name: string
        }
        Update: {
          address_line?: string
          city?: string
          created_at?: string
          ends_at?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          postal_code?: string
          region?: string
          starts_at?: string
          timezone?: string
          updated_at?: string
          venue_name?: string
        }
        Relationships: []
      }
      playtest_tables: {
        Row: {
          capacity: number
          created_at: string
          id: string
          is_active: boolean
          label: string
          session_id: string
          sort_order: number
        }
        Insert: {
          capacity?: number
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          session_id: string
          sort_order?: number
        }
        Update: {
          capacity?: number
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          session_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "playtest_tables_session_id_playtest_sessions_id_fk"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "playtest_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      playtest_reminder_queue: {
        Row: {
          address_line: string | null
          city: string | null
          email: string | null
          ends_at: string | null
          name: string | null
          postal_code: string | null
          region: string | null
          reminder_24h_sent_at: string | null
          reminder_2h_sent_at: string | null
          reservation_code: string | null
          reservation_id: string | null
          seats: number | null
          starts_at: string | null
          table_label: string | null
          timezone: string | null
          venue_name: string | null
        }
        Relationships: []
      }
      playtest_table_availability: {
        Row: {
          capacity: number | null
          id: string | null
          is_active: boolean | null
          label: string | null
          seats_remaining: number | null
          seats_reserved: number | null
          session_id: string | null
          sort_order: number | null
        }
        Relationships: [
          {
            foreignKeyName: "playtest_tables_session_id_playtest_sessions_id_fk"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "playtest_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      reserve_playtest_seats: {
        Args: {
          p_email: string
          p_marketing_opt_in?: boolean
          p_name: string
          p_seats: number
          p_source?: string
          p_table_id: string
        }
        Returns: {
          address_line: string
          city: string
          ends_at: string
          postal_code: string
          region: string
          reservation_code: string
          reservation_id: string
          starts_at: string
          table_label: string
          timezone: string
          venue_name: string
        }[]
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
