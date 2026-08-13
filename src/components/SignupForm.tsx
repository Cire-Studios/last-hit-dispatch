import { Check, FlaskConical, Mail, Megaphone } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCookieConsent } from "@/components/cookie-consent-context";
import {
  SignupContext,
  type OpenSignupOptions,
  type SignupInterest,
} from "@/components/signup-context";

export function SignupProvider({ children }: { children: ReactNode }) {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    source: string;
    preset: SignupInterest;
  }>({ open: false, source: "unknown", preset: "updates" });

  const openSignup = useCallback(({ source, preset = "updates" }: OpenSignupOptions) => {
    setDialogState({ open: true, source, preset });
  }, []);

  return (
    <SignupContext.Provider value={{ openSignup }}>
      {children}
      <SignupDialog
        open={dialogState.open}
        source={dialogState.source}
        preset={dialogState.preset}
        onOpenChange={(open) => setDialogState((current) => ({ ...current, open }))}
      />
    </SignupContext.Provider>
  );
}

interface SignupDialogProps {
  open: boolean;
  source: string;
  preset: SignupInterest;
  onOpenChange: (open: boolean) => void;
}

type SubscriptionType = "announcements" | "playtesting" | "both";

const choices: Array<{
  interest: SignupInterest;
  title: string;
  description: string;
  icon: typeof Megaphone;
}> = [
  {
    interest: "updates",
    title: "Announcements",
    description: "Launch news, new artwork, and major milestones.",
    icon: Megaphone,
  },
  {
    interest: "playtest",
    title: "Playtesting",
    description: "Invitations to play and opportunities to share feedback.",
    icon: FlaskConical,
  },
];

function SignupDialog({ open, source, preset, onOpenChange }: SignupDialogProps) {
  const { consent: metaPixelConsent } = useCookieConsent();
  const emailId = useId();
  const selectionErrorId = useId();
  const responseMessageId = useId();
  const submissionIdRef = useRef(0);
  const trackedLeadSubmissionIdRef = useRef<number | null>(null);
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<SignupInterest[]>([preset]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    setEmail("");
    setInterests([preset]);
    setStatus("idle");
    setMessage("");
  }, [open, preset]);

  const toggleInterest = (interest: SignupInterest) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((currentInterest) => currentInterest !== interest)
        : [...current, interest],
    );
    if (status === "error") {
      setStatus("idle");
      setMessage("");
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (interests.length === 0) {
      setStatus("error");
      setMessage("Choose at least one kind of news.");
      return;
    }

    const submissionId = ++submissionIdRef.current;
    const submittedInterests = [...interests];
    const subscriptionType = getSubscriptionType(submittedInterests);

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/public/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interests: submittedInterests, source }),
      });

      if (!response.ok) {
        setStatus("error");
        setMessage("We couldn’t add you just yet. Please try again in a moment.");
        return;
      }

      setStatus("success");
      setMessage(getSuccessMessage(submittedInterests));

      if (
        metaPixelConsent === "accepted" &&
        typeof window !== "undefined" &&
        typeof window.fbq === "function" &&
        trackedLeadSubmissionIdRef.current !== submissionId
      ) {
        trackedLeadSubmissionIdRef.current = submissionId;
        window.fbq("track", "Lead", {
          content_name: "Last Hit Follow Signup",
          subscription_type: subscriptionType,
        });

        if (submittedInterests.includes("playtest")) {
          window.fbq("trackCustom", "PlaytestingSignup", {
            content_name: "Last Hit Playtesting Signup",
          });
        }
      }
    } catch {
      setStatus("error");
      setMessage("The message didn’t make it through. Check your connection and try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="signup-dialog">
        {status === "success" ? (
          <div className="signup-confirmation" role="status">
            <span className="signup-confirmation-mark" aria-hidden="true">
              <Check />
            </span>
            <p className="eyebrow">Your mark is set</p>
            <DialogTitle>You’re in.</DialogTitle>
            <DialogDescription id={responseMessageId}>{message}</DialogDescription>
            <div className="signup-confirmation-tags" aria-label="Your selections">
              {choices
                .filter(({ interest }) => interests.includes(interest))
                .map(({ interest, title }) => (
                  <span key={interest}>
                    <Check aria-hidden="true" /> {title}
                  </span>
                ))}
            </div>
            <DialogClose asChild>
              <button className="button button-gold" type="button">
                Done
              </button>
            </DialogClose>
          </div>
        ) : (
          <>
            <div className="signup-dialog-heading">
              <p className="eyebrow">Stay in the hunt</p>
              <DialogTitle>Follow Last Hit</DialogTitle>
              <DialogDescription>
                Choose one or both, then tell us where to reach you.
              </DialogDescription>
            </div>

            <form className="signup-dialog-form" onSubmit={submit}>
              <fieldset
                className="signup-choices"
                aria-describedby={interests.length === 0 ? selectionErrorId : undefined}
              >
                <legend className="sr-only">Choose what you want to hear about</legend>
                {choices.map(({ interest, title, description, icon: Icon }) => {
                  const selected = interests.includes(interest);
                  return (
                    <label className="signup-choice" data-selected={selected} key={interest}>
                      <input
                        type="checkbox"
                        name="interests"
                        value={interest}
                        checked={selected}
                        onChange={() => toggleInterest(interest)}
                      />
                      <span className="signup-choice-check" aria-hidden="true">
                        {selected && <Check />}
                      </span>
                      <span className="signup-choice-icon" aria-hidden="true">
                        <Icon />
                      </span>
                      <span className="signup-choice-copy">
                        <strong>{title}</strong>
                        <small>{description}</small>
                      </span>
                    </label>
                  );
                })}
              </fieldset>

              <div className="signup-dialog-email">
                <label htmlFor={emailId}>Email address</label>
                <div className="signup-input-wrap">
                  <Mail aria-hidden="true" />
                  <input
                    id={emailId}
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    maxLength={255}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (status === "error") {
                        setStatus("idle");
                        setMessage("");
                      }
                    }}
                    aria-describedby={message ? responseMessageId : undefined}
                  />
                </div>
              </div>

              {message && (
                <p
                  id={interests.length === 0 ? selectionErrorId : responseMessageId}
                  className="signup-error"
                  role="alert"
                >
                  {message}
                </p>
              )}

              <button
                className="button button-gold signup-dialog-submit"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Joining…" : "Keep me posted"}
                {status !== "loading" && <span aria-hidden="true">→</span>}
              </button>
              <p className="signup-trust">
                Only the updates you choose. Leave either list whenever you like.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function getSubscriptionType(interests: SignupInterest[]): SubscriptionType {
  if (interests.length === 2) return "both";
  return interests.includes("playtest") ? "playtesting" : "announcements";
}

function getSuccessMessage(interests: SignupInterest[]) {
  if (interests.length === 2) {
    return "We’ll send announcements and playtesting invitations your way.";
  }
  return interests.includes("playtest")
    ? "We’ll let you know when playtesting opportunities open."
    : "We’ll send Last Hit announcements your way.";
}
