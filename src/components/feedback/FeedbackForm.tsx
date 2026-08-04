import { Check, Mail, MessageSquareText, RotateCcw, Send } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import { TURNSTILE_SITE_KEY } from "@/config/public";

const categories = [
  ["rules", "Rules"],
  ["balance", "Balance"],
  ["pacing", "Pacing"],
  ["components", "Components"],
  ["overall", "Overall experience"],
  ["other", "Other"],
] as const;

type FeedbackCategory = (typeof categories)[number][0];

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme: "dark";
      size: "flexible";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function FeedbackForm() {
  const categoryId = useId();
  const emailId = useId();
  const messageId = useId();
  const formMessageId = useId();
  const confirmationRef = useRef<HTMLDivElement>(null);
  const turnstileResetRef = useRef<(() => void) | null>(null);
  const [category, setCategory] = useState<FeedbackCategory | "">("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    if (status === "success") confirmationRef.current?.focus();
  }, [status]);

  const clearError = () => {
    if (status !== "error") return;
    setStatus("idle");
    setFormMessage("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedTurnstileToken =
      turnstileToken || String(formData.get("cf-turnstile-response") || "");

    if (!category || rating === 0) {
      setStatus("error");
      setFormMessage("Choose a category and an overall rating before sending your feedback.");
      return;
    }

    if (!submittedTurnstileToken) {
      setStatus("error");
      setFormMessage("Complete the quick verification before sending your feedback.");
      return;
    }

    setStatus("loading");
    setFormMessage("");

    try {
      const response = await fetch("/api/public/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          rating,
          message,
          email,
          website,
          turnstileToken: submittedTurnstileToken,
          source: "/feedback",
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { code?: string } | null;
        setStatus("error");
        setFormMessage(
          payload?.code === "verification_failed"
            ? "The verification expired. Complete it again, then resend your feedback."
            : "Your feedback didn’t make it through. Please try again in a moment.",
        );
        setTurnstileToken("");
        turnstileResetRef.current?.();
        return;
      }

      setStatus("success");
      setFormMessage(
        email.trim()
          ? "Thanks for helping shape Last Hit. We may reach out if we have a follow-up question."
          : "Thanks for helping shape Last Hit.",
      );
    } catch {
      setStatus("error");
      setFormMessage("Check your connection and try sending your feedback again.");
      setTurnstileToken("");
      turnstileResetRef.current?.();
    }
  };

  if (status === "success") {
    return (
      <div className="feedback-confirmation" ref={confirmationRef} tabIndex={-1} role="status">
        <span aria-hidden="true">
          <Check />
        </span>
        <p className="eyebrow">Feedback received</p>
        <h2>Your report reached the Guild.</h2>
        <p>{formMessage}</p>
        <button
          className="button button-gold"
          type="button"
          onClick={() => {
            setCategory("");
            setRating(0);
            setMessage("");
            setEmail("");
            setWebsite("");
            setTurnstileToken("");
            setFormMessage("");
            setStatus("idle");
          }}
        >
          Send more feedback <RotateCcw aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <form className="feedback-form" onSubmit={submit}>
      <div className="feedback-field">
        <label htmlFor={categoryId}>What is this about?</label>
        <select
          id={categoryId}
          name="category"
          required
          value={category}
          onChange={(event) => {
            setCategory(event.target.value as FeedbackCategory);
            clearError();
          }}
        >
          <option value="">Choose a category</option>
          {categories.map(([value, label]) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="feedback-rating">
        <legend>How was your overall experience?</legend>
        <div>
          {[1, 2, 3, 4, 5].map((value) => (
            <label data-selected={rating === value} key={value}>
              <input
                type="radio"
                name="rating"
                value={value}
                checked={rating === value}
                required
                onChange={() => {
                  setRating(value);
                  clearError();
                }}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>
        <p aria-hidden="true">
          <span>Needs work</span>
          <span>Excellent</span>
        </p>
      </fieldset>

      <div className="feedback-field">
        <label htmlFor={messageId}>Tell us what happened</label>
        <p>What worked, what felt unclear, or what would you change?</p>
        <div className="feedback-textarea-wrap">
          <MessageSquareText aria-hidden="true" />
          <textarea
            id={messageId}
            name="message"
            required
            minLength={20}
            maxLength={2000}
            rows={7}
            placeholder="Share the moments that stood out…"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              clearError();
            }}
          />
        </div>
        <small>{message.length.toLocaleString()} / 2,000</small>
      </div>

      <div className="feedback-field">
        <label htmlFor={emailId}>
          Email address <span>Optional</span>
        </label>
        <p>Leave this blank to send without contact details.</p>
        <div className="signup-input-wrap feedback-email-wrap">
          <Mail aria-hidden="true" />
          <input
            id={emailId}
            type="email"
            name="email"
            autoComplete="email"
            maxLength={255}
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearError();
            }}
          />
        </div>
      </div>

      <div className="feedback-honeypot" aria-hidden="true">
        <label htmlFor={`${emailId}-website`}>Website</label>
        <input
          id={`${emailId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <TurnstileVerification
        onTokenChange={(token) => {
          setTurnstileToken(token);
        }}
        registerReset={(reset) => {
          turnstileResetRef.current = reset;
        }}
      />

      {formMessage && (
        <p className="feedback-form-error" id={formMessageId} role="alert">
          {formMessage}
        </p>
      )}

      <button
        className="button button-gold feedback-submit"
        type="submit"
        disabled={status === "loading"}
        aria-describedby={formMessage ? formMessageId : undefined}
      >
        {status === "loading" ? "Sending feedback…" : "Send feedback"}
        {status !== "loading" && <Send aria-hidden="true" />}
      </button>
      <p className="feedback-privacy">
        Your feedback goes directly to the Last Hit team and is not posted publicly.
      </p>
    </form>
  );
}

function TurnstileVerification({
  onTokenChange,
  registerReset,
}: {
  onTokenChange: (token: string) => void;
  registerReset: (reset: () => void) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const registerResetRef = useRef(registerReset);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
    registerResetRef.current = registerReset;
  }, [onTokenChange, registerReset]);

  useEffect(() => {
    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "dark",
        size: "flexible",
        callback: (token) => onTokenChangeRef.current(token),
        "expired-callback": () => onTokenChangeRef.current(""),
        "error-callback": () => {
          onTokenChangeRef.current("");
          setLoadError(true);
        },
      });
      registerResetRef.current(() => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      });
    };

    const existingScript = document.querySelector<HTMLScriptElement>("#turnstile-script");
    const script = existingScript ?? document.createElement("script");
    script.addEventListener("load", renderWidget);

    if (!existingScript) {
      script.id = "turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else if (window.turnstile) {
      renderWidget();
    }

    return () => {
      script.removeEventListener("load", renderWidget);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  return (
    <div className="feedback-verification">
      <div ref={containerRef} />
      {loadError && <p role="alert">Verification couldn’t load. Refresh the page and try again.</p>}
      {!loadError && <small>This quick check helps keep the feedback inbox useful.</small>}
    </div>
  );
}
