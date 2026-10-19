import type {
  AdminPlaytestResponse,
  AdminPlaytestSession,
  AdminPlaytestTable,
  AdminReservation,
  SessionDraft,
  TableDraft,
} from "@/lib/playtest-admin";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function listAdminPlaytests(): Promise<AdminPlaytestResponse> {
  const [sessionResult, tableResult, reservationResult, availabilityResult] = await Promise.all([
    supabaseAdmin.from("playtest_sessions").select("*").order("starts_at", { ascending: true }),
    supabaseAdmin
      .from("playtest_tables")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("label", { ascending: true }),
    supabaseAdmin
      .from("playtest_reservations")
      .select("*")
      .order("created_at", { ascending: true }),
    supabaseAdmin.from("playtest_table_availability").select("id,seats_reserved,seats_remaining"),
  ]);

  if (sessionResult.error) throw databaseError("loading dates", sessionResult.error);
  if (tableResult.error) throw databaseError("loading tables", tableResult.error);
  if (reservationResult.error) throw databaseError("loading reservations", reservationResult.error);
  if (availabilityResult.error)
    throw databaseError("loading seat availability", availabilityResult.error);

  const availability = new Map(
    (availabilityResult.data ?? []).map((row) => [
      row.id,
      {
        seatsReserved: row.seats_reserved ?? 0,
        seatsRemaining: row.seats_remaining ?? 0,
      },
    ]),
  );
  const reservationsByTable = new Map<string, AdminReservation[]>();
  for (const row of reservationResult.data ?? []) {
    const reservations = reservationsByTable.get(row.table_id) ?? [];
    reservations.push({
      id: row.id,
      name: row.name,
      email: row.email,
      seats: row.seats,
      status: row.status === "cancelled" ? "cancelled" : "confirmed",
      reservationCode: row.reservation_code,
      marketingOptIn: row.marketing_opt_in,
      reminder24hSentAt: row.reminder_24h_sent_at,
      reminder2hSentAt: row.reminder_2h_sent_at,
      createdAt: row.created_at,
    });
    reservationsByTable.set(row.table_id, reservations);
  }

  const tablesBySession = new Map<string, AdminPlaytestTable[]>();
  for (const row of tableResult.data ?? []) {
    const seats = availability.get(row.id) ?? { seatsReserved: 0, seatsRemaining: row.capacity };
    const tables = tablesBySession.get(row.session_id) ?? [];
    tables.push({
      id: row.id,
      label: row.label,
      capacity: row.capacity,
      sortOrder: row.sort_order,
      isActive: row.is_active,
      seatsReserved: seats.seatsReserved,
      seatsRemaining: seats.seatsRemaining,
      reservations: reservationsByTable.get(row.id) ?? [],
    });
    tablesBySession.set(row.session_id, tables);
  }

  const sessions: AdminPlaytestSession[] = (sessionResult.data ?? []).map((row) => ({
    id: row.id,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    timezone: row.timezone,
    venueName: row.venue_name,
    addressLine: row.address_line,
    city: row.city,
    region: row.region,
    notes: row.notes ?? "",
    isActive: row.is_active,
    tables: tablesBySession.get(row.id) ?? [],
  }));

  return { sessions, generatedAt: new Date().toISOString() };
}

export async function createAdminPlaytestSession(input: SessionDraft) {
  validateSchedule(input.startsAt, input.endsAt);
  const { data, error } = await supabaseAdmin
    .from("playtest_sessions")
    .insert({
      starts_at: input.startsAt,
      ends_at: input.endsAt,
      timezone: input.timezone,
      venue_name: input.venueName.trim(),
      address_line: input.addressLine.trim(),
      city: input.city.trim(),
      region: input.region.trim().toUpperCase(),
      notes: input.notes.trim() || null,
      is_active: input.isActive,
    })
    .select("id")
    .single();
  if (error) throw databaseError("creating a date", error);
  return data.id;
}

export async function updateAdminPlaytestSession(id: string, input: SessionDraft) {
  validateSchedule(input.startsAt, input.endsAt);
  const { error } = await supabaseAdmin
    .from("playtest_sessions")
    .update({
      starts_at: input.startsAt,
      ends_at: input.endsAt,
      timezone: input.timezone,
      venue_name: input.venueName.trim(),
      address_line: input.addressLine.trim(),
      city: input.city.trim(),
      region: input.region.trim().toUpperCase(),
      notes: input.notes.trim() || null,
      is_active: input.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .single();
  if (error) throw databaseError("updating a date", error);
}

export async function createAdminPlaytestTable(sessionId: string, input: TableDraft) {
  const { error } = await supabaseAdmin.from("playtest_tables").insert({
    session_id: sessionId,
    label: input.label.trim(),
    capacity: input.capacity,
    sort_order: input.sortOrder,
    is_active: input.isActive,
  });
  if (error) throw databaseError("creating a table", error);
}

export async function updateAdminPlaytestTable(id: string, input: TableDraft) {
  const { data: current, error: currentError } = await supabaseAdmin
    .from("playtest_table_availability")
    .select("seats_reserved")
    .eq("id", id)
    .single();
  if (currentError) throw databaseError("checking the table", currentError);
  if ((current.seats_reserved ?? 0) > input.capacity) {
    throw new PlaytestAdminInputError(
      `Capacity cannot be lower than the ${current.seats_reserved ?? 0} reserved seats.`,
    );
  }

  const { error } = await supabaseAdmin
    .from("playtest_tables")
    .update({
      label: input.label.trim(),
      capacity: input.capacity,
      sort_order: input.sortOrder,
      is_active: input.isActive,
    })
    .eq("id", id)
    .select("id")
    .single();
  if (error) throw databaseError("updating a table", error);
}

export async function cancelAdminReservation(id: string) {
  const { error } = await supabaseAdmin
    .from("playtest_reservations")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "confirmed")
    .select("id")
    .single();
  if (error) throw databaseError("cancelling a reservation", error);
}

export class PlaytestAdminInputError extends Error {}

function validateSchedule(startsAt: string, endsAt: string) {
  if (new Date(endsAt).getTime() <= new Date(startsAt).getTime()) {
    throw new PlaytestAdminInputError("The end time must be after the start time.");
  }
}

function databaseError(action: string, error: { message: string; code?: string | null }) {
  return new Error(
    `Playtest admin database error while ${action}: ${error.message}${error.code ? ` (${error.code})` : ""}`,
  );
}
