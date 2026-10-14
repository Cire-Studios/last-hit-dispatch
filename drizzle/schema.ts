import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const playtestSessions = pgTable(
  "playtest_sessions",
  {
    id: uuid().primaryKey().defaultRandom(),
    startsAt: timestamp("starts_at", { withTimezone: true, mode: "string" }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true, mode: "string" }).notNull(),
    timezone: text().notNull().default("America/Denver"),
    venueName: text("venue_name").notNull(),
    addressLine: text("address_line").notNull(),
    city: text().notNull(),
    region: text().notNull().default("UT"),
    notes: text(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [check("playtest_sessions_time_order", sql`${table.endsAt} > ${table.startsAt}`)],
);

export const playtestTables = pgTable(
  "playtest_tables",
  {
    id: uuid().primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => playtestSessions.id, { onDelete: "cascade" }),
    label: text().notNull(),
    capacity: integer().notNull().default(6),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("playtest_tables_capacity", sql`${table.capacity} between 1 and 12`),
    unique("playtest_tables_session_label").on(table.sessionId, table.label),
  ],
);

export const playtestReservations = pgTable(
  "playtest_reservations",
  {
    id: uuid().primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => playtestSessions.id, { onDelete: "restrict" }),
    tableId: uuid("table_id")
      .notNull()
      .references(() => playtestTables.id, { onDelete: "restrict" }),
    name: text().notNull(),
    email: text().notNull(),
    seats: integer().notNull().default(1),
    status: text().notNull().default("confirmed"),
    reservationCode: text("reservation_code").notNull().unique(),
    marketingOptIn: boolean("marketing_opt_in").notNull().default(false),
    source: text().notNull().default("/utah-playtest"),
    reminder24hSentAt: timestamp("reminder_24h_sent_at", {
      withTimezone: true,
      mode: "string",
    }),
    reminder2hSentAt: timestamp("reminder_2h_sent_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("playtest_reservations_seats", sql`${table.seats} between 1 and 4`),
    check("playtest_reservations_status", sql`${table.status} in ('confirmed', 'cancelled')`),
    uniqueIndex("playtest_reservations_one_per_session_email")
      .on(table.sessionId, sql`lower(${table.email})`)
      .where(sql`${table.status} = 'confirmed'`),
    index("playtest_reservations_table_status").on(table.tableId, table.status),
  ],
);
