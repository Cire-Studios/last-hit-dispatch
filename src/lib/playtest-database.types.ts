type PlaytestSessionRow = {
  id: string;
  starts_at: string;
  ends_at: string;
  timezone: string;
  venue_name: string;
  address_line: string;
  city: string;
  region: string;
  postal_code: string;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type PlaytestTableRow = {
  id: string;
  session_id: string;
  label: string;
  capacity: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

type PlaytestReservationRow = {
  id: string;
  session_id: string;
  table_id: string;
  name: string;
  email: string;
  seats: number;
  status: string;
  reservation_code: string;
  marketing_opt_in: boolean;
  source: string;
  reminder_24h_sent_at: string | null;
  reminder_2h_sent_at: string | null;
  created_at: string;
  updated_at: string;
};

type TableDefinition<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type ReservationResultRow = {
  reservation_id: string;
  reservation_code: string;
  starts_at: string;
  ends_at: string;
  timezone: string;
  venue_name: string;
  address_line: string;
  city: string;
  region: string;
  postal_code: string;
  table_label: string;
};

export type PlaytestDatabase = {
  __InternalSupabase: { PostgrestVersion: "14.18" };
  public: {
    Tables: {
      playtest_sessions: TableDefinition<
        PlaytestSessionRow,
        Omit<PlaytestSessionRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        },
        Partial<PlaytestSessionRow>
      >;
      playtest_tables: TableDefinition<
        PlaytestTableRow,
        Omit<PlaytestTableRow, "id" | "created_at"> & { id?: string; created_at?: string },
        Partial<PlaytestTableRow>
      >;
      playtest_reservations: TableDefinition<
        PlaytestReservationRow,
        Omit<PlaytestReservationRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        },
        Partial<PlaytestReservationRow>
      >;
    };
    Views: {
      playtest_table_availability: {
        Row: PlaytestTableRow & { seats_reserved: number; seats_remaining: number };
        Relationships: [];
      };
      playtest_reminder_queue: {
        Row: Pick<
          PlaytestReservationRow,
          | "name"
          | "email"
          | "seats"
          | "reservation_code"
          | "reminder_24h_sent_at"
          | "reminder_2h_sent_at"
        > & {
          reservation_id: string;
          table_label: string;
          starts_at: string;
          ends_at: string;
          timezone: string;
          venue_name: string;
          address_line: string;
          city: string;
          region: string;
          postal_code: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      reserve_playtest_seats: {
        Args: {
          p_table_id: string;
          p_name: string;
          p_email: string;
          p_seats: number;
          p_marketing_opt_in?: boolean;
          p_source?: string;
        };
        Returns: ReservationResultRow[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
