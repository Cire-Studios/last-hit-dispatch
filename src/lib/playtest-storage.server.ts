import type { SupabaseClient } from "@supabase/supabase-js";

import type { PlaytestSession, PlaytestTable } from "@/lib/playtest";
import type { PlaytestDatabase } from "@/lib/playtest-database.types";

interface SessionRow {
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
}

interface TableAvailabilityRow {
  id: string;
  session_id: string;
  label: string;
  capacity: number;
  seats_reserved: number;
  seats_remaining: number;
}

export interface ReservationResult {
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
}

export interface ReminderRow {
  reservation_id: string;
  name: string;
  email: string;
  seats: number;
  reservation_code: string;
  table_label: string;
  starts_at: string;
  ends_at: string;
  timezone: string;
  venue_name: string;
  address_line: string;
  city: string;
  region: string;
  postal_code: string;
  reminder_24h_sent_at: string | null;
  reminder_2h_sent_at: string | null;
}

export function playtestDatabaseIsConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
}

export async function listPlaytestSessions(): Promise<PlaytestSession[]> {
  const database = await getPlaytestDatabase();
  const now = new Date().toISOString();
  const { data: sessions, error: sessionError } = await database
    .from("playtest_sessions")
    .select("id,starts_at,ends_at,timezone,venue_name,address_line,city,region,postal_code,notes")
    .eq("is_active", true)
    .gte("starts_at", now)
    .order("starts_at", { ascending: true });

  if (sessionError) throw databaseError("loading playtest sessions", sessionError);
  if (!sessions?.length) return [];

  const { data: tables, error: tableError } = await database
    .from("playtest_table_availability")
    .select("id,session_id,label,capacity,seats_reserved,seats_remaining")
    .in(
      "session_id",
      sessions.map(({ id }) => id),
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });

  if (tableError) throw databaseError("loading playtest tables", tableError);

  return (sessions as SessionRow[]).map((session) => ({
    id: session.id,
    startsAt: session.starts_at,
    endsAt: session.ends_at,
    timezone: session.timezone,
    venueName: session.venue_name,
    addressLine: session.address_line,
    city: session.city,
    region: session.region,
    postalCode: session.postal_code ?? "",
    notes: session.notes ?? "",
    tables: (tables as TableAvailabilityRow[])
      .filter((table) => table.session_id === session.id)
      .map(mapTable),
  }));
}

export async function createPlaytestReservation(input: {
  tableId: string;
  name: string;
  email: string;
  seats: number;
  marketingOptIn: boolean;
  source: string;
}) {
  const database = await getPlaytestDatabase();
  const { data, error } = await database.rpc("reserve_playtest_seats", {
    p_table_id: input.tableId,
    p_name: input.name,
    p_email: input.email,
    p_seats: input.seats,
    p_marketing_opt_in: input.marketingOptIn,
    p_source: input.source,
  });

  if (error) throw databaseError("creating a playtest reservation", error);
  const result = data?.[0] as ReservationResult | undefined;
  if (!result) throw new Error("Reservation function returned no result");
  return result;
}

export async function listPendingReminders() {
  const database = await getPlaytestDatabase();
  const now = new Date();
  const upperBound = new Date(now.getTime() + 25 * 60 * 60 * 1000);
  const { data, error } = await database
    .from("playtest_reminder_queue")
    .select("*")
    .gt("starts_at", now.toISOString())
    .lte("starts_at", upperBound.toISOString())
    .order("starts_at", { ascending: true });

  if (error) throw databaseError("loading reminder queue", error);
  return (data ?? []) as ReminderRow[];
}

export async function markReminderSent(reservationId: string, kind: "24h" | "2h") {
  const database = await getPlaytestDatabase();
  const sentAt = new Date().toISOString();
  const update =
    kind === "24h" ? { reminder_24h_sent_at: sentAt } : { reminder_2h_sent_at: sentAt };
  const { error } = await database
    .from("playtest_reservations")
    .update(update)
    .eq("id", reservationId);

  if (error) throw databaseError("marking a reminder sent", error);
}

async function getPlaytestDatabase(): Promise<SupabaseClient<PlaytestDatabase>> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as unknown as SupabaseClient<PlaytestDatabase>;
}

function databaseError(action: string, error: { message: string; code?: string | null }) {
  return new Error(
    `Playtest database error while ${action}: ${error.message}${error.code ? ` (${error.code})` : ""}`,
  );
}

function mapTable(row: TableAvailabilityRow): PlaytestTable {
  return {
    id: row.id,
    label: row.label,
    capacity: row.capacity,
    seatsReserved: row.seats_reserved,
    seatsRemaining: row.seats_remaining,
    status: row.seats_remaining === 0 ? "full" : row.seats_remaining <= 2 ? "limited" : "available",
  };
}
