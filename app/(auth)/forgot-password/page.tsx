'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { useToast } from '@/components/Toast';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast('Email is required', 'error');
      return;
    }

    setLoading(true);
    try {
      // Note: Backend doesn't have a forgot password endpoint yet
      // This is a placeholder for future implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast('If the email exists, a reset link has been sent', 'success');
      setSent(true);
    } catch {
      toast('Failed to send reset link', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-surface border border-border rounded-2xl p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="font-display text-2xl font-bold text-text-primary">Genu Library</span>
            </Link>
            <h1 className="font-display text-2xl font-bold text-text-primary">
              {sent ? 'Check Your Email' : 'Forgot Password'}
            </h1>
            <p className="font-body text-text-secondary mt-2">
              {sent
                ? 'We\'ve sent a password reset link to your email address.'
                : 'Enter your email and we\'ll send you a link to reset your password.'}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block font-body-small text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary-container text-text-on-accent rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-status-success/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-status-success text-[32px]">mark_email_read</span>
              </div>
              <p className="font-body text-text-secondary mb-6">
                Please check your inbox (and spam folder) for the password reset email.
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="font-body-small text-text-muted">
              Remember your password?{' '}
              <Link href="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
                Sign In
              </Link>
            </p>
            <p className="font-body-small text-text-muted mt-2">
              Need an account?{' '}
              <Link href="/register" className="text-primary hover:text-primary-hover font-medium transition-colors">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}