"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/api";

const navLinks = [
  { href: "/", label: "Home", icon: "cottage", desktopLabel: "Home" },
  { href: "/books", label: "Books", icon: "auto_stories", desktopLabel: "Books" },
  { href: "/playlists", label: "Lists", icon: "collections_bookmark", desktopLabel: "Playlists" },
  { href: "/upload", label: "Upload", icon: "cloud_upload", desktopLabel: "Upload", hideOnMobile: true },
];

export default function Header() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLoggedIn(auth.isLoggedIn());
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  if (!mounted) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 w-full z-50 bg-canvas/80 backdrop-blur-xl border-b border-border transition-colors duration-200">
          <div className="h-20 max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-lg shrink-0">
              <Link className="flex items-center gap-space-sm group text-text-primary" href="/">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-border group-hover:border-primary transition-colors">
                  <span className="material-symbols-outlined text-primary text-[22px]">local_fire_department</span>
                </div>
                <span className="font-display text-headline-3 font-semibold text-text-primary tracking-tight">Genu Library</span>
              </Link>
              <nav className="hidden lg:flex items-center gap-space-lg">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-body-default transition-colors py-space-xs ${
                      isActive(link.href)
                        ? "text-primary border-b-2 border-primary"
                        : "text-body-default text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {link.desktopLabel}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="hidden md:flex flex-1 max-w-md mx-space-md relative">
              <div className="w-full flex items-center bg-canvas border border-border rounded-lg px-space-sm py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <span className="material-symbols-outlined text-text-muted text-[20px] mr-2">search</span>
                <input
                  className="w-full bg-transparent border-none outline-none font-body-small text-body-small text-text-primary placeholder:text-text-muted"
                  placeholder="Search codex, folio, author, or seal..."
                  type="text"
                />
                <span className="font-label-mono text-overline text-text-muted bg-surface-container border border-border px-1.5 py-0.5 rounded hidden sm:inline">⌘K</span>
              </div>
            </div>
            <div className="flex items-center gap-space-md shrink-0">
              <div className="hidden sm:flex items-center gap-1.5 bg-surface-container border border-border px-space-sm py-1.5 rounded-lg">
                <span className="text-secondary text-[16px]">🪙</span>
                <span className="font-label-mono text-label-mono font-medium text-secondary">1.4K</span>
              </div>
              <div className="flex items-center gap-space-sm">
                <Link href="/login" className="w-8 h-8 rounded-full bg-surface-container border border-border flex items-center justify-center text-text-muted hover:border-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <nav className="md:hidden fixed bottom-0 w-full z-50 pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.35)]">
          <div className="flex items-stretch justify-around h-16 max-w-md mx-auto px-space-xs">
            {navLinks
              .filter((l) => !l.hideOnMobile)
              .map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] flex-1 py-space-xs transition-colors duration-150 ${
                      active
                        ? "text-primary border-t-2 border-primary pt-0"
                        : "text-text-secondary hover:text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{link.icon}</span>
                    <span className="font-caption text-caption mt-0.5">{link.label}</span>
                  </Link>
                );
              })}
          </div>
        </nav>
      </>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-canvas/80 backdrop-blur-xl border-b border-border transition-colors duration-200">
        <div className="h-20 max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-lg shrink-0">
            <Link className="flex items-center gap-space-sm group text-text-primary" href="/">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-border group-hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary text-[22px]">local_fire_department</span>
              </div>
              <span className="font-display text-headline-3 font-semibold text-text-primary tracking-tight">Genu Library</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-space-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-body-default transition-colors py-space-xs ${
                    isActive(link.href)
                      ? "text-primary border-b-2 border-primary"
                      : "text-body-default text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {link.desktopLabel}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden md:flex flex-1 max-w-md mx-space-md relative">
            <div className="w-full flex items-center bg-canvas border border-border rounded-lg px-space-sm py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <span className="material-symbols-outlined text-text-muted text-[20px] mr-2">search</span>
              <input
                className="w-full bg-transparent border-none outline-none font-body-small text-body-small text-text-primary placeholder:text-text-muted"
                placeholder="Search codex, folio, author, or seal..."
                type="text"
              />
              <span className="font-label-mono text-overline text-text-muted bg-surface-container border border-border px-1.5 py-0.5 rounded hidden sm:inline">⌘K</span>
            </div>
          </div>
          <div className="flex items-center gap-space-md shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 bg-surface-container border border-border px-space-sm py-1.5 rounded-lg">
              <span className="text-secondary text-[16px]">🪙</span>
              <span className="font-label-mono text-label-mono font-medium text-secondary">1.4K</span>
            </div>
            <div className="flex items-center gap-space-sm">
              <div className="relative group cursor-pointer">
                {loggedIn ? (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
                  </div>
                ) : (
                  <Link href="/login" className="w-8 h-8 rounded-full bg-surface-container border border-border flex items-center justify-center text-text-muted hover:border-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 w-full z-50 pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.35)]">
        <div className="flex items-stretch justify-around h-16 max-w-md mx-auto px-space-xs">
          {navLinks
            .filter((l) => !l.hideOnMobile)
            .map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] flex-1 py-space-xs transition-colors duration-150 ${
                    active
                      ? "text-primary border-t-2 border-primary pt-0"
                      : "text-text-secondary hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">{link.icon}</span>
                  <span className="font-caption text-caption mt-0.5">{link.label}</span>
                </Link>
              );
            })}
        </div>
      </nav>
    </>
  );
}