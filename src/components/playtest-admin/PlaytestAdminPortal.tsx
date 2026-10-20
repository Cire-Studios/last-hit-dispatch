import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";

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
type CalendarView = "month" | "week" | "day";
type CalendarEventStatusName = "published" | "hidden" | "complete" | "missed";
type Editor =
  | { kind: "session"; session?: AdminPlaytestSession; date?: string }
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
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [detailSessionId, setDetailSessionId] = useState<string | null>(null);

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
  const detailSession = sessions.find((session) => session.id === detailSessionId) ?? null;
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
          {busy && !data ? (
            <div className="playtest-admin-empty">
              <LoaderCircle className="spin" aria-hidden="true" />
              <h3>Loading the schedule…</h3>
            </div>
          ) : (
            <PlaytestCalendar
              month={calendarMonth}
              sessions={sessions}
              busy={busy}
              pastCount={past.length}
              onMonthChange={setCalendarMonth}
              onRefresh={() => void loadDashboard()}
              onAddDate={(date) => setEditor({ kind: "session", date })}
              onOpenSession={setDetailSessionId}
            />
          )}
        </section>
      </div>

      {detailSession && (
        <SessionDetail
          session={detailSession}
          busy={busy}
          onClose={() => setDetailSessionId(null)}
          onEdit={() => {
            setDetailSessionId(null);
            setEditor({ kind: "session", session: detailSession });
          }}
          onAddTable={() => {
            setDetailSessionId(null);
            setEditor({ kind: "table", sessionId: detailSession.id });
          }}
          onEditTable={(table) => {
            setDetailSessionId(null);
            setEditor({ kind: "table", sessionId: detailSession.id, table });
          }}
          onToggleSession={() =>
            void mutate(
              {
                action: "update_session",
                id: detailSession.id,
                session: sessionToDraft(detailSession, !detailSession.isActive),
              },
              detailSession.isActive
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
      )}

      {editor?.kind === "session" && (
        <SessionEditor
          session={editor.session}
          initialDate={editor.date}
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

function PlaytestCalendar({
  month,
  sessions,
  busy,
  pastCount,
  onMonthChange,
  onRefresh,
  onAddDate,
  onOpenSession,
}: {
  month: Date;
  sessions: AdminPlaytestSession[];
  busy: boolean;
  pastCount: number;
  onMonthChange: (month: Date) => void;
  onRefresh: () => void;
  onAddDate: (date: string) => void;
  onOpenSession: (sessionId: string) => void;
}) {
  const [view, setView] = useState<CalendarView>("month");
  const todayKey = localDateKey(new Date());
  const sessionsByDate = useMemo(() => {
    const grouped = new Map<string, AdminPlaytestSession[]>();
    for (const session of sessions) {
      const key = sessionDateKey(session);
      const dateSessions = grouped.get(key) ?? [];
      dateSessions.push(session);
      grouped.set(key, dateSessions);
    }
    grouped.forEach((dateSessions) =>
      dateSessions.sort(
        (left, right) => new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime(),
      ),
    );
    return grouped;
  }, [sessions]);

  const title = calendarTitle(month, view);
  const description =
    view === "month"
      ? "Scan the month, then open a playtest for reservations and table details."
      : view === "week"
        ? "Compare each day’s playtests and capacity in one scrollable week."
        : "Review exact start times and overlapping playtests across the full day.";

  function changeView(nextView: CalendarView) {
    const today = new Date();
    if (view === "month" && nextView !== "month" && isSameMonth(month, today)) {
      onMonthChange(today);
    } else if (nextView === "month") {
      onMonthChange(startOfMonth(month));
    }
    setView(nextView);
  }

  function navigate(amount: number) {
    onMonthChange(
      view === "month"
        ? addMonths(month, amount)
        : addDays(month, amount * (view === "week" ? 7 : 1)),
    );
  }

  function openDay(day: Date) {
    onMonthChange(day);
    setView("day");
  }

  return (
    <div className="playtest-admin-calendar-panel">
      <header className="playtest-admin-calendar-toolbar">
        <div>
          <p className="playtest-admin-eyebrow">Schedule</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="playtest-admin-calendar-actions">
          <div className="playtest-admin-view-controls" aria-label="Calendar view">
            {(["month", "week", "day"] as CalendarView[]).map((calendarView) => (
              <button
                type="button"
                className={view === calendarView ? "active" : ""}
                aria-pressed={view === calendarView}
                onClick={() => changeView(calendarView)}
                key={calendarView}
              >
                {calendarView[0].toUpperCase() + calendarView.slice(1)}
              </button>
            ))}
          </div>
          <div className="playtest-admin-month-controls" aria-label="Calendar navigation">
            <button type="button" onClick={() => navigate(-1)} aria-label={`Previous ${view}`}>
              <ChevronLeft aria-hidden="true" />
            </button>
            <button type="button" onClick={() => onMonthChange(new Date())}>
              Today
            </button>
            <button type="button" onClick={() => navigate(1)} aria-label={`Next ${view}`}>
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
          <button
            className="playtest-admin-calendar-refresh"
            type="button"
            onClick={onRefresh}
            disabled={busy}
          >
            <RefreshCw className={busy ? "spin" : ""} aria-hidden="true" /> Refresh
          </button>
        </div>
      </header>

      <div className="playtest-admin-calendar-legend" aria-label="Calendar key">
        {(["published", "hidden", "complete", "missed"] as CalendarEventStatusName[]).map(
          (status) => (
            <span key={status}>
              <CalendarStatusIcon status={status} />
              {calendarStatusLabel(status)}
            </span>
          ),
        )}
        <strong>
          {pastCount} past {pastCount === 1 ? "playtest" : "playtests"}
        </strong>
      </div>

      {view === "month" && (
        <MonthCalendarView
          month={month}
          sessionsByDate={sessionsByDate}
          todayKey={todayKey}
          onAddDate={onAddDate}
          onOpenSession={onOpenSession}
          onViewDay={openDay}
        />
      )}
      {view === "week" && (
        <WeekCalendarView
          date={month}
          sessionsByDate={sessionsByDate}
          todayKey={todayKey}
          onAddDate={onAddDate}
          onOpenSession={onOpenSession}
          onViewDay={openDay}
        />
      )}
      {view === "day" && (
        <DayCalendarView
          date={month}
          sessions={sessionsByDate.get(localDateKey(month)) ?? []}
          onAddDate={onAddDate}
          onOpenSession={onOpenSession}
        />
      )}
    </div>
  );
}

function MonthCalendarView({
  month,
  sessionsByDate,
  todayKey,
  onAddDate,
  onOpenSession,
  onViewDay,
}: {
  month: Date;
  sessionsByDate: Map<string, AdminPlaytestSession[]>;
  todayKey: string;
  onAddDate: (date: string) => void;
  onOpenSession: (sessionId: string) => void;
  onViewDay: (day: Date) => void;
}) {
  return (
    <div className="playtest-admin-calendar-scroll">
      <div className="playtest-admin-weekdays" aria-hidden="true">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>
      <div className="playtest-admin-calendar-grid">
        {calendarDays(month).map((day) => {
          const key = localDateKey(day);
          const daySessions = sessionsByDate.get(key) ?? [];
          const visibleSessions = daySessions.length >= 3 ? daySessions.slice(0, 1) : daySessions;
          const outsideMonth = day.getMonth() !== month.getMonth();
          const isPastDay = key < todayKey;
          const isToday = key === todayKey;
          return (
            <section
              className={`playtest-admin-calendar-day${outsideMonth ? " outside" : ""}${isPastDay ? " past" : ""}${isToday ? " today" : ""}`}
              key={key}
              aria-label={formatDayLabel(day)}
            >
              <CalendarDayHeader day={day} isToday={isToday} onAddDate={() => onAddDate(key)} />
              <div className="playtest-admin-day-sessions">
                {visibleSessions.map((session) => (
                  <CalendarEventButton
                    session={session}
                    onClick={() => onOpenSession(session.id)}
                    key={session.id}
                  />
                ))}
                {daySessions.length >= 3 && (
                  <button
                    className="playtest-admin-more-events"
                    type="button"
                    onClick={() => onViewDay(day)}
                  >
                    +{daySessions.length - 1} more playtests
                  </button>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function WeekCalendarView({
  date,
  sessionsByDate,
  todayKey,
  onAddDate,
  onOpenSession,
  onViewDay,
}: {
  date: Date;
  sessionsByDate: Map<string, AdminPlaytestSession[]>;
  todayKey: string;
  onAddDate: (date: string) => void;
  onOpenSession: (sessionId: string) => void;
  onViewDay: (day: Date) => void;
}) {
  return (
    <div className="playtest-admin-week-scroll">
      <div className="playtest-admin-week-grid">
        {weekDays(date).map((day) => {
          const key = localDateKey(day);
          const daySessions = sessionsByDate.get(key) ?? [];
          const isToday = key === todayKey;
          return (
            <section className={`playtest-admin-week-day${isToday ? " today" : ""}`} key={key}>
              <header>
                <button type="button" onClick={() => onViewDay(day)}>
                  <span>{WEEKDAYS[day.getDay()]}</span>
                  <strong>{day.getDate()}</strong>
                  {isToday && <small>Today</small>}
                </button>
                <button
                  className="playtest-admin-week-add"
                  type="button"
                  onClick={() => onAddDate(key)}
                  aria-label={`Add playtest on ${formatDayLabel(day)}`}
                >
                  <Plus aria-hidden="true" />
                </button>
              </header>
              <div className="playtest-admin-week-events">
                {daySessions.length ? (
                  daySessions.map((session) => (
                    <CalendarEventButton
                      session={session}
                      onClick={() => onOpenSession(session.id)}
                      showEndTime
                      key={session.id}
                    />
                  ))
                ) : (
                  <button
                    className="playtest-admin-week-empty"
                    type="button"
                    onClick={() => onAddDate(key)}
                  >
                    <Plus aria-hidden="true" />
                    Add playtest
                  </button>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function DayCalendarView({
  date,
  sessions,
  onAddDate,
  onOpenSession,
}: {
  date: Date;
  sessions: AdminPlaytestSession[];
  onAddDate: (date: string) => void;
  onOpenSession: (sessionId: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateKey = localDateKey(date);
  const isToday = dateKey === localDateKey(new Date());
  const laidOutSessions = useMemo(() => layoutDaySessions(sessions), [sessions]);

  useEffect(() => {
    const firstStart = laidOutSessions[0]?.startMinutes ?? 8 * 60;
    if (scrollRef.current) {
      scrollRef.current.scrollTop = Math.max(0, (firstStart / 60 - 1.5) * DAY_HOUR_HEIGHT);
    }
  }, [dateKey, laidOutSessions]);

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return (
    <div className="playtest-admin-day-view">
      <div className="playtest-admin-day-view-heading">
        <div>
          <strong>{sessions.length}</strong>
          <span>{sessions.length === 1 ? "playtest" : "playtests"} scheduled</span>
        </div>
        <button type="button" onClick={() => onAddDate(dateKey)}>
          <Plus aria-hidden="true" /> Add playtest
        </button>
      </div>
      <div className="playtest-admin-day-timeline-scroll" ref={scrollRef}>
        <div
          className="playtest-admin-day-timeline"
          style={{ height: `${24 * DAY_HOUR_HEIGHT}px` }}
        >
          {Array.from({ length: 24 }, (_, hour) => (
            <div
              className="playtest-admin-hour-line"
              style={{ top: `${hour * DAY_HOUR_HEIGHT}px` }}
              key={hour}
            >
              <span>{formatHour(hour)}</span>
            </div>
          ))}
          {isToday && (
            <div
              className="playtest-admin-now-line"
              style={{ top: `${(nowMinutes / 60) * DAY_HOUR_HEIGHT}px` }}
              aria-label="Current time"
            >
              <i />
            </div>
          )}
          <div className="playtest-admin-day-event-layer">
            {laidOutSessions.map(({ session, startMinutes, endMinutes, column, columns }) => {
              const seats = sessionSeatSummary(session);
              const completed = new Date(session.endsAt).getTime() < Date.now();
              const top = (startMinutes / 60) * DAY_HOUR_HEIGHT;
              const height = Math.max(44, ((endMinutes - startMinutes) / 60) * DAY_HOUR_HEIGHT);
              return (
                <button
                  className={`playtest-admin-timeline-event${session.isActive ? " published" : " hidden"}${completed ? " completed" : ""}`}
                  type="button"
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    left: `calc(${(column / columns) * 100}% + 0.25rem)`,
                    width: `calc(${100 / columns}% - 0.5rem)`,
                  }}
                  onClick={() => onOpenSession(session.id)}
                  key={session.id}
                >
                  <span>
                    <span>
                      {formatSessionTime(session.startsAt, session.timezone)}–
                      {formatSessionTime(session.endsAt, session.timezone)}
                    </span>
                    <CalendarEventStatus session={session} completed={completed} />
                  </span>
                  <strong>{session.venueName}</strong>
                  <small>
                    {session.city} ·{" "}
                    {seats.capacity ? `${seats.reserved}/${seats.capacity} seats` : "No tables"}
                  </small>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarDayHeader({
  day,
  isToday,
  onAddDate,
}: {
  day: Date;
  isToday: boolean;
  onAddDate: () => void;
}) {
  return (
    <header>
      <span>{day.getDate()}</span>
      {isToday && <strong>Today</strong>}
      <button
        type="button"
        onClick={onAddDate}
        aria-label={`Add playtest on ${new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(day)}`}
      >
        <Plus aria-hidden="true" />
      </button>
    </header>
  );
}

function CalendarEventButton({
  session,
  onClick,
  showEndTime = false,
}: {
  session: AdminPlaytestSession;
  onClick: () => void;
  showEndTime?: boolean;
}) {
  const seats = sessionSeatSummary(session);
  const completed = new Date(session.endsAt).getTime() < Date.now();
  return (
    <button
      className={`playtest-admin-calendar-event${session.isActive ? " published" : " hidden"}${completed ? " completed" : ""}`}
      type="button"
      onClick={onClick}
    >
      <span className="playtest-admin-event-time">
        <span>
          {formatSessionTime(session.startsAt, session.timezone)}
          {showEndTime && `–${formatSessionTime(session.endsAt, session.timezone)}`}
        </span>
        <CalendarEventStatus session={session} completed={completed} />
      </span>
      <strong>{session.venueName}</strong>
      <small>{session.city}</small>
      <span className="playtest-admin-event-seats">
        <i>
          <b style={{ width: `${seats.percent}%` }} />
        </i>
        {seats.capacity > 0 ? `${seats.reserved}/${seats.capacity} seats` : "No tables"}
      </span>
    </button>
  );
}

function CalendarEventStatus({
  session,
  completed,
}: {
  session: AdminPlaytestSession;
  completed: boolean;
}) {
  const status = calendarEventStatus(session, completed);
  return (
    <span className="playtest-admin-calendar-event-status">
      <CalendarStatusIcon status={status} />
    </span>
  );
}

function CalendarStatusIcon({ status }: { status: CalendarEventStatusName }) {
  const label = calendarStatusLabel(status);
  return (
    <span
      className={`playtest-admin-calendar-status-icon ${status}`}
      aria-label={label}
      title={label}
    >
      {status === "published" ? (
        <Eye aria-hidden="true" />
      ) : status === "hidden" ? (
        <EyeOff aria-hidden="true" />
      ) : status === "complete" ? (
        <Check aria-hidden="true" />
      ) : (
        <X aria-hidden="true" />
      )}
    </span>
  );
}

function SessionDetail({
  session,
  busy,
  onClose,
  onEdit,
  onAddTable,
  onEditTable,
  onToggleSession,
  onToggleTable,
  onCancelReservation,
}: {
  session: AdminPlaytestSession;
  busy: boolean;
  onClose: () => void;
  onEdit: () => void;
  onAddTable: () => void;
  onEditTable: (table: AdminPlaytestTable) => void;
  onToggleSession: () => void;
  onToggleTable: (table: AdminPlaytestTable) => void;
  onCancelReservation: (reservation: AdminReservation) => void;
}) {
  const date = formatAdminDate(session.startsAt, session.endsAt, session.timezone);
  return (
    <div
      className="playtest-admin-modal-backdrop detail"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        className="playtest-admin-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="playtest-detail-title"
      >
        <header>
          <div>
            <p className="playtest-admin-eyebrow">Playtest details</p>
            <h2 id="playtest-detail-title">
              {date.weekday}, {date.fullDate}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close details">
            <X aria-hidden="true" />
          </button>
        </header>
        <div className="playtest-admin-detail-body">
          <SessionCard
            session={session}
            busy={busy}
            onEdit={onEdit}
            onAddTable={onAddTable}
            onEditTable={onEditTable}
            onToggleSession={onToggleSession}
            onToggleTable={onToggleTable}
            onCancelReservation={onCancelReservation}
          />
        </div>
      </section>
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
  const status = calendarEventStatus(session, new Date(session.endsAt).getTime() < Date.now());

  return (
    <article className={`playtest-admin-session-card ${session.isActive ? "" : "is-hidden"}`}>
      <header>
        <div className="playtest-admin-date-tile">
          <strong>{date.day}</strong>
          <span>{date.month}</span>
        </div>
        <div className="playtest-admin-session-title">
          <div>
            <span className={`playtest-admin-status ${status}`}>
              <CalendarStatusIcon status={status} />
              {calendarStatusLabel(status)}
            </span>
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
          {session.addressLine}, {session.city}, {session.region} {session.postalCode}
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
  initialDate,
  busy,
  onClose,
  onSave,
}: {
  session?: AdminPlaytestSession;
  initialDate?: string;
  busy: boolean;
  onClose: () => void;
  onSave: (draft: SessionDraft) => Promise<void>;
}) {
  const [draft, setDraft] = useState(() => sessionFormDraft(session, initialDate));
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const startsAt = new Date(`${draft.date}T${draft.startsAtTime}`);
    const endsAt = new Date(`${draft.date}T${draft.endsAtTime}`);
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
        postalCode: draft.postalCode,
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
          <label>
            Playtest date{" "}
            <input
              type="date"
              value={draft.date}
              onChange={(event) => setDraft({ ...draft, date: event.target.value })}
              required
            />
          </label>
          <div className="playtest-admin-form-grid two">
            <label>
              Start time{" "}
              <input
                type="time"
                value={draft.startsAtTime}
                onChange={(event) => setDraft({ ...draft, startsAtTime: event.target.value })}
                step={900}
                required
              />
            </label>
            <label>
              End time{" "}
              <input
                type="time"
                value={draft.endsAtTime}
                onChange={(event) => setDraft({ ...draft, endsAtTime: event.target.value })}
                step={900}
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
            <label>
              ZIP code{" "}
              <input
                value={draft.postalCode}
                onChange={(event) =>
                  setDraft({ ...draft, postalCode: event.target.value.replace(/[^0-9-]/g, "") })
                }
                placeholder="84601"
                inputMode="numeric"
                pattern="[0-9]{5}(-[0-9]{4})?"
                maxLength={10}
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

function sessionFormDraft(session?: AdminPlaytestSession, initialDate?: string) {
  if (session) {
    const start = toLocalInput(session.startsAt);
    const end = toLocalInput(session.endsAt);
    return {
      date: start.slice(0, 10),
      startsAtTime: start.slice(11, 16),
      endsAtTime: end.slice(11, 16),
      venueName: session.venueName,
      addressLine: session.addressLine,
      city: session.city,
      region: session.region,
      postalCode: session.postalCode,
      notes: session.notes,
      isActive: session.isActive,
    };
  }
  const start = initialDate ? dateAtSix(initialDate) : nextSaturdayAtSix();
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const startLocal = toLocalInput(start.toISOString());
  const endLocal = toLocalInput(end.toISOString());
  return {
    date: startLocal.slice(0, 10),
    startsAtTime: startLocal.slice(11, 16),
    endsAtTime: endLocal.slice(11, 16),
    venueName: "",
    addressLine: "",
    city: "",
    region: "UT",
    postalCode: "",
    notes: "Prototype and everything needed to play are provided.",
    isActive: true,
  };
}

function dateAtSix(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 18, 0, 0, 0);
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
    postalCode: session.postalCode,
    notes: session.notes,
    isActive,
  };
}

function tableToDraft(table: AdminPlaytestTable, isActive = table.isActive): TableDraft {
  return { label: table.label, capacity: table.capacity, sortOrder: table.sortOrder, isActive };
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_HOUR_HEIGHT = 72;

function calendarTitle(value: Date, view: CalendarView) {
  if (view === "month") {
    return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(value);
  }
  if (view === "day") {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(value);
  }

  const [start, , , , , , end] = weekDays(value);
  const startMonth = new Intl.DateTimeFormat("en-US", { month: "short" }).format(start);
  const endMonth = new Intl.DateTimeFormat("en-US", { month: "short" }).format(end);
  if (start.getFullYear() !== end.getFullYear()) {
    return `${startMonth} ${start.getDate()}, ${start.getFullYear()}–${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
  }
  if (start.getMonth() === end.getMonth()) {
    return `${startMonth} ${start.getDate()}–${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${startMonth} ${start.getDate()}–${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
}

function formatDayLabel(day: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(day);
}

function formatHour(hour: number) {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return `${hour > 12 ? hour - 12 : hour} ${hour > 11 ? "PM" : "AM"}`;
}

function layoutDaySessions(sessions: AdminPlaytestSession[]) {
  const sorted = sessions
    .map((session) => {
      const startMinutes = zonedMinutes(session.startsAt, session.timezone);
      const rawEndMinutes = zonedMinutes(session.endsAt, session.timezone);
      return {
        session,
        startMinutes,
        endMinutes: rawEndMinutes > startMinutes ? rawEndMinutes : 24 * 60,
      };
    })
    .sort((left, right) => left.startMinutes - right.startMinutes);
  const result: Array<
    (typeof sorted)[number] & {
      column: number;
      columns: number;
    }
  > = [];
  let cluster: typeof sorted = [];
  let clusterEnd = -1;

  function flushCluster() {
    if (!cluster.length) return;
    const columnEnds: number[] = [];
    const assigned = cluster.map((item) => {
      let column = columnEnds.findIndex((endMinutes) => endMinutes <= item.startMinutes);
      if (column < 0) column = columnEnds.length;
      columnEnds[column] = item.endMinutes;
      return { ...item, column };
    });
    const columns = Math.max(1, columnEnds.length);
    result.push(...assigned.map((item) => ({ ...item, columns })));
    cluster = [];
    clusterEnd = -1;
  }

  for (const item of sorted) {
    if (cluster.length && item.startMinutes >= clusterEnd) flushCluster();
    cluster.push(item);
    clusterEnd = Math.max(clusterEnd, item.endMinutes);
  }
  flushCluster();
  return result;
}

function zonedMinutes(value: string, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));
  const part = (type: "hour" | "minute") =>
    Number(parts.find((candidate) => candidate.type === type)?.value ?? 0);
  return part("hour") * 60 + part("minute");
}

function startOfMonth(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), 1);
}

function isSameMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

function addDays(value: Date, amount: number) {
  const result = new Date(value);
  result.setDate(result.getDate() + amount);
  return result;
}

function addMonths(value: Date, amount: number) {
  return new Date(value.getFullYear(), value.getMonth() + amount, 1);
}

function calendarDays(month: Date) {
  const first = startOfMonth(month);
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

function weekDays(value: Date) {
  const start = addDays(value, -value.getDay());
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

function localDateKey(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sessionDateKey(session: AdminPlaytestSession) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: session.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(session.startsAt));
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function formatSessionTime(startsAt: string, timezone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(startsAt));
}

function sessionSeatSummary(session: AdminPlaytestSession) {
  const activeTables = session.tables.filter((table) => table.isActive);
  const capacity = activeTables.reduce((sum, table) => sum + table.capacity, 0);
  const reserved = activeTables.reduce((sum, table) => sum + table.seatsReserved, 0);
  return {
    capacity,
    reserved,
    percent: capacity > 0 ? Math.min(100, (reserved / capacity) * 100) : 0,
  };
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

function calendarEventStatus(
  session: AdminPlaytestSession,
  completed = new Date(session.endsAt).getTime() < Date.now(),
): CalendarEventStatusName {
  if (!completed) return session.isActive ? "published" : "hidden";

  const reservedSeats = session.tables.reduce((total, table) => total + table.seatsReserved, 0);
  return reservedSeats > 0 ? "complete" : "missed";
}

function calendarStatusLabel(status: CalendarEventStatusName) {
  return {
    published: "Published",
    hidden: "Hidden",
    complete: "Complete",
    missed: "Missed",
  }[status];
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
