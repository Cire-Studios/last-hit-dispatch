import { useLocation } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import {
  CookieConsentContext,
  type CookieConsentChoice,
} from "@/components/cookie-consent-context";
import { disableMetaPixel, initializeMetaPixel, trackMetaPixelPageView } from "@/lib/meta-pixel";

export const COOKIE_CONSENT_STORAGE_KEY = "last_hit_meta_pixel_consent";

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const href = useLocation({ select: (location) => location.href });
  const rejectButtonRef = useRef<HTMLButtonElement>(null);
  const [consent, setConsent] = useState<CookieConsentChoice>(null);
  const [isReady, setIsReady] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [focusControls, setFocusControls] = useState(false);

  useEffect(() => {
    const storedConsent = readStoredConsent();
    setConsent(storedConsent);
    setControlsOpen(storedConsent === null);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (consent !== "accepted") return;
    initializeMetaPixel();
    trackMetaPixelPageView(href);
  }, [consent, href]);

  useEffect(() => {
    if (!controlsOpen || !focusControls) return;
    rejectButtonRef.current?.focus();
    setFocusControls(false);
  }, [controlsOpen, focusControls]);

  const openCookieSettings = useCallback(() => {
    setControlsOpen(true);
    setFocusControls(true);
  }, []);

  const saveChoice = (choice: Exclude<CookieConsentChoice, null>) => {
    const previousConsent = consent;
    try {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice);
    } catch {
      // The in-memory choice still applies for this visit if storage is unavailable.
    }

    setConsent(choice);
    setControlsOpen(false);

    if (choice === "rejected") {
      disableMetaPixel();
      if (previousConsent === "accepted") window.location.reload();
    }
  };

  return (
    <CookieConsentContext.Provider value={{ consent, openCookieSettings }}>
      {children}
      {isReady && controlsOpen && (
        <aside
          className="cookie-consent"
          role="region"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
        >
          <div className="cookie-consent-inner">
            <div className="cookie-consent-copy">
              <p className="eyebrow">Privacy</p>
              <h2 id="cookie-consent-title">Your privacy choices</h2>
              <p id="cookie-consent-description">
                We use optional cookies to understand website activity and measure our promotions.
                You can accept or reject them. Essential features work either way.
              </p>
              <a href="/privacy">Privacy Policy</a>
            </div>
            <div className="cookie-consent-actions" aria-label="Optional cookie choices">
              <button
                ref={rejectButtonRef}
                className="cookie-consent-choice"
                type="button"
                onClick={() => saveChoice("rejected")}
                aria-label="Reject optional cookies"
              >
                Reject optional cookies
              </button>
              <button
                className="cookie-consent-choice"
                type="button"
                onClick={() => saveChoice("accepted")}
                aria-label="Accept optional cookies"
              >
                Accept optional cookies
              </button>
            </div>
          </div>
        </aside>
      )}
    </CookieConsentContext.Provider>
  );
}

function readStoredConsent(): CookieConsentChoice {
  try {
    const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    return storedConsent === "accepted" || storedConsent === "rejected" ? storedConsent : null;
  } catch {
    return null;
  }
}
