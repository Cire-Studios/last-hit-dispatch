import { createContext, useContext } from "react";

export type CookieConsentChoice = "accepted" | "rejected" | null;

export interface CookieConsentContextValue {
  consent: CookieConsentChoice;
  openCookieSettings: () => void;
}

export const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) throw new Error("useCookieConsent must be used inside CookieConsentProvider");
  return context;
}
