export const META_PIXEL_ID = "1057491636682428";
export const META_PIXEL_SCRIPT_ID = "meta-pixel-script";

interface MetaPixelFunction {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: MetaPixelFunction;
  loaded: boolean;
  version: string;
}

declare global {
  interface Window {
    fbq?: MetaPixelFunction;
    _fbq?: MetaPixelFunction;
    __lastHitMetaPixelInitialized?: boolean;
    __lastHitMetaPixelLastPage?: string;
  }
}

export function initializeMetaPixel() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.__lastHitMetaPixelInitialized) return;

  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
      } else {
        fbq.queue.push(args);
      }
    } as MetaPixelFunction;

    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;
  }

  if (!document.getElementById(META_PIXEL_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = META_PIXEL_SCRIPT_ID;
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  window.fbq("init", META_PIXEL_ID);
  window.__lastHitMetaPixelInitialized = true;
}

export function trackMetaPixelPageView(href: string) {
  if (
    typeof window === "undefined" ||
    !window.__lastHitMetaPixelInitialized ||
    !window.fbq ||
    window.__lastHitMetaPixelLastPage === href
  ) {
    return;
  }

  window.fbq("track", "PageView");
  window.__lastHitMetaPixelLastPage = href;
}

export function disableMetaPixel() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  document.getElementById(META_PIXEL_SCRIPT_ID)?.remove();
  delete window.fbq;
  delete window._fbq;
  delete window.__lastHitMetaPixelInitialized;
  delete window.__lastHitMetaPixelLastPage;
  removeMetaPixelCookies();
}

function removeMetaPixelCookies() {
  const cookieNames = ["_fbp", "_fbc"];
  const hostnameParts = window.location.hostname.split(".");
  const domains = hostnameParts.map((_, index) => `.${hostnameParts.slice(index).join(".")}`);
  const expired = "=; Max-Age=0; path=/; SameSite=Lax";

  for (const name of cookieNames) {
    document.cookie = `${name}${expired}`;
    for (const domain of domains) {
      document.cookie = `${name}${expired}; domain=${domain}`;
    }
  }
}
