import { createContext, useContext } from "react";

export type SignupInterest = "updates" | "playtest";

export interface OpenSignupOptions {
  source: string;
  preset?: SignupInterest;
}

export interface SignupContextValue {
  openSignup: (options: OpenSignupOptions) => void;
}

export const SignupContext = createContext<SignupContextValue | null>(null);

export function useSignup() {
  const context = useContext(SignupContext);
  if (!context) throw new Error("useSignup must be used inside SignupProvider");
  return context;
}
