"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(
          error.message === "Invalid login credentials"
            ? "Incorrect email or password. Please check your credentials."
            : error.message
        );
        return;
      }

      if (data.user) {
        router.push("/");
        router.refresh();
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "h-12 w-full rounded-xl border border-gold/50 bg-white/70 pl-11 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* Arch card: rose frame around a cream panel */}
      <div className="w-full max-w-sm rounded-t-full rounded-b-3xl bg-rose p-2 shadow-sm">
        <div className="rounded-t-full rounded-b-[1.25rem] bg-cream px-6 pb-8 pt-20 sm:px-8">
          {/* Header */}
          <div className="mb-6 flex flex-col items-center text-center">
            <p className="font-serif text-sm font-semibold tracking-wide">
              || Shree Ganesh Namah ||
            </p>
            <h1 className="mt-3 font-script text-5xl leading-tight">
              Welcome
            </h1>
            <p className="font-script text-3xl leading-tight">
              Naman &amp; Samiksha&apos;s Wedding
            </p>
            <div className="my-3 h-px w-24 bg-gold/60" />
            <p className="font-serif text-lg font-semibold">
              Wedding Command Center
            </p>
            <p className="text-sm text-muted-foreground">
              Private family portal
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMessage && (
              <div
                className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="family@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-ink text-base font-semibold text-cream shadow-sm transition-colors hover:bg-ink/90 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Notice on private signup */}
          <div className="mt-6 border-t border-gold/40 pt-5 text-center">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Accounts are pre-created for family members. If you need access,
              please reach out to the wedding organizers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}