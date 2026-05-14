"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, LogIn, HelpCircle, ArrowLeft, Eye, EyeOff, Copy, Check } from "lucide-react";
import { useDashboardAuth } from "@/lib/auth-context";

function getSlugFromHostname(): string {
  if (typeof window === "undefined") return "mosaic-table";
  const host = window.location.hostname.toLowerCase();
  // Localhost / dev fallback
  if (host === "localhost" || host === "127.0.0.1") {
    return "mosaic-table";
  }
  if (host.startsWith("admin-")) {
    return host.replace("admin-", "").split(".")[0];
  }
  return host.split(".")[0];
}

const DEMO_RESTAURANTS: Record<string, { name: string; username: string; password: string }> = {
  "mosaic-table": { name: "Mosaic Table", username: "js", password: "1234" },
  "spice-garden": { name: "Spice Garden", username: "js", password: "1234" },
};

function getRestaurantCreds(slug: string): { username: string; password: string; name: string } | null {
  // Try localStorage first (same-origin only)
  try {
    const raw = localStorage.getItem("justsearch-admin-restaurants");
    if (raw) {
      const parsed = JSON.parse(raw);
      const restaurants = parsed.state?.restaurants ?? [];
      const found = restaurants.find((r: any) => r.slug === slug || r.subdomain === slug);
      if (found && found.dashboardUsername && found.dashboardPassword) {
        return {
          username: found.dashboardUsername,
          password: found.dashboardPassword,
          name: found.name || "",
        };
      }
    }
  } catch {
    // ignore
  }

  // Fallback to demo data
  return DEMO_RESTAURANTS[slug] ?? null;
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const { login } = useDashboardAuth();
  const router = useRouter();

  const slug = getSlugFromHostname();
  const creds = getRestaurantCreds(slug);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = login(username, password);
    if (success) {
      router.push("/");
    } else {
      setError("Invalid username or password");
    }
    setLoading(false);
  };

  const copyText = async (text: string, type: "user" | "pass") => {
    await navigator.clipboard.writeText(text);
    if (type === "user") {
      setCopiedUser(true);
      setTimeout(() => setCopiedUser(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500">
            <LogIn className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Restaurant Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            {showForgot ? "Recover your login credentials" : "Sign in to manage your restaurant"}
          </p>
        </div>

        {!showForgot ? (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-amber-600 transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={() => { setShowForgot(true); setError(""); }}
              className="flex w-full items-center justify-center gap-1 text-xs font-bold text-slate-500 hover:text-amber-600 transition-colors"
            >
              <HelpCircle className="h-3 w-3" />
              Forgot your password?
            </button>
          </form>
        ) : (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {creds ? (
              <>
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-center">
                  <p className="text-sm font-bold text-slate-900">{creds.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Your dashboard credentials</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Username</p>
                      <p className="text-sm font-medium text-slate-700">{creds.username}</p>
                    </div>
                    <button
                      onClick={() => copyText(creds.username, "user")}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 transition-colors"
                      title="Copy username"
                    >
                      {copiedUser ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Password</p>
                      <p className="text-sm font-medium text-slate-700">{"•".repeat(creds.password.length)}</p>
                    </div>
                    <button
                      onClick={() => copyText(creds.password, "pass")}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 transition-colors"
                      title="Copy password"
                    >
                      {copiedPass ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    If you need to change your password, please contact the <strong>JustSearch platform administrator</strong> who created your restaurant account.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <HelpCircle className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-900">Contact Platform Admin</p>
                <p className="text-xs text-slate-500 mt-1">
                  Your restaurant dashboard credentials were created by the JustSearch administrator. Please contact them to recover or reset your password.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
