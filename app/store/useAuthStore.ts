import { create } from "zustand";
import toast from "react-hot-toast";
import { Lucid } from "lucid-cardano";
import { getLucidFront, resetLucidFront } from "@/app/lib/lucidFront";

// minimal runtime type guard for CIP-30 WalletApi-ish objects
// ...existing code...
function looksLikeWalletApi(obj: unknown): boolean {
  if (!obj || typeof obj !== "object") return false;
  const required = [
    "getNetworkId",
    "getUtxos",
    "getBalance",
    "getUsedAddresses",
    "signTx",
    "submitTx",
  ];
  return required.every(
    (k) => typeof (obj as Record<string, unknown>)[k] === "function"
  );
}
// ...existing code...

// Extend Window interface for TypeScript (keeps it permissive)
declare global {
  interface Window {
    cardano?: {
      [key: string]: Record<string, unknown>;
    };
  }
}

type AuthState = {
  authUser: boolean;
  isLoggingIn: boolean;
  connectedAddress: string | null;
  walletProviderName: string | null;
  lucid?: Lucid | null;
  shouldAutoReconnect: boolean;

  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => void;
  autoReconnect: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: false,
  isLoggingIn: false,
  connectedAddress: null,
  walletProviderName: null,
  lucid: null,
  shouldAutoReconnect: true,

  connectWallet: async () => {
    set({ isLoggingIn: true });
    try {
      const lucid = await getLucidFront();
      const providers = window.cardano || {};

      // Prefer Lace, then Eternl, then Nami, else first available
      const preferred =
        (window.cardano?.lace && "lace") ||
        (window.cardano?.eternl && "eternl") ||
        (window.cardano?.nami && "nami") ||
        Object.keys(providers)[0];

      const provider = preferred ? providers[preferred] : null;

      if (!provider) {
        toast.error(
          "No CIP-30 Cardano wallet found. Install Lace / Eternl / Nami."
        );
        set({ isLoggingIn: false });
        return null;
      }

      // Request permission (this may open a wallet popup)
      const walletApi = await provider.enable();

      // runtime-check walletApi implements required methods before handing to lucid
      if (!looksLikeWalletApi(walletApi)) {
        toast.error(
          "Connected wallet does not implement required CIP-30 methods."
        );
        set({ isLoggingIn: false });
        return null;
      }

      // select wallet in lucid
      await lucid.selectWallet(walletApi);
      const address = await lucid.wallet.address();

      // persist preferred wallet for auto-reconnect
      try {
        localStorage.setItem("preferred_wallet", preferred);
        localStorage.setItem("should_auto_reconnect", "true"); // allow recon on refresh
      } catch {
        // ignore storage errors on some browsers
      }

      set({
        lucid,
        connectedAddress: address,
        walletProviderName: preferred,
        authUser: true,
        shouldAutoReconnect: true,
      });

      toast.success("Wallet connected: " + address);

      // call backend to create a session (best-effort)
      try {
        await fetch("/api/auth/wallet-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });
      } catch (err) {
        console.warn("wallet-login failed:", err);
      }

      return address;
    } catch (err) {
      console.error("connectWallet error:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error("Failed to connect wallet: " + errorMessage);
      return null;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  disconnectWallet: () => {
    try {
      localStorage.removeItem("preferred_wallet");
      localStorage.setItem("should_auto_reconnect", "false"); // persist disable
    } catch {}
    resetLucidFront();
    set({
      authUser: false,
      connectedAddress: null,
      walletProviderName: null,
      lucid: null,
      shouldAutoReconnect: false,
    });
    toast("Disconnected wallet");
  },

  autoReconnect: async () => {
    // 1) Respect persisted user choice (localStorage)
    try {
      const val =
        typeof window !== "undefined"
          ? localStorage.getItem("should_auto_reconnect")
          : null;
      if (val === "false") {
        console.log(
          "Auto-reconnect is disabled by user preference (localStorage)."
        );
        return;
      }
    } catch {
      // ignore storage errors (private mode / blocked)
    }

    // 2) Respect in-memory flag
    const { shouldAutoReconnect } = get();
    if (!shouldAutoReconnect) {
      console.log("Auto-reconnect disabled by in-memory flag, skipping...");
      return;
    }

    // 3) Ensure we're running in the browser
    if (typeof window === "undefined") return;

    try {
      const providers = window.cardano || {};
      const providerKeys = Object.keys(providers);
      if (!providerKeys.length) {
        console.log("No Cardano wallet providers found in window.cardano");
        return;
      }

      // 4) Prefer previously selected wallet (guard localStorage read)
      let preferred: string | null = null;
      try {
        preferred = localStorage.getItem("preferred_wallet");
      } catch {
        preferred = null;
      }

      const tryProviders = preferred
        ? [preferred, ...providerKeys.filter((k) => k !== preferred)]
        : window.cardano?.lace
          ? ["lace", ...providerKeys.filter((k) => k !== "lace")]
          : providerKeys;

      // 5) Try each provider (silent isEnabled -> enable -> select wallet)
      for (const key of tryProviders) {
        try {
          const prov = window.cardano?.[key];
          if (!prov) continue;

          // must support isEnabled for silent check
          if (typeof prov.isEnabled !== "function") {
            // skip providers that cannot silently report permission
            continue;
          }

          const enabled = await prov.isEnabled();
          if (!enabled) continue;

          // call enable() — should be silent because isEnabled returned true
          let walletApi: unknown = null;
          try {
            const res = await prov.enable();
            // Some wallets return API from enable(); some mutate prov itself.
            if (res && looksLikeWalletApi(res)) walletApi = res;
            else if (looksLikeWalletApi(prov)) walletApi = prov;
            else walletApi = res || prov;
          } catch (enableErr) {
            // enable() threw — try to use provider directly if it already implements methods
            if (looksLikeWalletApi(prov)) {
              walletApi = prov;
            } else {
              console.warn(
                "provider.enable() threw and provider is not usable:",
                key,
                enableErr
              );
              continue; // try next provider
            }
          }

          if (!looksLikeWalletApi(walletApi)) {
            console.warn(
              "Provider enabled but does not implement required CIP-30 methods:",
              key
            );
            continue;
          }

          // Initialize lucid (frontend) and select the wallet
          const lucid = await getLucidFront();
          await lucid.selectWallet(walletApi);

          // Fetch the address (this also validates wallet is usable)
          const address = await lucid.wallet.address();

          // Persist preferred wallet and allow future autoReconnect
          try {
            localStorage.setItem("preferred_wallet", key);
            localStorage.setItem("should_auto_reconnect", "true");
          } catch {
            // ignore
          }

          // Update store and finish
          set({
            lucid,
            connectedAddress: address,
            walletProviderName: key,
            authUser: true,
            shouldAutoReconnect: true,
          });

          console.log("Auto-reconnected to wallet:", key, address);
          return;
        } catch (innerErr) {
          // provider-specific failure — continue to next provider
          console.warn(
            "autoReconnect: provider attempt failed for",
            key,
            innerErr
          );
          continue;
        }
      }

      // none reconnected
      console.log("autoReconnect: no provider auto-reconnected");
    } catch (err) {
      console.warn("autoReconnect error", err);
    }
  },
}));
