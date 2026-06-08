const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

/**
 * Injects the Razorpay checkout.js script if not already present,
 * then resolves once `window.Razorpay` is a constructor.
 */
export function loadRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("loadRazorpay called on the server"));
      return;
    }

    // Already loaded
    if (typeof window.Razorpay === "function") {
      resolve();
      return;
    }

    // Script tag already injected — wait for it
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`,
    );

    const onLoad = () => resolve();
    const onError = () => reject(new Error("Razorpay script failed to load"));

    if (existing) {
      existing.addEventListener("load", onLoad, { once: true });
      existing.addEventListener("error", onError, { once: true });
      return;
    }

    // Inject fresh
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
    document.body.appendChild(script);
  });
}
