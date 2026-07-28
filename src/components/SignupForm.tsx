import { Check, Mail } from "lucide-react";
import { useId, useState, type FormEvent } from "react";

export type SignupInterest = "updates" | "playtest";

interface SignupFormProps {
  interests: SignupInterest[];
  source: string;
  buttonLabel: string;
  stacked?: boolean;
}

export function SignupForm({ interests, source, buttonLabel, stacked = false }: SignupFormProps) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/public/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interests, source }),
      });

      if (!response.ok) {
        setStatus("error");
        setMessage("We couldn’t add you just yet. Please try again in a moment.");
        return;
      }

      setStatus("success");
      setEmail("");
      setMessage(
        interests.includes("playtest")
          ? "Your name is on the playtest list. We’ll send word when a seat opens."
          : "You’re on the list. We’ll send word when the next contract is ready.",
      );
    } catch {
      setStatus("error");
      setMessage("The message didn’t make it through. Check your connection and try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="signup-success" role="status">
        <Check size={19} />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form className={`signup-form ${stacked ? "signup-form-stacked" : ""}`} onSubmit={submit}>
      <label className="sr-only" htmlFor={inputId}>
        Email address
      </label>
      <div className="signup-input-wrap">
        <Mail size={17} aria-hidden="true" />
        <input
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          required
          maxLength={255}
          placeholder="Your email address"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "error") {
              setStatus("idle");
              setMessage("");
            }
          }}
          aria-describedby={message ? `${inputId}-message` : undefined}
        />
      </div>
      <button className="button button-gold" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Setting your mark…" : buttonLabel}
        {status !== "loading" && <ArrowMark />}
      </button>
      <p className="signup-trust">Only meaningful updates. Leave the list whenever you like.</p>
      {message && (
        <p id={`${inputId}-message`} className="signup-error" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}

function ArrowMark() {
  return <span aria-hidden="true">→</span>;
}
