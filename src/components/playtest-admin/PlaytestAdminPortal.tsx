import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  ExternalLink,
  Eye,
  EyeOff,
  LoaderCircle,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Table2,
  TicketCheck,
  UserRoundX,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

import type {
  AdminPlaytestResponse,
  AdminPlaytestSession,
  AdminPlaytestTable,
  AdminReservation,
  SessionDraft,
  TableDraft,
} from "@/lib/playtest-admin";

import "./playtest-admin.css";

type AuthState = "loading" | "signed_out" | "signed_in" | "not_configured";
type Editor =
  | { kind: "session"; session?: AdminPlaytestSession }
  | { kind: "table"; sessionId: string; table?: AdminPlaytestTable }
  | null;

interface ApiError {
  error?: string;
  code?: string;
}

export function PlaytestAdminPortal() {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [adminEmail, setAdminEmail] = useState("");
  const [data, setData] = useState<AdminPlaytestResponse | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [editor, setEditor] = useState<Editor>(null);
  const [showPast, setShowPast] = useState(false);

  const loadDashboard = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/playtests", {
        headers: { Accept: "application/json" },
      });
      const payload = (await response.json()) as AdminPlaytestResponse & ApiError;
      if (response.status === 401) {
        setAuthState("signed_out");
        setData(null);
        return;
      }
      if (!response.ok) throw new Error(payload.error || "The schedule could not be loaded.");
      setData(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The schedule could not be loaded.");
    } finally {
      setBusy(false);
    }
  }, []);

  const loadAuth = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/admin/playtest-auth", {
        headers: { Accept: "application/json" },
      });
      const payload = (await response.json()) as {
        authenticated?: boolean;
        configured?: boolean;
        email?: string;
      };
      if (!payload.configured) {
        setAuthState("not_configured");
        return;
      }
      if (!payload.authenticated) {
        setAuthState("signed_out");
        return;
      }
      setAdminEmail(payload.email ?? "");
      setAuthState("signed_in");
      await loadDashboard();
    } catch {
      setAuthState("signed_out");
      setError("The sign-in page could not be loaded. Refresh and try again.");
    }
  }, [loadDashboard]);

  useEffect(() => {
    void loadAuth();
  }, [loadAuth]);

  async function mutate(body: Record<string, unknown>, successMessage: string) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/playtests", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as AdminPlaytestResponse & ApiError;
      if (response.status === 401) {
        setAuthState("signed_out");
        setData(null);
        throw new Error("Your session expired. Sign in again.");
      }
      if (!response.ok) throw new Error(payload.error || "The change could not be saved.");
      setData({ sessions: payload.sessions, generatedAt: payload.generatedAt });
      setEditor(null);
      setNotice(successMessage);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The change could not be saved.");
      throw caught;
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    try {
      await fetch("/api/admin/playtest-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } finally {
      setData(null);
      setAdminEmail("");
      setAuthState("signed_out");
      setBusy(false);
    }
  }

  if (authState === "loading") return <AdminLoading />;
  if (authState === "not_configured") return <AdminUnavailable />;
  if (authState === "signed_out") {
    return (
      <AdminSignIn
        error={error}
        onAuthenticated={async (email) => {
          setAdminEmail(email);
          setAuthState("signed_in");
          await loadDashboard();
        }}
      />
    );
  }

  const sessions = data?.sessions ?? [];
  const now = Date.now();
  const upcoming = sessions.filter((session) => new Date(session.endsAt).getTime() >= now);
  const past = sessions.filter((session) => new Date(session.endsAt).getTime() < now).reverse();
  const visibleSessions = showPast ? past : upcoming;
  const activeTables = upcoming
    .flatMap((session) => session.tables)
    .filter((table) => table.isActive);
  const reservedSeats = activeTables.reduce((sum, table) => sum + table.seatsReserved, 0);
  const openSeats = activeTables.reduce((sum, table) => sum + table.seatsRemaining, 0);

  return (
    <main className="playtest-admin-shell">
      <header className="playtest-admin-topbar">
        <a className="playtest-admin-brand" href="/">
          <span className="playtest-admin-brand-mark">LH</span>
          <span>
            <strong>Last Hit</strong>
            <small>Playtest command center</small>
          </span>
        </a>
        <div className="playtest-admin-account">
          <span>{adminEmail}</span>
          <a href="/utah-playtest" target="_blank" rel="noreferrer">
            View reservation page <ExternalLink aria-hidden="true" />
          </a>
          <button type="button" onClick={() => void signOut()} disabled={busy}>
            <LogOut aria-hidden="true" /> Sign out
          </button>
        </div>
      </header>

      <div className="playtest-admin-content">
        <section className="playtest-admin-hero">
          <div>
            <p className="playtest-admin-eyebrow">Utah playtest operations</p>
            <h1>Set the tables. Fill the seats.</h1>
            <p>
              Publish new dates, manage capacity, and keep every reservation organized from one
              place.
            </p>
          </div>
          <button
            className="playtest-admin-primary"
            type="button"
            onClick={() => setEditor({ kind: "session" })}
          >
            <Plus aria-hidden="true" /> Add playtest date
          </button>
        </section>

        <section className="playtest-admin-stats" aria-label="Upcoming playtest summary">
          <Stat icon={<CalendarDays />} label="Upcoming dates" value={upcoming.length} />
          <Stat icon={<Table2 />} label="Active tables" value={activeTables.length} />
          <Stat icon={<TicketCheck />} label="Reserved seats" value={reservedSeats} />
          <Stat icon={<Users />} label="Open seats" value={openSeats} />
        </section>

        {(error || notice) && (
          <div
            className={`playtest-admin-banner ${error ? "error" : "success"}`}
            role={error ? "alert" : "status"}
          >
            {error || notice}
            <button
              type="button"
              onClick={() => (error ? setError("") : setNotice(""))}
              aria-label="Dismiss message"
            >
              <X aria-hidden="true" />
            </button>
          </div>
        )}

        <section className="playtest-admin-schedule">
          <div className="playtest-admin-section-heading">
            <div>
              <p className="playtest-admin-eyebrow">Schedule</p>
              <h2>{showPast ? "Past playtests" : "Upcoming playtests"}</h2>
            </div>
            <div className="playtest-admin-heading-actions">
              <button type="button" onClick={() => void loadDashboard()} disabled={busy}>
                <RefreshCw className={busy ? "spin" : ""} aria-hidden="true" /> Refresh
              </button>
              <button type="button" onClick={() => setShowPast((value) => !value)}>
                {showPast ? <ArrowLeft aria-hidden="true" /> : <Clock3 aria-hidden="true" />}
                {showPast ? "Back to upcoming" : `Past dates (${past.length})`}
              </button>
            </div>
          </div>

          {busy && !data ? (
            <div className="playtest-admin-empty">
              <LoaderCircle className="spin" aria-hidden="true" />
              <h3>Loading the schedule…</h3>
            </div>
          ) : visibleSessions.length === 0 ? (
            <div className="playtest-admin-empty">
              <CalendarDays aria-hidden="true" />
              <h3>{showPast ? "No past dates yet" : "Your next table is waiting"}</h3>
              <p>
                {showPast
                  ? "Completed playtests will appear here."
                  : "Add a date, choose the venue, then open one or more tables for reservations."}
              </p>
              {!showPast && (
                <button
                  className="playtest-admin-primary"
                  type="button"
                  onClick={() => setEditor({ kind: "session" })}
                >
                  <Plus aria-hidden="true" /> Add the first date
                </button>
              )}
            </div>
          ) : (
            <div className="playtest-admin-session-list">
              {visibleSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  busy={busy}
                  onEdit={() => setEditor({ kind: "session", session })}
                  onAddTable={() => setEditor({ kind: "table", sessionId: session.id })}
                  onEditTable={(table) =>
                    setEditor({ kind: "table", sessionId: session.id, table })
                  }
                  onToggleSession={() =>
                    void mutate(
                      {
                        action: "update_session",
                        id: session.id,
                        session: sessionToDraft(session, !session.isActive),
                      },
                      session.isActive
                        ? "The date is hidden from the reservation page."
                        : "The date is now published.",
                    ).catch(() => undefined)
                  }
                  onToggleTable={(table) =>
                    void mutate(
                      {
                        action: "update_table",
                        id: table.id,
                        table: tableToDraft(table, !table.isActive),
                      },
                      table.isActive
                        ? "The table is hidden from new reservations."
                        : "The table is open for reservations.",
                    ).catch(() => undefined)
                  }
                  onCancelReservation={(reservation) => {
                    const confirmed = window.confirm(
                      `Cancel ${reservation.name}’s ${reservation.seats === 1 ? "seat" : `${reservation.seats} seats`}? This immediately returns the seats to the table.`,
                    );
                    if (!confirmed) return;
                    void mutate(
                      { action: "cancel_reservation", id: reservation.id },
                      `${reservation.name}’s reservation is cancelled and the seats are open again.`,
                    ).catch(() => undefined);
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {editor?.kind === "session" && (
        <SessionEditor
          session={editor.session}
          busy={busy}
          onClose={() => setEditor(null)}
          onSave={async (draft) => {
            await mutate(
              editor.session
                ? { action: "update_session", id: editor.session.id, session: draft }
                : { action: "create_session", session: draft },
              editor.session
                ? "The playtest date is updated."
                : "The playtest date is ready. Add a table to open seats.",
            );
          }}
        />
      )}

      {editor?.kind === "table" && (
        <TableEditor
          table={editor.table}
          busy={busy}
          onClose={() => setEditor(null)}
          onSave={async (draft) => {
            await mutate(
              editor.table
                ? { action: "update_table", id: editor.table.id, table: draft }
                : { action: "create_table", sessionId: editor.sessionId, table: draft },
              editor.table ? "The table is updated." : "The table is open for reservations.",
            );
          }}
        />
      )}
    </main>
  );
}

function AdminSignIn({
  error,
  onAuthenticated,
}: {
  error: string;
  onAuthenticated: (email: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(error);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/playtest-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(
          step === "email"
            ? { action: "request_code", email }
            : { action: "verify_code", email, code },
        ),
      });
      const payload = (await response.json()) as ApiError & { message?: string };
      if (!response.ok) throw new Error(payload.error || "Sign-in could not be completed.");
      if (step === "email") {
        setStep("code");
        setMessage(payload.message || "Check your inbox for a six-digit code.");
      } else {
        await onAuthenticated(email.trim().toLowerCase());
      }
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Sign-in could not be completed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="playtest-admin-login-shell">
      <section className="playtest-admin-login-card">
        <a className="playtest-admin-brand" href="/">
          <span className="playtest-admin-brand-mark">LH</span>
          <span>
            <strong>Last Hit</strong>
            <small>Playtest command center</small>
          </span>
        </a>
        <div className="playtest-admin-login-icon">
          <ShieldCheck aria-hidden="true" />
        </div>
        <p className="playtest-admin-eyebrow">Private access</p>
        <h1>{step === "email" ? "Open the playtest schedule" : "Check your email"}</h1>
        <p>
          {step === "email"
            ? "Enter your approved email and we’ll send a short-lived sign-in code."
            : `Enter the six-digit code sent to ${email}.`}
        </p>
        <form onSubmit={submit}>
          {step === "email" ? (
            <label>
              Email address
              <span className="playtest-admin-input-wrap">
                <Mail aria-hidden="true" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                  autoFocus
                />
              </span>
            </label>
          ) : (
            <label>
              Sign-in code
              <input
                className="playtest-admin-code-input"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                autoComplete="one-time-code"
                required
                autoFocus
              />
            </label>
          )}
          {message && (
            <p className="playtest-admin-login-message" role="status">
              {message}
            </p>
          )}
          <button
            className="playtest-admin-primary"
            type="submit"
            disabled={busy || (step === "code" && code.length !== 6)}
          >
            {busy ? (
              <LoaderCircle className="spin" aria-hidden="true" />
            ) : step === "email" ? (
              <Mail aria-hidden="true" />
            ) : (
              <ShieldCheck aria-hidden="true" />
            )}
            {step === "email" ? "Send sign-in code" : "Open command center"}
          </button>
          {step === "code" && (
            <button
              className="playtest-admin-text-button"
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
                setMessage("");
              }}
            >
              Use a different email
            </button>
          )}
        </form>
        <a className="playtest-admin-back-link" href="/utah-playtest">
          <ArrowLeft aria-hidden="true" /> Back to the reservation page
        </a>
      </section>
    </main>
  );
}

function AdminLoading() {
  return (
    <main className="playtest-admin-loading">
      <LoaderCircle className="spin" aria-hidden="true" />
      <p>Opening the command center…</p>
    </main>
  );
}

function AdminUnavailable() {
  return (
    <main className="playtest-admin-login-shell">
      <section className="playtest-admin-login-card">
        <ShieldCheck className="playtest-admin-unavailable-icon" aria-hidden="true" />
        <h1>Admin access is being prepared</h1>
        <p>The schedule is safe. Finish the private access setup before managing dates here.</p>
        <a className="playtest-admin-back-link" href="/utah-playtest">
          <ArrowLeft aria-hidden="true" /> Back to the reservation page
        </a>
      </section>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="playtest-admin-stat">
      <span>{icon}</span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
    </div>
  );
}

function SessionCard({
  session,
  busy,
  onEdit,
  onAddTable,
  onEditTable,
  onToggleSession,
  onToggleTable,
  onCancelReservation,
}: {
  session: AdminPlaytestSession;
  busy: boolean;
  onEdit: () => void;
  onAddTable: () => void;
  onEditTable: (table: AdminPlaytestTable) => void;
  onToggleSession: () => void;
  onToggleTable: (table: AdminPlaytestTable) => void;
  onCancelReservation: (reservation: AdminReservation) => void;
}) {
  const [rosterOpen, setRosterOpen] = useState(false);
  const date = formatAdminDate(session.startsAt, session.endsAt, session.timezone);
  const confirmedReservations = session.tables
    .flatMap((table) => table.reservations)
    .filter((reservation) => reservation.status === "confirmed");
  const confirmedSeats = confirmedReservations.reduce(
    (sum, reservation) => sum + reservation.seats,
    0,
  );

  return (
    <article className={`playtest-admin-session-card ${session.isActive ? "" : "is-hidden"}`}>
      <header>
        <div className="playtest-admin-date-tile">
          <strong>{date.day}</strong>
          <span>{date.month}</span>
        </div>
        <div className="playtest-admin-session-title">
          <div>
            <span className={`playtest-admin-status ${session.isActive ? "live" : "hidden"}`}>
              {session.isActive ? "Published" : "Hidden"}
            </span>
            {new Date(session.endsAt).getTime() < Date.now() && (
              <span className="playtest-admin-status past">Completed</span>
            )}
          </div>
          <h3>
            {date.weekday}, {date.fullDate}
          </h3>
          <p>
            <Clock3 aria-hidden="true" /> {date.time} <MapPin aria-hidden="true" />{" "}
            {session.venueName}, {session.city}
          </p>
        </div>
        <div className="playtest-admin-session-actions">
          <button type="button" onClick={onEdit}>
            <Pencil aria-hidden="true" /> Edit date
          </button>
          <button type="button" onClick={onToggleSession} disabled={busy}>
            {session.isActive ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            {session.isActive ? "Hide" : "Publish"}
          </button>
        </div>
      </header>

      <div className="playtest-admin-session-summary">
        <span>
          {session.tables.length} {session.tables.length === 1 ? "table" : "tables"}
        </span>
        <span>
          {confirmedSeats} reserved {confirmedSeats === 1 ? "seat" : "seats"}
        </span>
        <span>
          {session.addressLine}, {session.city}, {session.region}
        </span>
      </div>

      {session.notes && <p className="playtest-admin-session-notes">{session.notes}</p>}

      <div className="playtest-admin-table-heading">
        <h4>Tables</h4>
        <button type="button" onClick={onAddTable}>
          <Plus aria-hidden="true" /> Add table
        </button>
      </div>
      {session.tables.length === 0 ? (
        <div className="playtest-admin-no-tables">
          <Table2 aria-hidden="true" />
          <div>
            <strong>No tables yet</strong>
            <p>
              The date can appear as “Tables coming soon,” or you can add a table and open seats
              now.
            </p>
          </div>
        </div>
      ) : (
        <div className="playtest-admin-table-list">
          {session.tables.map((table) => (
            <div
              className={`playtest-admin-table-row ${table.isActive ? "" : "is-hidden"}`}
              key={table.id}
            >
              <div className="playtest-admin-table-main">
                <div className="playtest-admin-table-icon">
                  <Table2 aria-hidden="true" />
                </div>
                <div>
                  <strong>{table.label}</strong>
                  <span>
                    {table.isActive ? "Open for reservations" : "Hidden from reservations"}
                  </span>
                </div>
              </div>
              <div className="playtest-admin-capacity">
                <div>
                  <span>{table.seatsReserved} reserved</span>
                  <span>{table.seatsRemaining} open</span>
                </div>
                <div className="playtest-admin-capacity-track">
                  <span
                    style={{
                      width: `${Math.min(100, (table.seatsReserved / table.capacity) * 100)}%`,
                    }}
                  />
                </div>
                <small>{table.capacity} total seats</small>
              </div>
              <div className="playtest-admin-table-actions">
                <button type="button" onClick={() => onEditTable(table)}>
                  <Pencil aria-hidden="true" /> Edit
                </button>
                <button type="button" onClick={() => onToggleTable(table)} disabled={busy}>
                  {table.isActive ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                  {table.isActive ? "Hide" : "Open"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="playtest-admin-roster-toggle"
        type="button"
        onClick={() => setRosterOpen((value) => !value)}
        aria-expanded={rosterOpen}
      >
        <span>
          <Users aria-hidden="true" /> Reservation roster{" "}
          <strong>{confirmedReservations.length}</strong>
        </span>
        <ChevronDown className={rosterOpen ? "rotated" : ""} aria-hidden="true" />
      </button>

      {rosterOpen && (
        <div className="playtest-admin-roster">
          {session.tables.every((table) => table.reservations.length === 0) ? (
            <div className="playtest-admin-roster-empty">
              <Users aria-hidden="true" />
              <p>
                No reservations yet. New players will appear here as soon as they choose a table.
              </p>
            </div>
          ) : (
            session.tables.map(
              (table) =>
                table.reservations.length > 0 && (
                  <section key={table.id}>
                    <h5>{table.label}</h5>
                    <div className="playtest-admin-reservation-list">
                      {table.reservations.map((reservation) => (
                        <div
                          className={`playtest-admin-reservation ${reservation.status}`}
                          key={reservation.id}
                        >
                          <div className="playtest-admin-reservation-name">
                            <span>{reservation.name.slice(0, 1).toUpperCase()}</span>
                            <div>
                              <strong>{reservation.name}</strong>
                              <a href={`mailto:${reservation.email}`}>{reservation.email}</a>
                            </div>
                          </div>
                          <div className="playtest-admin-reservation-detail">
                            <span>
                              {reservation.seats} {reservation.seats === 1 ? "seat" : "seats"}
                            </span>
                            <small>{reservation.reservationCode}</small>
                          </div>
                          <div
                            className="playtest-admin-reminders"
                            title="Reminder delivery status"
                          >
                            <span className={reservation.reminder24hSentAt ? "sent" : ""}>
                              {reservation.reminder24hSentAt && <Check aria-hidden="true" />}24h
                            </span>
                            <span className={reservation.reminder2hSentAt ? "sent" : ""}>
                              {reservation.reminder2hSentAt && <Check aria-hidden="true" />}2h
                            </span>
                          </div>
                          {reservation.status === "confirmed" ? (
                            <button
                              className="playtest-admin-cancel"
                              type="button"
                              onClick={() => onCancelReservation(reservation)}
                              disabled={busy}
                            >
                              <UserRoundX aria-hidden="true" /> Cancel
                            </button>
                          ) : (
                            <span className="playtest-admin-cancelled-label">Cancelled</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                ),
            )
          )}
        </div>
      )}
    </article>
  );
}

function SessionEditor({
  session,
  busy,
  onClose,
  onSave,
}: {
  session?: AdminPlaytestSession;
  busy: boolean;
  onClose: () => void;
  onSave: (draft: SessionDraft) => Promise<void>;
}) {
  const [draft, setDraft] = useState(() => sessionFormDraft(session));
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const startsAt = new Date(draft.startsAtLocal);
    const endsAt = new Date(draft.endsAtLocal);
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) {
      setError("Choose an end time after the start time.");
      return;
    }
    try {
      await onSave({
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        timezone: "America/Denver",
        venueName: draft.venueName,
        addressLine: draft.addressLine,
        city: draft.city,
        region: draft.region,
        notes: draft.notes,
        isActive: draft.isActive,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The date could not be saved.");
    }
  }

  return (
    <div
      className="playtest-admin-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        className="playtest-admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-editor-title"
      >
        <header>
          <div>
            <p className="playtest-admin-eyebrow">{session ? "Update schedule" : "New playtest"}</p>
            <h2 id="session-editor-title">
              {session ? "Edit playtest date" : "Add a playtest date"}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X aria-hidden="true" />
          </button>
        </header>
        <form onSubmit={submit}>
          <div className="playtest-admin-form-grid two">
            <label>
              Starts{" "}
              <input
                type="datetime-local"
                value={draft.startsAtLocal}
                onChange={(event) => setDraft({ ...draft, startsAtLocal: event.target.value })}
                required
              />
            </label>
            <label>
              Ends{" "}
              <input
                type="datetime-local"
                value={draft.endsAtLocal}
                onChange={(event) => setDraft({ ...draft, endsAtLocal: event.target.value })}
                required
              />
            </label>
          </div>
          <p className="playtest-admin-field-note">Times use Mountain Time for Utah.</p>
          <label>
            Venue name{" "}
            <input
              value={draft.venueName}
              onChange={(event) => setDraft({ ...draft, venueName: event.target.value })}
              placeholder="Provo City Library"
              maxLength={160}
              required
            />
          </label>
          <label>
            Street address{" "}
            <input
              value={draft.addressLine}
              onChange={(event) => setDraft({ ...draft, addressLine: event.target.value })}
              placeholder="550 N University Ave"
              maxLength={200}
              required
            />
          </label>
          <div className="playtest-admin-form-grid city">
            <label>
              City{" "}
              <input
                value={draft.city}
                onChange={(event) => setDraft({ ...draft, city: event.target.value })}
                placeholder="Provo"
                maxLength={100}
                required
              />
            </label>
            <label>
              State{" "}
              <input
                value={draft.region}
                onChange={(event) =>
                  setDraft({ ...draft, region: event.target.value.toUpperCase() })
                }
                maxLength={2}
                required
              />
            </label>
          </div>
          <label>
            Player note{" "}
            <textarea
              value={draft.notes}
              onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
              placeholder="Prototype and everything needed to play are provided."
              maxLength={600}
              rows={3}
            />
          </label>
          <label className="playtest-admin-switch">
            <input
              type="checkbox"
              checked={draft.isActive}
              onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })}
            />
            <span>
              <strong>Publish this date</strong>
              <small>Players can see it as soon as you save.</small>
            </span>
          </label>
          {error && (
            <p className="playtest-admin-form-error" role="alert">
              {error}
            </p>
          )}
          <footer>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="playtest-admin-primary" type="submit" disabled={busy}>
              {busy ? (
                <LoaderCircle className="spin" aria-hidden="true" />
              ) : (
                <Check aria-hidden="true" />
              )}
              {session ? "Save changes" : "Add date"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function TableEditor({
  table,
  busy,
  onClose,
  onSave,
}: {
  table?: AdminPlaytestTable;
  busy: boolean;
  onClose: () => void;
  onSave: (draft: TableDraft) => Promise<void>;
}) {
  const [draft, setDraft] = useState<TableDraft>(() =>
    table ? tableToDraft(table) : { label: "Table 1", capacity: 6, sortOrder: 0, isActive: true },
  );
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await onSave(draft);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The table could not be saved.");
    }
  }
  return (
    <div
      className="playtest-admin-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        className="playtest-admin-modal compact"
        role="dialog"
        aria-modal="true"
        aria-labelledby="table-editor-title"
      >
        <header>
          <div>
            <p className="playtest-admin-eyebrow">Seat setup</p>
            <h2 id="table-editor-title">{table ? "Edit table" : "Add a table"}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X aria-hidden="true" />
          </button>
        </header>
        <form onSubmit={submit}>
          <label>
            Table name{" "}
            <input
              value={draft.label}
              onChange={(event) => setDraft({ ...draft, label: event.target.value })}
              placeholder="Table 1 · Ember Drake"
              maxLength={120}
              required
            />
          </label>
          <div className="playtest-admin-form-grid two">
            <label>
              Seat capacity{" "}
              <input
                type="number"
                min={Math.max(1, table?.seatsReserved ?? 1)}
                max={12}
                value={draft.capacity}
                onChange={(event) => setDraft({ ...draft, capacity: Number(event.target.value) })}
                required
              />
            </label>
            <label>
              Display order{" "}
              <input
                type="number"
                min={-100}
                max={100}
                value={draft.sortOrder}
                onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })}
                required
              />
            </label>
          </div>
          {table && table.seatsReserved > 0 && (
            <p className="playtest-admin-field-note">
              This table already has {table.seatsReserved} reserved{" "}
              {table.seatsReserved === 1 ? "seat" : "seats"}. Capacity cannot be set below that
              number.
            </p>
          )}
          <label className="playtest-admin-switch">
            <input
              type="checkbox"
              checked={draft.isActive}
              onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })}
            />
            <span>
              <strong>Open this table</strong>
              <small>Players can choose it while seats remain.</small>
            </span>
          </label>
          {error && (
            <p className="playtest-admin-form-error" role="alert">
              {error}
            </p>
          )}
          <footer>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="playtest-admin-primary" type="submit" disabled={busy}>
              {busy ? (
                <LoaderCircle className="spin" aria-hidden="true" />
              ) : (
                <Check aria-hidden="true" />
              )}
              {table ? "Save changes" : "Add table"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function sessionFormDraft(session?: AdminPlaytestSession) {
  if (session)
    return {
      startsAtLocal: toLocalInput(session.startsAt),
      endsAtLocal: toLocalInput(session.endsAt),
      venueName: session.venueName,
      addressLine: session.addressLine,
      city: session.city,
      region: session.region,
      notes: session.notes,
      isActive: session.isActive,
    };
  const start = nextSaturdayAtSix();
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  return {
    startsAtLocal: toLocalInput(start.toISOString()),
    endsAtLocal: toLocalInput(end.toISOString()),
    venueName: "",
    addressLine: "",
    city: "",
    region: "UT",
    notes: "Prototype and everything needed to play are provided.",
    isActive: true,
  };
}

function sessionToDraft(session: AdminPlaytestSession, isActive = session.isActive): SessionDraft {
  return {
    startsAt: session.startsAt,
    endsAt: session.endsAt,
    timezone: session.timezone,
    venueName: session.venueName,
    addressLine: session.addressLine,
    city: session.city,
    region: session.region,
    notes: session.notes,
    isActive,
  };
}

function tableToDraft(table: AdminPlaytestTable, isActive = table.isActive): TableDraft {
  return { label: table.label, capacity: table.capacity, sortOrder: table.sortOrder, isActive };
}

function nextSaturdayAtSix() {
  const date = new Date();
  const days = (6 - date.getDay() + 7) % 7 || 7;
  date.setDate(date.getDate() + days);
  date.setHours(18, 0, 0, 0);
  return date;
}

function toLocalInput(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function formatAdminDate(startsAt: string, endsAt: string, timezone: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { timeZone: timezone, ...options });
  return {
    day: format({ day: "2-digit" }).format(start),
    month: format({ month: "short" }).format(start).toUpperCase(),
    weekday: format({ weekday: "long" }).format(start),
    fullDate: format({ month: "long", day: "numeric", year: "numeric" }).format(start),
    time: `${format({ hour: "numeric", minute: "2-digit" }).format(start)}–${format({ hour: "numeric", minute: "2-digit" }).format(end)}`,
  };
}
