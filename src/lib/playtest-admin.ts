export interface AdminReservation {
  id: string;
  name: string;
  email: string;
  seats: number;
  status: "confirmed" | "cancelled";
  reservationCode: string;
  marketingOptIn: boolean;
  reminder24hSentAt: string | null;
  reminder2hSentAt: string | null;
  createdAt: string;
}

export interface AdminPlaytestTable {
  id: string;
  label: string;
  capacity: number;
  sortOrder: number;
  isActive: boolean;
  seatsReserved: number;
  seatsRemaining: number;
  reservations: AdminReservation[];
}

export interface AdminPlaytestSession {
  id: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  venueName: string;
  addressLine: string;
  city: string;
  region: string;
  postalCode: string;
  notes: string;
  isActive: boolean;
  tables: AdminPlaytestTable[];
}

export interface AdminPlaytestResponse {
  sessions: AdminPlaytestSession[];
  generatedAt: string;
}

export interface SessionDraft {
  startsAt: string;
  endsAt: string;
  timezone: string;
  venueName: string;
  addressLine: string;
  city: string;
  region: string;
  postalCode: string;
  notes: string;
  isActive: boolean;
}

export interface TableDraft {
  label: string;
  capacity: number;
  sortOrder: number;
  isActive: boolean;
}
