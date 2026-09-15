"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate(): boolean {
    const next: typeof errors = {};
    if (!email.trim()) {
      next.email = "Guild Identity / Email is required to commune.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Please provide a valid archival scribe address.";
    }
    if (!password) {
      next.password = "Archival Passkey cipher cannot be blank.";
    } else if (password.length < 6) {
      next.password = "Passkey must contain at least 6 rune characters.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await auth.login(email.trim(), password);
      router.push("/");
    } catch {
      setErrors({ email: "Authentication failed. Please check your credentials." });
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-canvas overflow-x-hidden">
      {/* Left Hero Panel */}
      <section
        aria-label="Sanctum Codex Overview"
        className="relative lg:w-[45%] xl:w-[42%] flex flex-col justify-between p-8 sm:p-12 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-border"
      >
        {/* Background Image with Overlays */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            alt="Dark fantasy atmospheric interior of an ancient grand library guild sanctuary, warm candlelight, glowing embers, floating golden dust particles"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-90 contrast-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvL_Wofr8ALOB0MUUffcGsCmhV06xY4tOgl8o5u1qZtwp03S5yvwEKJ1JgmULKsKC3VTe82ltR72kl6A6_s37td-BuCYDU1G-ahxcYNAocG-Etc5H5cgiU820pqQEZ-3lvmp3leJgAS2pbkkLT_SpqHJg0kxud1C_KCqGmEA4wsaskabq8vB_ageDGISGypu1jZO1QfQwxkk8jXlC_-ukE3BJ__bKuHmWTAipiIq1f7aeE0HzREaS1"
          />
          <div className="absolute inset-0 bg-canvas/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-canvas/80 via-transparent to-canvas" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl pointer-events-none animate-ember-glow" />
        </div>

        {/* Top Badge */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/80 backdrop-blur-md border border-border shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest uppercase font-semibold text-text-primary/90">
              The Guild Sanctuary &bull; Archivist Concordat
            </span>
          </div>
        </div>

        {/* Middle Editorial */}
        <div className="relative z-10 my-12 lg:my-0 max-w-lg">
          <h1 className="font-display text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]">
            Return to the <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-[#f79d74] to-text-primary">
              Hall of Living Ink.
            </span>
          </h1>
          <p className="mt-4 text-text-secondary text-sm sm:text-base leading-relaxed">
            Enter the private codex vaults. Retrieve annotated manuscripts, decipher
            illuminated folios, and commune with the global guild of scholars.
          </p>
        </div>

        {/* Quote Card */}
        <div className="relative z-10">
          <div className="p-4 sm:p-5 rounded-xl bg-surface/85 backdrop-blur-md border border-border shadow-lg flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-canvas border border-primary-container/40 flex items-center justify-center text-primary-container">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24">
                <path d="M12 2l3 6 6 .8-4.5 4.2 1.3 6.3L12 16.2 6.2 19.3 7.5 13 3 8.8l6-.8L12 2z" />
              </svg>
            </div>
            <div>
              <blockquote className="text-xs sm:text-sm italic text-text-primary/90 font-display leading-snug">
                &ldquo;Knowledge preserved is eternity forged.&rdquo;
              </blockquote>
              <p className="mt-1.5 font-mono text-[11px] tracking-wider text-text-secondary">
                Archivist M. Vane &mdash; <span className="text-primary-container">3rd Order</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Right Auth Panel */}
      <section
        aria-label="Sign In Authentication"
        className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-canvas relative z-10"
      >
        {/* Top Nav */}
        <nav aria-label="Sanctum secondary navigation" className="flex items-center justify-between sm:justify-end gap-4 text-xs font-mono tracking-wider text-text-secondary">
          <Link className="inline-flex items-center gap-1.5 hover:text-text-primary transition-colors py-1" href="/">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            Sanctum Home
          </Link>
          <span className="text-border hidden sm:inline">&bull;</span>
          <span className="hover:text-primary-container transition-colors py-1 cursor-pointer">
            Need assistance? Codex Registry
          </span>
        </nav>

        {/* Auth Card */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="rounded-2xl bg-surface border border-border shadow-forge-lg p-7 sm:p-9 relative overflow-hidden">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-container to-transparent" />

            {/* Header */}
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-canvas border border-border text-primary-container shadow-inner mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10" />
                  <path d="M6 10h10" />
                  <path d="M12 14h4" />
                </svg>
              </div>
              <p className="font-display tracking-wide text-xs text-primary-container uppercase font-semibold">
                Genu Library
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mt-1 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1.5">
                Sign in to continue to Genu Library
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-medium text-text-primary tracking-wide" htmlFor="login-email">
                  Guild Identity / Scribe Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                    </svg>
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="username"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-canvas border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all border-border"
                    placeholder="scholar@genulibrary.org"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-status-error font-mono mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-medium text-text-primary tracking-wide" htmlFor="login-password">
                  Archival Passkey
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                    </svg>
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-canvas border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all border-border"
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                    }}
                  />
                  <button
                    type="button"
                    aria-label="Toggle passkey visibility"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-primary focus:outline-none transition-colors"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-status-error font-mono mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded bg-canvas border-border text-primary-container focus:ring-primary-container focus:ring-offset-0 focus:ring-opacity-40 transition accent-primary-container"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-xs text-text-secondary hover:text-text-primary transition-colors">
                    Remember me
                  </span>
                </label>
                <Link className="text-xs text-primary-container hover:text-primary-hover transition-colors font-medium" href="/forgot-password">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary-container to-[#f07b53] hover:from-primary-hover hover:to-primary-container text-on-primary-container font-semibold text-sm tracking-wide shadow-forge-glow hover:shadow-lg transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-on-primary-container" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
                    </svg>
                  )}
                  <span>{loading ? "Verifying Cipher..." : "Sign In to Sanctum"}</span>
                  {!loading && (
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-surface px-3 text-text-muted font-mono uppercase tracking-wider text-[11px]">
                  or authenticate via ledger
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-canvas border border-border text-text-primary hover:border-primary-container hover:bg-surface-hover text-xs font-medium transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z" fill="#EA4335" />
                  <path d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" fill="#4285F4" />
                  <path d="M5.3 14.7c-.2-.7-.4-1.4-.4-2.2s.2-1.5.4-2.2L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9z" fill="#FBBC05" />
                  <path d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z" fill="#34A853" />
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-canvas border border-border text-text-primary hover:border-primary-container hover:bg-surface-hover text-xs font-medium transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-xs text-text-secondary">
              Don&apos;t have an account?{" "}
              <Link className="text-primary-container font-medium hover:underline hover:text-primary-hover transition-colors ml-1" href="/register">
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Watermark */}
        <footer aria-label="Security Status" className="text-center font-mono text-[11px] text-text-muted tracking-wider pt-4">
          <span>256-bit Immutable Cipher &bull; Guild Ledger Verified</span>
        </footer>
      </section>
    </main>
  );
}
