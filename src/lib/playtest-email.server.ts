import type { ReminderRow, ReservationResult } from "@/lib/playtest-storage.server";

interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export function emailDeliveryIsConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.PLAYTEST_EMAIL_FROM);
}

export async function sendReservationConfirmation(
  to: string,
  name: string,
  seats: number,
  reservation: ReservationResult,
) {
  const when = formatSchedule(reservation.starts_at, reservation.ends_at, reservation.timezone);
  const location = formatLocation(reservation);
  const safeName = escapeHtml(firstName(name));
  const safeTable = escapeHtml(reservation.table_label);
  const safeCode = escapeHtml(reservation.reservation_code);

  await sendEmail({
    to,
    subject: `Your Last Hit playtest seat is reserved · ${when.shortDate}`,
    text: [
      `Hi ${firstName(name)},`,
      "",
      `Your Last Hit playtest reservation is confirmed for ${when.full}.`,
      `${reservation.table_label} · ${seats} ${seats === 1 ? "seat" : "seats"}`,
      location,
      `Reservation code: ${reservation.reservation_code}`,
      "",
      "We’ll send a reminder before the hunt. If your plans change, reply to this email so we can open the seat for another player.",
    ].join("\n"),
    html: emailFrame(`
      <p style="margin:0 0 18px">Hi ${safeName},</p>
      <h1 style="margin:0 0 12px;color:#f1d598;font:700 28px Georgia,serif">Your seat is reserved.</h1>
      <p style="margin:0 0 22px;color:#e6d2a6">You’re joining the Last Hit playtest on <strong>${escapeHtml(when.full)}</strong>.</p>
      ${detailCard([
        ["Table", safeTable],
        ["Party", `${seats} ${seats === 1 ? "seat" : "seats"}`],
        ["Location", escapeHtml(location)],
        ["Reservation", safeCode],
      ])}
      <p style="margin:22px 0 0;color:#bcae95">We’ll send a reminder before the hunt. If your plans change, reply to this email so we can open the seat for another player.</p>
    `),
  });
}

export async function sendPlaytestReminder(row: ReminderRow, kind: "24h" | "2h") {
  const when = formatSchedule(row.starts_at, row.ends_at, row.timezone);
  const location = formatLocation(row);
  const timing = kind === "24h" ? "tomorrow" : "in about two hours";
  const subject =
    kind === "24h"
      ? `Your Last Hit playtest is tomorrow · ${when.time}`
      : `The hunt begins soon · ${when.time}`;

  await sendEmail({
    to: row.email,
    subject,
    text: [
      `Hi ${firstName(row.name)},`,
      "",
      `Your Last Hit playtest begins ${timing}.`,
      `${when.full} · ${row.table_label}`,
      location,
      `Reservation code: ${row.reservation_code}`,
      "",
      "Please arrive 10 minutes early. The prototype and everything needed to play will be ready for you.",
    ].join("\n"),
    html: emailFrame(`
      <p style="margin:0 0 18px">Hi ${escapeHtml(firstName(row.name))},</p>
      <h1 style="margin:0 0 12px;color:#f1d598;font:700 28px Georgia,serif">The hunt begins ${timing}.</h1>
      <p style="margin:0 0 22px;color:#e6d2a6">Your table is waiting.</p>
      ${detailCard([
        ["When", escapeHtml(when.full)],
        ["Table", escapeHtml(row.table_label)],
        ["Location", escapeHtml(location)],
        ["Reservation", escapeHtml(row.reservation_code)],
      ])}
      <p style="margin:22px 0 0;color:#bcae95">Please arrive 10 minutes early. The prototype and everything needed to play will be ready for you.</p>
    `),
  });
}

export async function sendAdminLoginCode(to: string, code: string) {
  await sendEmail({
    to,
    subject: `${code} is your Last Hit playtest admin code`,
    text: [
      "Use this code to open the Last Hit playtest schedule:",
      "",
      code,
      "",
      "This code expires in 10 minutes. If you didn’t request it, you can ignore this email.",
    ].join("\n"),
    html: emailFrame(`
      <p style="margin:0 0 18px">Use this code to open the playtest schedule:</p>
      <p style="margin:0 0 22px;color:#f1d598;font:700 36px/1 Georgia,serif;letter-spacing:.18em">${escapeHtml(code)}</p>
      <p style="margin:0;color:#bcae95">This code expires in 10 minutes. If you didn’t request it, you can ignore this email.</p>
    `),
  });
}

async function sendEmail(message: EmailMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.PLAYTEST_EMAIL_FROM;
  if (!apiKey || !from) throw new Error("Playtest email is not configured");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      ...(process.env.PLAYTEST_REPLY_TO ? { reply_to: process.env.PLAYTEST_REPLY_TO } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(`Playtest email request failed (${response.status}): ${await response.text()}`);
  }
}

function formatSchedule(startsAt: string, endsAt: string, timezone: string) {
  const date = new Date(startsAt);
  const end = new Date(endsAt);
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    month: "short",
    day: "numeric",
  });
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
  });
  const time = timeFormatter.format(date);
  return {
    full: `${dateFormatter.format(date)} · ${time}–${timeFormatter.format(end)}`,
    shortDate: shortDateFormatter.format(date),
    time,
  };
}

function formatLocation(location: {
  venue_name: string;
  address_line: string;
  city: string;
  region: string;
  postal_code: string;
}) {
  return [
    location.venue_name,
    location.address_line,
    `${location.city}, ${location.region}${location.postal_code ? ` ${location.postal_code}` : ""}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

function detailCard(rows: string[][]) {
  return `<div style="border:1px solid #765022;background:#17120f;padding:18px 20px">${rows
    .map(
      ([label, value]) =>
        `<p style="margin:0 0 10px"><span style="display:inline-block;min-width:94px;color:#d1a04e;text-transform:uppercase;font:700 11px Arial,sans-serif;letter-spacing:.12em">${label}</span> <strong style="color:#eee2c6">${value}</strong></p>`,
    )
    .join("")}</div>`;
}

function emailFrame(content: string) {
  return `<div style="margin:0;background:#0d0b09;padding:32px 14px;color:#eee2c6;font:17px/1.55 Georgia,serif"><div style="max-width:600px;margin:0 auto"><p style="margin:0 0 24px;color:#d1a04e;font:700 13px Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase">Last Hit · Playtest Dispatch</p>${content}</div></div>`;
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "Hunter";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character] ?? character;
  });
}
