export interface PlaytestTable {
  id: string;
  label: string;
  capacity: number;
  seatsReserved: number;
  seatsRemaining: number;
  status: "available" | "limited" | "full";
}

export interface PlaytestSession {
  id: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  venueName: string;
  addressLine: string;
  city: string;
  region: string;
  notes: string;
  tables: PlaytestTable[];
}

export interface PlaytestSessionsResponse {
  sessions: PlaytestSession[];
  mode: "live" | "demo" | "unconfigured";
}

export interface PlaytestReservationResponse {
  ok: true;
  reservationCode: string;
  session: {
    startsAt: string;
    endsAt: string;
    timezone: string;
    venueName: string;
    addressLine: string;
    city: string;
    region: string;
    tableLabel: string;
  };
}

export function createDemoPlaytestSessions(now = new Date()): PlaytestSession[] {
  const nextSaturday = nextWeekdayAt(now, 6, 13);
  const followingSaturday = new Date(nextSaturday);
  followingSaturday.setUTCDate(followingSaturday.getUTCDate() + 7);

  return [
    createDemoSession("demo-session-one", nextSaturday, [
      createDemoTable("demo-table-one", "Table A · The Ember Drake", 6, 2),
      createDemoTable("demo-table-two", "Table B · The Moss Troll", 6, 5),
    ]),
    createDemoSession("demo-session-two", followingSaturday, [
      createDemoTable("demo-table-three", "Table A · The Crystal Basilisk", 6, 0),
    ]),
  ];
}

function createDemoSession(id: string, startsAt: Date, tables: PlaytestTable[]): PlaytestSession {
  const endsAt = new Date(startsAt);
  endsAt.setUTCHours(endsAt.getUTCHours() + 2);
  return {
    id,
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    timezone: "America/Denver",
    venueName: "Utah County venue",
    addressLine: "Address shared after reservation",
    city: "Utah County",
    region: "UT",
    notes: "Prototype and everything needed to play are provided.",
    tables,
  };
}

function createDemoTable(
  id: string,
  label: string,
  capacity: number,
  seatsReserved: number,
): PlaytestTable {
  const seatsRemaining = capacity - seatsReserved;
  return {
    id,
    label,
    capacity,
    seatsReserved,
    seatsRemaining,
    status: seatsRemaining === 0 ? "full" : seatsRemaining <= 2 ? "limited" : "available",
  };
}

function nextWeekdayAt(now: Date, weekday: number, hour: number) {
  const date = new Date(now);
  const daysAhead = (weekday - date.getUTCDay() + 7) % 7 || 7;
  date.setUTCDate(date.getUTCDate() + daysAhead);
  date.setUTCHours(hour + 6, 0, 0, 0);
  return date;
}
