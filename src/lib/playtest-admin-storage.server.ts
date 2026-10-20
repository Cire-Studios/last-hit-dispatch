import { randomUUID } from "node:crypto";

import type {
  AdminPlaytestResponse,
  AdminPlaytestSession,
  AdminPlaytestTable,
  AdminReservation,
  SessionDraft,
  TableDraft,
} from "@/lib/playtest-admin";
import { localAdminBypassIsEnabled } from "@/lib/playtest-admin-auth.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function listAdminPlaytests(): Promise<AdminPlaytestResponse> {
  if (usingLocalPlaytestData()) return localPlaytestData();

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
    postalCode: row.postal_code ?? "",
    notes: row.notes ?? "",
    isActive: row.is_active,
    tables: tablesBySession.get(row.id) ?? [],
  }));

  return { sessions, generatedAt: new Date().toISOString() };
}

export async function createAdminPlaytestSession(input: SessionDraft) {
  validateSchedule(input.startsAt, input.endsAt);
  if (usingLocalPlaytestData()) {
    const id = localId("session");
    localPlaytestSessions().push({ id, ...input, tables: [] });
    return id;
  }
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
      postal_code: input.postalCode.trim(),
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
  if (usingLocalPlaytestData()) {
    const sessions = localPlaytestSessions();
    const index = sessions.findIndex((session) => session.id === id);
    if (index < 0) throw new PlaytestAdminInputError("That playtest could not be found.");
    sessions[index] = { ...sessions[index], ...input };
    return;
  }
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
      postal_code: input.postalCode.trim(),
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
  if (usingLocalPlaytestData()) {
    const session = localPlaytestSessions().find((item) => item.id === sessionId);
    if (!session) throw new PlaytestAdminInputError("That playtest could not be found.");
    session.tables.push({
      id: localId("table"),
      ...input,
      seatsReserved: 0,
      seatsRemaining: input.capacity,
      reservations: [],
    });
    session.tables.sort((left, right) => left.sortOrder - right.sortOrder);
    return;
  }
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
  if (usingLocalPlaytestData()) {
    const table = localPlaytestSessions()
      .flatMap((session) => session.tables)
      .find((item) => item.id === id);
    if (!table) throw new PlaytestAdminInputError("That table could not be found.");
    if (table.seatsReserved > input.capacity) {
      throw new PlaytestAdminInputError(
        `Capacity cannot be lower than the ${table.seatsReserved} reserved seats.`,
      );
    }
    Object.assign(table, input, { seatsRemaining: input.capacity - table.seatsReserved });
    return;
  }
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
  if (usingLocalPlaytestData()) {
    for (const table of localPlaytestSessions().flatMap((session) => session.tables)) {
      const reservation = table.reservations.find((item) => item.id === id);
      if (reservation?.status === "confirmed") {
        reservation.status = "cancelled";
        table.seatsReserved -= reservation.seats;
        table.seatsRemaining += reservation.seats;
        return;
      }
    }
    throw new PlaytestAdminInputError("That reservation could not be found.");
  }
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

let localSessions: AdminPlaytestSession[] | null = null;

function usingLocalPlaytestData() {
  return localAdminBypassIsEnabled() && !process.env.SUPABASE_SECRET_KEY;
}

function localPlaytestData(): AdminPlaytestResponse {
  return { sessions: localPlaytestSessions(), generatedAt: new Date().toISOString() };
}

function localPlaytestSessions() {
  if (!localSessions) localSessions = localPlaytestFixtures();
  return localSessions;
}

function localId(_kind: string) {
  return randomUUID();
}

function localPlaytestFixtures(): AdminPlaytestSession[] {
  const when = (dayOffset: number, hour: number) => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    date.setHours(hour, 0, 0, 0);
    return date.toISOString();
  };
  const reservation = (
    id: string,
    name: string,
    seats: number,
    status: "confirmed" | "cancelled" = "confirmed",
  ): AdminReservation => ({
    id,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    seats,
    status,
    reservationCode: `LH-${id.slice(-4).toUpperCase()}`,
    marketingOptIn: true,
    reminder24hSentAt: null,
    reminder2hSentAt: null,
    createdAt: when(-5, 12),
  });
  const table = (
    id: string,
    sessionId: string,
    label: string,
    capacity: number,
    reservations: AdminReservation[],
    sortOrder = 0,
  ): AdminPlaytestTable => {
    const seatsReserved = reservations
      .filter((item) => item.status === "confirmed")
      .reduce((sum, item) => sum + item.seats, 0);
    return {
      id,
      label,
      capacity,
      sortOrder,
      isActive: true,
      seatsReserved,
      seatsRemaining: Math.max(0, capacity - seatsReserved),
      reservations,
    };
  };
  const session = (
    id: string,
    dayOffset: number,
    hour: number,
    venueName: string,
    city: string,
    addressLine: string,
    tables: AdminPlaytestTable[],
    isActive = true,
  ): AdminPlaytestSession => ({
    id,
    startsAt: when(dayOffset, hour),
    endsAt: when(dayOffset, hour + 3),
    timezone: "America/Denver",
    venueName,
    addressLine,
    city,
    region: "UT",
    postalCode:
      city === "Orem"
        ? "84057"
        : city === "Provo"
          ? "84601"
          : city === "Salt Lake City"
            ? "84106"
            : "84003",
    notes: "Prototype and everything needed to play are provided. Snacks are welcome.",
    isActive,
    tables,
  });

  const pastId = "10000000-0000-4000-8000-000000000001";
  const libraryId = "10000000-0000-4000-8000-000000000002";
  const cafeId = "10000000-0000-4000-8000-000000000003";
  const draftId = "10000000-0000-4000-8000-000000000004";
  const novemberId = "10000000-0000-4000-8000-000000000005";
  return [
    session(pastId, -8, 18, "Orem Public Library", "Orem", "58 N State St", [
      table("20000000-0000-4000-8000-000000000001", pastId, "Table 1 · Ember Drake", 6, [
        reservation("30000000-0000-4000-8000-000000000101", "Alex Morgan", 2),
        reservation("30000000-0000-4000-8000-000000000102", "Jamie Lee", 1),
        reservation("30000000-0000-4000-8000-000000000103", "Taylor Reed", 2),
      ]),
    ]),
    session(libraryId, 2, 18, "Provo City Library", "Provo", "550 N University Ave", [
      table("20000000-0000-4000-8000-000000000002", libraryId, "Table 1 · Ember Drake", 6, [
        reservation("30000000-0000-4000-8000-000000000201", "Jordan Kim", 2),
        reservation("30000000-0000-4000-8000-000000000202", "Morgan Hale", 1),
        reservation("30000000-0000-4000-8000-000000000203", "Casey Brooks", 2),
      ]),
      table(
        "20000000-0000-4000-8000-000000000003",
        libraryId,
        "Table 2 · Hollow King",
        6,
        [
          reservation("30000000-0000-4000-8000-000000000204", "Riley Chen", 2),
          reservation("30000000-0000-4000-8000-000000000205", "Sam Torres", 1),
        ],
        1,
      ),
    ]),
    session(cafeId, 2, 18, "Moonwake Café", "Provo", "45 W Center St", [
      table("20000000-0000-4000-8000-000000000004", cafeId, "Window Table", 8, [
        reservation("30000000-0000-4000-8000-000000000301", "Avery Quinn", 2),
      ]),
    ]),
    session(draftId, 5, 18, "Venue to be confirmed", "Salt Lake City", "TBD", [], false),
    session(novemberId, 16, 18, "Game Night Games", "Salt Lake City", "2148 S 900 E", [
      table("20000000-0000-4000-8000-000000000005", novemberId, "Table 1 · Full run", 6, [
        reservation("30000000-0000-4000-8000-000000000401", "Drew Parker", 2),
        reservation("30000000-0000-4000-8000-000000000402", "Skyler James", 2),
        reservation("30000000-0000-4000-8000-000000000403", "Cameron Ellis", 2),
      ]),
    ]),
  ];
}
