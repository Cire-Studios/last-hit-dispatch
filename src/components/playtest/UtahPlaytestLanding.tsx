import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Gamepad2,
  LoaderCircle,
  Mail,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type MutableRefObject,
  type ReactNode,
} from "react";

import { BestiaryFooter, BestiaryHeader } from "@/components/bestiary/BestiaryPages";
import { TURNSTILE_SITE_KEY } from "@/config/public";
import { trackMetaPixelEvent } from "@/lib/meta-pixel";
import type {
  PlaytestReservationResponse,
  PlaytestSession,
  PlaytestSessionsResponse,
  PlaytestTable,
} from "@/lib/playtest";
import "./utah-playtest.css";

type ReservationStatus = "idle" | "loading" | "success" | "error";

export function UtahPlaytestLanding() {
  const [schedule, setSchedule] = useState<PlaytestSessionsResponse>({
    sessions: [],
    mode: "live",
  });
  const [scheduleStatus, setScheduleStatus] = useState<"loading" | "ready" | "error">("loading");
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedTableId, setSelectedTableId] = useState("");
  const [seats, setSeats] = useState(1);

  const loadSchedule = async (silent = false) => {
    if (!silent) setScheduleStatus("loading");
    try {
      const response = await fetch("/api/public/playtest-sessions");
      if (!response.ok) throw new Error("Schedule unavailable");
      const nextSchedule = (await response.json()) as PlaytestSessionsResponse;
      setSchedule(nextSchedule);
      setSelectedSessionId((current) =>
        nextSchedule.sessions.some((session) => session.id === current)
          ? current
          : (nextSchedule.sessions[0]?.id ?? ""),
      );
      setScheduleStatus("ready");
    } catch {
      setScheduleStatus("error");
    }
  };

  useEffect(() => {
    void loadSchedule();
  }, []);

  const selectedSession = schedule.sessions.find((session) => session.id === selectedSessionId);
  const selectedTable = selectedSession?.tables.find((table) => table.id === selectedTableId);

  const chooseSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setSelectedTableId("");
    setSeats(1);
  };

  const chooseTable = (table: PlaytestTable) => {
    if (table.status === "full") return;
    setSelectedTableId(table.id);
    setSeats((current) => Math.min(current, table.seatsRemaining, 4));
    window.setTimeout(() => {
      document
        .getElementById("reservation-details")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  return (
    <main className="site-shell playtest-site">
      <BestiaryHeader />
      <PlaytestHero />
      <TrustStrip />
      <section className="playtest-booking" id="reserve" aria-labelledby="schedule-title">
        <div className="playtest-section-heading">
          <p className="eyebrow">Choose your hunt</p>
          <h2 id="schedule-title">Pick a day. Claim your place.</h2>
          <p>
            Each table is a complete playtest group. Choose the time and table that work for you.
          </p>
        </div>

        {scheduleStatus === "loading" && <ScheduleLoading />}
        {scheduleStatus === "error" && (
          <ScheduleMessage
            title="The schedule wandered off."
            copy="Try loading the available playtests again."
            action={<button onClick={() => void loadSchedule()}>Reload schedule</button>}
          />
        )}
        {scheduleStatus === "ready" && schedule.sessions.length === 0 && (
          <ScheduleMessage
            title="The next tables are being set."
            copy="New Utah playtest dates will appear here as soon as they are ready."
            action={<a href="/#playtest">Join the playtest list</a>}
          />
        )}

        {scheduleStatus === "ready" && schedule.sessions.length > 0 && (
          <div className="playtest-booking-shell">
            {schedule.mode === "demo" && (
              <p className="playtest-demo-note">
                Preview mode · these sample reservations are not saved or emailed.
              </p>
            )}
            <div className="playtest-date-rail" role="tablist" aria-label="Playtest dates">
              {schedule.sessions.map((session) => {
                const date = formatDateCard(session);
                const active = session.id === selectedSessionId;
                const openSeats = session.tables.reduce(
                  (sum, table) => sum + table.seatsRemaining,
                  0,
                );
                return (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className="playtest-date-ticket"
                    data-active={active}
                    onClick={() => chooseSession(session.id)}
                    key={session.id}
                  >
                    <span>{date.weekday}</span>
                    <strong>{date.day}</strong>
                    <small>{date.month}</small>
                    <em>{openSeats === 0 ? "No seats" : `${openSeats} open`}</em>
                  </button>
                );
              })}
            </div>

            {selectedSession && (
              <div className="playtest-session-panel" role="tabpanel">
                <SessionHeading session={selectedSession} />
                {selectedSession.tables.length === 0 ? (
                  <div className="playtest-no-tables">
                    <Sparkles aria-hidden="true" />
                    <h3>Tables coming soon</h3>
                    <p>This date is planned. Seats will open when the table lineup is confirmed.</p>
                  </div>
                ) : (
                  <div className="playtest-table-grid">
                    {selectedSession.tables.map((table) => (
                      <TableCard
                        table={table}
                        selected={table.id === selectedTableId}
                        selectedSeats={table.id === selectedTableId ? seats : 0}
                        onChoose={() => chooseTable(table)}
                        key={table.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedSession && selectedTable && (
              <ReservationForm
                session={selectedSession}
                table={selectedTable}
                seats={seats}
                mode={schedule.mode}
                onSeatsChange={setSeats}
                onReserved={() => void loadSchedule(true)}
              />
            )}
          </div>
        )}
      </section>
      <HowItWorks />
      <PlaytestFaq />
      <BestiaryFooter />
    </main>
  );
}

function PlaytestHero() {
  return (
    <section className="playtest-hero" aria-labelledby="playtest-hero-title">
      <img src="/last-hit/guild-hall.webp" alt="" fetchPriority="high" />
      <div className="playtest-hero-shade" />
      <div className="playtest-hero-content">
        <p className="eyebrow">Utah hunters wanted</p>
        <h1 id="playtest-hero-title">
          Your seat at the table
          <span>is waiting.</span>
        </h1>
        <p>
          Play a not-yet-released monster-hunting board game, meet a table of fellow players, and
          help shape what Last Hit becomes.
        </p>
        <div className="playtest-hero-actions">
          <a className="button button-gold" href="#reserve">
            See available tables <ArrowRight aria-hidden="true" />
          </a>
          <span>
            <MapPin aria-hidden="true" /> Utah County, Utah
          </span>
        </div>
      </div>
      <div className="playtest-hero-game" aria-hidden="true">
        <div />
        <img src="/last-hit/game-box.webp" alt="" />
        <img src="/last-hit/current/attack-die-v2.webp" alt="" />
        <img src="/last-hit/components/pieces/pawn-red.webp" alt="" />
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="playtest-trust" aria-label="Playtest details">
      <div>
        <Clock3 aria-hidden="true" />
        <span>
          <strong>About 2 hours</strong>
          <small>Rules and play included</small>
        </span>
      </div>
      <div>
        <Users aria-hidden="true" />
        <span>
          <strong>Up to 6 hunters</strong>
          <small>Come solo or bring friends</small>
        </span>
      </div>
      <div>
        <Gamepad2 aria-hidden="true" />
        <span>
          <strong>Everything provided</strong>
          <small>Just bring your curiosity</small>
        </span>
      </div>
      <div>
        <ShieldCheck aria-hidden="true" />
        <span>
          <strong>Free reservation</strong>
          <small>Email confirmation required</small>
        </span>
      </div>
    </section>
  );
}

function SessionHeading({ session }: { session: PlaytestSession }) {
  const date = formatFullDate(session);
  return (
    <header className="playtest-session-heading">
      <div>
        <span>
          <CalendarDays aria-hidden="true" /> {date.date}
        </span>
        <h3>{date.time}</h3>
      </div>
      <p>
        <MapPin aria-hidden="true" /> {session.venueName} · {session.city}, {session.region}
      </p>
    </header>
  );
}

function TableCard({
  table,
  selected,
  selectedSeats,
  onChoose,
}: {
  table: PlaytestTable;
  selected: boolean;
  selectedSeats: number;
  onChoose: () => void;
}) {
  const availableSeatIndexes = Array.from({ length: table.capacity }, (_, index) => index).filter(
    (index) => index >= table.seatsReserved,
  );
  return (
    <button
      type="button"
      className="playtest-table-card"
      data-selected={selected}
      data-full={table.status === "full"}
      onClick={onChoose}
      disabled={table.status === "full"}
      aria-label={`${table.label}, ${table.seatsRemaining} seats remaining`}
    >
      <div className="playtest-seat-map" aria-hidden="true">
        <div className="playtest-board-mini">
          <img src="/last-hit/current/board.webp" alt="" />
          <span>Last Hit</span>
        </div>
        {Array.from({ length: table.capacity }, (_, index) => {
          const occupied = index < table.seatsReserved;
          const selectedSeat =
            selected &&
            availableSeatIndexes.indexOf(index) >= 0 &&
            availableSeatIndexes.indexOf(index) < selectedSeats;
          return (
            <i
              className="playtest-seat"
              data-occupied={occupied}
              data-selected={selectedSeat}
              style={{ "--seat-index": index, "--seat-count": table.capacity } as CSSProperties}
              key={index}
            />
          );
        })}
      </div>
      <div className="playtest-table-meta">
        <span className={`playtest-availability ${table.status}`}>
          {table.status === "full"
            ? "Table full"
            : table.status === "limited"
              ? `Only ${table.seatsRemaining} left`
              : `${table.seatsRemaining} seats open`}
        </span>
        <h4>{table.label}</h4>
        <span className="playtest-table-action">
          {table.status === "full"
            ? "Choose another table"
            : selected
              ? "Selected"
              : "Choose this table"}
          {selected && <Check aria-hidden="true" />}
        </span>
      </div>
    </button>
  );
}

function ReservationForm({
  session,
  table,
  seats,
  mode,
  onSeatsChange,
  onReserved,
}: {
  session: PlaytestSession;
  table: PlaytestTable;
  seats: number;
  mode: PlaytestSessionsResponse["mode"];
  onSeatsChange: (seats: number) => void;
  onReserved: () => void;
}) {
  const nameId = useId();
  const emailId = useId();
  const responseId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<ReservationStatus>("idle");
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState<PlaytestReservationResponse | null>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const resetTurnstileRef = useRef<(() => void) | null>(null);
  const date = formatFullDate(session);

  useEffect(() => {
    setStatus("idle");
    setMessage("");
    setConfirmation(null);
    setTurnstileToken("");
    resetTurnstileRef.current?.();
  }, [table.id]);

  useEffect(() => {
    if (status === "success") confirmationRef.current?.focus();
  }, [status]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedToken = turnstileToken || String(formData.get("cf-turnstile-response") || "");
    if (mode !== "demo" && !submittedToken) {
      setStatus("error");
      setMessage("Complete the quick verification before claiming your seats.");
      return;
    }

    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/public/playtest-reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId: table.id,
          name,
          email,
          seats,
          marketingOptIn,
          website,
          turnstileToken: submittedToken,
          source: "/utah-playtest?utm_source=meta",
        }),
      });
      const payload = (await response.json().catch(() => null)) as
        | PlaytestReservationResponse
        | { error?: string; code?: string }
        | null;
      if (!response.ok || !payload || !("ok" in payload)) {
        const code = payload && "code" in payload ? payload.code : undefined;
        setStatus("error");
        setMessage(
          code === "table_full"
            ? "Those seats were just claimed. Choose another table or fewer seats."
            : code === "duplicate"
              ? "That email already has a reservation for this playtest."
              : code === "verification_failed"
                ? "The verification expired. Complete it again, then retry."
                : "We couldn’t hold those seats. Please try again in a moment.",
        );
        setTurnstileToken("");
        resetTurnstileRef.current?.();
        if (code === "table_full") onReserved();
        return;
      }

      setConfirmation(payload);
      setStatus("success");
      trackMetaPixelEvent("Schedule", { content_name: "Utah playtest", num_items: seats });
      onReserved();
    } catch {
      setStatus("error");
      setMessage("Check your connection and try claiming your seats again.");
      setTurnstileToken("");
      resetTurnstileRef.current?.();
    }
  };

  if (status === "success" && confirmation) {
    return (
      <div className="playtest-confirmation" ref={confirmationRef} tabIndex={-1} role="status">
        <span className="playtest-confirmation-mark">
          <Check aria-hidden="true" />
        </span>
        <p className="eyebrow">Reservation confirmed</p>
        <h2>Your place at the table is saved.</h2>
        <p>
          {mode === "demo"
            ? "This is the preview confirmation. No reservation was saved."
            : `We sent the details and reminders to ${email}.`}
        </p>
        <dl>
          <div>
            <dt>When</dt>
            <dd>
              {date.date} · {date.time}
            </dd>
          </div>
          <div>
            <dt>Table</dt>
            <dd>{table.label}</dd>
          </div>
          <div>
            <dt>Party</dt>
            <dd>
              {seats} {seats === 1 ? "seat" : "seats"}
            </dd>
          </div>
          <div>
            <dt>Code</dt>
            <dd>{confirmation.reservationCode}</dd>
          </div>
        </dl>
        <a className="button button-gold" href="/bestiary">
          Meet the monsters <ArrowRight aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <section
      className="playtest-reservation"
      id="reservation-details"
      aria-labelledby="reservation-title"
    >
      <div className="playtest-reservation-summary">
        <p className="eyebrow">Your selection</p>
        <h3>{date.date}</h3>
        <p>
          <Clock3 aria-hidden="true" /> {date.time}
        </p>
        <p>
          <Gamepad2 aria-hidden="true" /> {table.label}
        </p>
        <p>
          <MapPin aria-hidden="true" /> {session.venueName} · {session.city}, {session.region}
        </p>
        <div className="playtest-party-size">
          <span>Seats</span>
          <div>
            <button
              type="button"
              onClick={() => onSeatsChange(Math.max(1, seats - 1))}
              disabled={seats === 1}
              aria-label="Remove one seat"
            >
              <Minus />
            </button>
            <strong>{seats}</strong>
            <button
              type="button"
              onClick={() => onSeatsChange(Math.min(4, table.seatsRemaining, seats + 1))}
              disabled={seats >= Math.min(4, table.seatsRemaining)}
              aria-label="Add one seat"
            >
              <Plus />
            </button>
          </div>
        </div>
      </div>

      <form className="playtest-reservation-form" onSubmit={submit}>
        <header>
          <p className="eyebrow">Almost there</p>
          <h3 id="reservation-title">Who should we save the seats for?</h3>
          <p>We’ll use your email for confirmation, location details, and playtest reminders.</p>
        </header>
        <label htmlFor={nameId}>Your name</label>
        <div className="playtest-field">
          <Users aria-hidden="true" />
          <input
            id={nameId}
            name="name"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <label htmlFor={emailId}>Email address</label>
        <div className="playtest-field">
          <Mail aria-hidden="true" />
          <input
            id={emailId}
            name="email"
            type="email"
            required
            maxLength={255}
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-describedby={message ? responseId : undefined}
          />
        </div>
        <div className="playtest-honeypot" aria-hidden="true">
          <label htmlFor={`${emailId}-website`}>Website</label>
          <input
            id={`${emailId}-website`}
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>
        <label className="playtest-opt-in">
          <input
            type="checkbox"
            checked={marketingOptIn}
            onChange={(event) => setMarketingOptIn(event.target.checked)}
          />
          <span>
            Also send me future playtest invitations and Last Hit updates. I can unsubscribe
            anytime.
          </span>
        </label>
        {mode !== "demo" && (
          <PlaytestTurnstile onToken={setTurnstileToken} resetRef={resetTurnstileRef} />
        )}
        {message && (
          <p className="playtest-form-error" id={responseId} role="alert">
            {message}
          </p>
        )}
        <button
          className="button button-gold playtest-submit"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <LoaderCircle className="playtest-spinner" /> Holding your seats…
            </>
          ) : (
            <>
              Reserve {seats === 1 ? "my seat" : `${seats} seats`} <ArrowRight aria-hidden="true" />
            </>
          )}
        </button>
        <p className="playtest-form-trust">
          <ShieldCheck aria-hidden="true" /> Free to reserve. No account or payment needed.
        </p>
      </form>
    </section>
  );
}

function PlaytestTurnstile({
  onToken,
  resetRef,
}: {
  onToken: (token: string) => void;
  resetRef: MutableRefObject<(() => void) | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let widgetId = "";
    let cancelled = false;
    const render = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "dark",
        size: "flexible",
        callback: onToken,
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
      resetRef.current = () => widgetId && window.turnstile?.reset(widgetId);
    };
    if (window.turnstile) render();
    else {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[src*="challenges.cloudflare.com/turnstile"]',
      );
      const script = existing ?? document.createElement("script");
      script.addEventListener("load", render, { once: true });
      if (!existing) {
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }
    return () => {
      cancelled = true;
      resetRef.current = null;
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [onToken, resetRef]);
  return <div className="playtest-turnstile" ref={containerRef} />;
}

function ScheduleLoading() {
  return (
    <div className="playtest-schedule-loading" aria-label="Loading available playtests">
      <span />
      <span />
      <span />
    </div>
  );
}

function ScheduleMessage({
  title,
  copy,
  action,
}: {
  title: string;
  copy: string;
  action: ReactNode;
}) {
  return (
    <div className="playtest-schedule-message">
      <CalendarDays aria-hidden="true" />
      <h3>{title}</h3>
      <p>{copy}</p>
      {action}
    </div>
  );
}

function HowItWorks() {
  const steps = [
    ["01", "Choose your table", "See every open date and the seats left at each table."],
    ["02", "Claim your seats", "Reserve for yourself or bring up to three friends."],
    ["03", "Join the hunt", "Arrive, learn as you play, and tell us what you think."],
  ];
  return (
    <section className="playtest-how">
      <div className="playtest-section-heading">
        <p className="eyebrow">From ad to adventure</p>
        <h2>Three steps to the table.</h2>
      </div>
      <div>
        {steps.map(([number, title, copy]) => (
          <article key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PlaytestFaq() {
  const questions = [
    [
      "Do I need to know the rules?",
      "No. We’ll teach the game at the table, and new board gamers are welcome.",
    ],
    [
      "Can I bring friends?",
      "Yes. You can reserve up to four seats at once, as long as the table has room.",
    ],
    [
      "Does it cost anything?",
      "No. Playtests are free, and the prototype and all game pieces are provided.",
    ],
    [
      "What if I need to cancel?",
      "Reply to your confirmation email. We’ll release the seats so another hunter can join.",
    ],
  ];
  return (
    <section className="playtest-faq" aria-labelledby="faq-title">
      <div>
        <p className="eyebrow">Before you reserve</p>
        <h2 id="faq-title">Good to know.</h2>
      </div>
      <div>
        {questions.map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <ChevronDown aria-hidden="true" />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function formatDateCard(session: PlaytestSession) {
  const date = new Date(session.startsAt);
  return {
    weekday: new Intl.DateTimeFormat("en-US", {
      timeZone: session.timezone,
      weekday: "short",
    }).format(date),
    day: new Intl.DateTimeFormat("en-US", { timeZone: session.timezone, day: "numeric" }).format(
      date,
    ),
    month: new Intl.DateTimeFormat("en-US", { timeZone: session.timezone, month: "short" }).format(
      date,
    ),
  };
}

function formatFullDate(session: PlaytestSession) {
  const start = new Date(session.startsAt);
  const end = new Date(session.endsAt);
  return {
    date: new Intl.DateTimeFormat("en-US", {
      timeZone: session.timezone,
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(start),
    time: `${new Intl.DateTimeFormat("en-US", { timeZone: session.timezone, hour: "numeric", minute: "2-digit" }).format(start)}–${new Intl.DateTimeFormat("en-US", { timeZone: session.timezone, hour: "numeric", minute: "2-digit" }).format(end)}`,
  };
}
