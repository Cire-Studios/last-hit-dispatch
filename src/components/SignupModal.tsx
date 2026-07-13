import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";

export type SignupInterest = "updates" | "playtest";

interface Props {
  open: boolean;
  onClose: () => void;
  source?: string;
  defaultInterests?: SignupInterest[];
}

const INTERESTS: { key: SignupInterest; label: string; blurb: string }[] = [
  {
    key: "updates",
    label: "Guild Dispatches",
    blurb: "Launch news, crowdfunding horn calls, and dev updates.",
  },
  {
    key: "playtest",
    label: "Playtest Contracts",
    blurb: "Remote and in-person sessions, print-and-play kits, credit in the rulebook.",
  },
];

export function SignupModal({ open, onClose, source, defaultInterests = ["updates"] }: Props) {
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<SignupInterest[]>(defaultInterests);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setInterests(defaultInterests);
      setStatus("idle");
      setErrorMsg(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const toggle = (key: SignupInterest) => {
    setInterests((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || interests.length === 0) return;
    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/public/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interests, source }),
      });
      if (!res.ok) {
        setStatus("error");
        setErrorMsg("The guild scribes couldn't ink your name. Try again shortly.");
        return;
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Network failed. Try again shortly.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/85 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-modal-title"
      onClick={onClose}
    >
      <div
        className="parchment-panel relative w-full max-w-md rounded-sm p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-sm p-1 text-ink/60 transition hover:bg-ink/10 hover:text-ink"
        >
          <X size={18} />
        </button>

        {status === "success" ? (
          <div className="text-center">
            <div className="wax-seal mx-auto mb-4 h-14 w-14 rounded-full" />
            <p
              id="signup-modal-title"
              className="text-display text-lg uppercase tracking-wider text-ink"
            >
              Your Mark is Set
            </p>
            <p className="mt-3 text-sm italic text-ink/70">
              The guild will send word by raven when the hunt begins.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="text-display mt-6 rounded-sm border border-ink/30 px-6 py-2 text-xs uppercase tracking-[0.3em] text-ink transition hover:bg-ink/10"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="text-display text-[0.65rem] uppercase tracking-[0.4em] text-ember">
              Enlistment Papers
            </p>
            <h2
              id="signup-modal-title"
              className="text-display mt-2 text-2xl uppercase tracking-wider text-ink sm:text-3xl"
            >
              Sign the Ledger
            </h2>
            <p className="mt-3 text-sm text-ink/70">
              Tell us where to send word. Tick every contract you want in on.
            </p>

            <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hunter@guild.hall"
                maxLength={255}
                className="w-full rounded-sm border border-ink/20 bg-background/60 px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember"
              />

              <fieldset className="flex flex-col gap-2">
                <legend className="text-display mb-1 text-[0.65rem] uppercase tracking-[0.3em] text-ink/60">
                  I'm in for
                </legend>
                {INTERESTS.map((opt) => {
                  const checked = interests.includes(opt.key);
                  return (
                    <label
                      key={opt.key}
                      className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3 transition ${
                        checked
                          ? "border-ember bg-ember/5"
                          : "border-ink/20 hover:border-ink/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(opt.key)}
                        className="mt-1 h-4 w-4 accent-ember"
                      />
                      <span className="flex-1">
                        <span className="text-display block text-sm uppercase tracking-wider text-ink">
                          {opt.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-ink/60">{opt.blurb}</span>
                      </span>
                    </label>
                  );
                })}
              </fieldset>

              {errorMsg && (
                <p className="text-xs italic text-destructive" role="alert">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading" || interests.length === 0}
                className="text-display mt-1 rounded-sm px-6 py-3 text-sm uppercase tracking-[0.3em] text-primary-foreground shadow-[var(--shadow-lantern)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: "var(--gradient-ember)" }}
              >
                {status === "loading" ? "Sending…" : "Sign the Ledger"}
              </button>

              <p className="text-center text-[0.65rem] italic text-ink/50">
                No spam. Unsubscribe in one click.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
