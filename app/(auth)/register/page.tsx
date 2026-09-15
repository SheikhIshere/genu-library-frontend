"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/api";

function calcStrength(pwd: string): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: "Too short", color: "text-text-muted" };
  let s = 0;
  if (pwd.length >= 8) s++;
  if (pwd.length >= 12) s++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  if (s <= 1) return { score: 1, label: "Weak", color: "text-status-error" };
  if (s === 2) return { score: 2, label: "Fair", color: "text-status-warning" };
  if (s === 3) return { score: 3, label: "Good", color: "text-primary-container" };
  return { score: 4, label: "Strong", color: "text-status-success" };
}

function barColor(score: number, idx: number): string {
  if (idx >= score) return "bg-border";
  if (score === 1) return "bg-status-error";
  if (score === 2) return "bg-status-warning";
  if (score === 3) return "bg-primary-container";
  return "bg-status-success";
}

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const strength = useMemo(() => calcStrength(password), [password]);

  const passwordMatch = useMemo(() => {
    if (!confirmPassword) return null;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  function validate(): boolean {
    const next: Record<string, string | undefined> = {};
    const u = username.trim();
    if (!u || u.length < 3 || u.length > 20 || !/^[a-zA-Z0-9_]+$/.test(u)) {
      next.username = "Username must be 3-20 characters using letters, numbers or underscores.";
    }
    const em = email.trim();
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      next.email = "Please provide a valid archival scribe address.";
    }
    if (!password || password.length < 8) {
      next.password = "Password must contain at least 8 characters.";
    }
    if (!confirmPassword || password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }
    if (!terms) {
      next.terms = "You must agree to the terms.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await auth.register(email.trim(), password, confirmPassword);
      router.push("/");
    } catch {
      setErrors({ email: "Registration failed. Please try again." });
      setLoading(false);
    }
  }

  function clearError(field: string) {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  }

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-64px-48px)] p-4 sm:p-6 lg:p-8 gap-8 items-center">
      {/* Left Panel */}
      <section className="hidden lg:flex lg:col-span-5 flex-col justify-between h-full min-h-[680px] bg-gradient-to-b from-surface to-surface-dim border border-border rounded-2xl p-10 relative overflow-hidden shadow-2xl">
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Celestial Overlay */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none flex items-center justify-center">
          <svg className="w-[140%] h-[140%] text-text-primary" viewBox="0 0 500 500" fill="none" stroke="currentColor" strokeWidth="0.8">
            <circle cx="250" cy="250" r="210" strokeDasharray="4 6" />
            <circle cx="250" cy="250" r="160" />
            <circle cx="250" cy="250" r="110" />
            <polygon points="250,40 430,350 70,350" />
            <polygon points="250,460 70,150 430,150" />
            <line x1="250" y1="20" x2="250" y2="480" />
            <line x1="20" y1="250" x2="480" y2="250" />
          </svg>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-canvas/80 border border-border text-[11px] font-mono tracking-widest text-primary-container uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
            The Guild Ledger &bull; Season of Fire
          </div>
          <h1 className="font-display text-3xl xl:text-4xl font-bold mt-6 leading-tight tracking-tight text-text-primary">
            Enter the Sanctuary of <span className="text-primary-container italic">Living Knowledge</span>
          </h1>
          <p className="text-text-secondary text-sm xl:text-base mt-4 leading-relaxed font-body">
            Step beyond the threshold of ordinary reading. Join scholars, translators, and
            collectors cataloging human thought in an artisan digital archive.
          </p>
        </div>

        {/* Illustrated Tome Card */}
        <div className="relative z-10 my-8 flex flex-col items-center">
          <div className="relative w-full max-w-[280px] bg-canvas/90 border border-border rounded-xl p-5 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border text-[11px] font-mono text-text-muted">
              <span>REGISTRY FOLIO</span>
              <span className="text-primary-container flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
                PROSPECTUS #041
              </span>
            </div>
            <div className="my-5 relative flex justify-center items-center py-4 bg-surface rounded-lg border border-border/60">
              <svg className="w-20 h-20 text-primary-container drop-shadow-[0_0_15px_rgba(232,105,63,0.35)]" viewBox="0 0 64 64" fill="none" stroke="currentColor">
                <path d="M12 48V14a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v34" strokeWidth="2" />
                <path d="M12 48a4 4 0 0 0 4 4h32a4 4 0 0 0 4-4" strokeWidth="2" />
                <path d="M22 10v42" strokeWidth="1.5" strokeDasharray="2 2" />
                <path d="M32 20h12" strokeWidth="2" strokeLinecap="round" />
                <path d="M32 28h10" strokeWidth="2" strokeLinecap="round" />
                <path d="M32 36h6" strokeWidth="2" strokeLinecap="round" />
                <circle cx="44" cy="40" r="6" fill="#e8693f" stroke="none" fillOpacity="0.2" />
                <path d="M42 42l4-4" stroke="#e8693f" strokeWidth="2" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-display font-semibold text-text-primary">
                Archivist Inscription
              </div>
              <p className="text-[11px] text-text-secondary leading-snug">
                &ldquo;Every volume transcribed endures; every annotation illuminates an ancient dark.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Guild Perks */}
        <div className="relative z-10 grid grid-cols-2 gap-3 pt-4 border-t border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-canvas border border-border flex items-center justify-center text-primary-container">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-mono text-text-primary font-semibold">1,000 Tokens</div>
              <div className="text-[10px] text-text-muted">Welcome Patronage</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-canvas border border-border flex items-center justify-center text-primary-container">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-mono text-text-primary font-semibold">Rare PDFs</div>
              <div className="text-[10px] text-text-muted">Unlimited Reading</div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel: Form */}
      <section className="lg:col-span-7 flex justify-center items-center w-full">
        <div className="w-full max-w-xl bg-surface border border-border rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
          {/* Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-80" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-canvas border border-border shadow-inner text-primary-container mb-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Create Account
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1.5 font-body">
              Join Genu Library and start discovering rare codices &amp; treatises
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-text-secondary tracking-wide uppercase font-mono" htmlFor="reg-username">
                  Username
                </label>
                <span className="text-[11px] font-mono text-text-muted">
                  3&ndash;20 characters
                </span>
              </div>
              <div className="relative rounded-lg border border-border bg-canvas transition-all focus-within:border-primary-container focus-within:shadow-[0_0_0_3px_rgba(232,105,63,0.15)]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <input
                  id="reg-username"
                  type="text"
                  required
                  placeholder="archivist_elena"
                  className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none font-body"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    clearError("username");
                  }}
                />
              </div>
              {errors.username && (
                <p className="text-status-error text-[11px]">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-secondary tracking-wide uppercase font-mono" htmlFor="reg-email">
                Email Address
              </label>
              <div className="relative rounded-lg border border-border bg-canvas transition-all focus-within:border-primary-container focus-within:shadow-[0_0_0_3px_rgba(232,105,63,0.15)]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="scholar@guild.internal"
                  className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none font-body"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-status-error text-[11px]">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-text-secondary tracking-wide uppercase font-mono" htmlFor="reg-password">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] text-text-muted hover:text-primary-container transition-colors font-mono"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative rounded-lg border border-border bg-canvas transition-all focus-within:border-primary-container focus-within:shadow-[0_0_0_3px_rgba(232,105,63,0.15)]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none font-mono"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("password");
                  }}
                />
              </div>

              {/* Strength Meter */}
              <div className="pt-1.5 space-y-1.5">
                <div className="h-1.5 w-full bg-surface-dim rounded-full overflow-hidden flex gap-1 p-0.5 border border-border/40">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-full w-1/4 rounded-full transition-all duration-300 ${barColor(strength.score, i)}`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-text-muted">Password Strength:</span>
                  <span className={`font-semibold tracking-wide ${strength.color}`}>
                    {strength.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-text-secondary tracking-wide uppercase font-mono" htmlFor="reg-confirm">
                  Confirm Password
                </label>
                {confirmPassword && (
                  <span className={`text-[11px] font-mono ${passwordMatch ? "text-status-success" : "text-status-error"}`}>
                    {passwordMatch ? "Passwords match" : "Passwords do not match"}
                  </span>
                )}
              </div>
              <div className="relative rounded-lg border border-border bg-canvas transition-all focus-within:border-primary-container focus-within:shadow-[0_0_0_3px_rgba(232,105,63,0.15)]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="m9 11 3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
                <input
                  id="reg-confirm"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none font-mono"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearError("confirmPassword");
                  }}
                />
                {confirmPassword && (
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                    {passwordMatch ? (
                      <svg className="w-4 h-4 text-status-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-status-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-status-error text-[11px]">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="reg-terms"
                type="checkbox"
                required
                className="mt-1 w-4 h-4 rounded border-border bg-canvas text-primary-container focus:ring-primary-container focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer accent-primary-container"
                checked={terms}
                onChange={(e) => {
                  setTerms(e.target.checked);
                  clearError("terms");
                }}
              />
              <label className="text-xs text-text-secondary leading-normal cursor-pointer select-none font-body" htmlFor="reg-terms">
                I pledge to honor the{" "}
                <span className="text-primary-container hover:underline">Archivist Concordat</span>{" "}
                and agree to the{" "}
                <span className="text-primary-container hover:underline">Terms of Preservation</span>.
              </label>
            </div>
            {errors.terms && (
              <p className="text-status-error text-[11px]">{errors.terms}</p>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg bg-primary-container hover:bg-primary-hover active:scale-[0.98] text-on-primary-container font-semibold text-sm tracking-wide shadow-lg shadow-primary-container/20 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin text-on-primary-container" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <>
                    <span className="font-sans font-semibold">Create Account</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
                {loading && <span className="font-sans font-semibold">Inscribing Ledger...</span>}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-border" />
            <span className="absolute px-3 bg-surface text-[11px] font-mono uppercase tracking-widest text-text-muted">
              or register via
            </span>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="py-2.5 px-3 rounded-lg border border-border bg-canvas/60 hover:bg-surface-hover hover:border-border-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 text-xs font-medium text-text-primary group cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.6-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              className="py-2.5 px-3 rounded-lg border border-border bg-canvas/60 hover:bg-surface-hover hover:border-border-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 text-xs font-medium text-text-primary group cursor-pointer"
            >
              <svg className="w-4 h-4 text-text-primary group-hover:text-primary-container transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-7 pt-4 border-t border-border/60">
            <p className="text-xs text-text-secondary font-body">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary-container font-medium hover:underline hover:text-primary-hover ml-1 inline-flex items-center gap-0.5"
              >
                <span>Sign In</span>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
