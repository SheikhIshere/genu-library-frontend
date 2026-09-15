'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { mediaUrl } from '@/lib/api';
import { formatTokens } from '@/lib/formatTokens';

interface ProfileClientProps {
  userData: Record<string, unknown>;
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'overview' },
  { id: 'books', label: 'Books', icon: 'menu_book' },
  { id: 'reviews', label: 'Reviews', icon: 'rate_review' },
  { id: 'playlists', label: 'Playlists', icon: 'collections_bookmark' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function ProfileClient({ userData }: ProfileClientProps) {
  const user = (userData.user as Record<string, unknown>) || {};
  const fullName = (userData.full_name as string) || (user.username as string) || 'Unknown Scholar';
  const username = (user.username as string) || '';
  const email = (user.email as string) || '';
  const phone = (userData.phone_number as string) || '';
  const bio = (userData.bio as string) || '';
  const address = (userData.address as string) || '';
  const token = (userData.token as number) || 0;
  const profilePic = (userData.profile_picture as string) || null;
  const uploadsCount = (userData.uploads_count as number) || 0;
  const favoritesCount = (userData.favorites_count as number) || 0;
  const avgRating = (userData.average_rating as number) || 0;
  const isVerified = userData.is_verified !== false;

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((msg: string) => {
    clearTimeout(toastTimer.current);
    setToastMsg(msg);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 3000);
  }, []);

  useEffect(() => {
    const btn = tabRefs.current[activeTab];
    const indicator = indicatorRef.current;
    if (btn && indicator) {
      indicator.style.width = `${btn.offsetWidth}px`;
      indicator.style.left = `${btn.offsetLeft}px`;
    }
  }, [activeTab]);

  const handleShare = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: `${fullName} | Genu Library`, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Profile link copied to clipboard');
    }
  }, [fullName, showToast]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Profile URL copied');
  }, [showToast]);

  const handleVCard = useCallback(() => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${fullName.split(' ').pop() || ''};${fullName.split(' ').slice(0, -1).join(' ') || ''};;;`,
      `FN:${fullName}`,
      email ? `EMAIL;type=INTERNET:${email}` : '',
      phone ? `TEL;type=WORK:${phone}` : '',
      address ? `ADR;type=WORK:;;${address};;;` : '',
      `NOTE:${bio}`,
      'END:VCARD',
    ].filter(Boolean).join('\n');

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fullName.replace(/\s+/g, '_')}_Genu.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('vCard downloaded');
  }, [fullName, email, phone, address, bio, showToast]);

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return Array.from({ length: 5 }, (_, i) => {
      if (i < full) return 'star';
      if (i === full && hasHalf) return 'star_half';
      return 'star';
    });
  };

  return (
    <main className="w-full flex-1 bg-canvas">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-48 right-12 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <section className="relative w-full rounded-xl bg-surface border border-border p-6 sm:p-8 shadow-xl overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface-container/60 to-surface-container-high/40 opacity-70 pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1 min-w-0">
            <div className="relative flex-shrink-0 group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[3px] bg-gradient-to-br from-primary-container via-secondary to-primary shadow-[0_0_28px_rgba(234,106,64,0.35)] flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]">
                <img
                  alt={fullName}
                  className="w-full h-full object-cover rounded-full bg-surface-container-lowest"
                  src={mediaUrl(profilePic)}
                />
              </div>
              {isVerified && (
                <span className="absolute bottom-1 right-1 bg-surface-container-highest text-secondary p-1.5 rounded-full shadow-md flex items-center justify-center ring-2 ring-surface" title="Verified Scholar">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">{fullName}</h1>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 bg-primary/15 border border-primary/30 text-primary px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Verified Scholar
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3.5 pt-0.5">
                <span className="font-mono text-sm text-text-muted">@{username}</span>
                {token > 0 && (
                  <span className="inline-flex items-center gap-1.5 bg-surface-container border border-border px-3 py-1 rounded-full shadow-inner">
                    <span className="material-symbols-outlined text-secondary text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>token</span>
                    <span className="font-mono text-xs font-bold text-secondary-fixed-dim tabular-nums">{formatTokens(token)}</span>
                    <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">Patronage Tokens</span>
                  </span>
                )}
              </div>

              {bio && (
                <p className="font-body text-sm text-text-secondary max-w-2xl pt-1 leading-relaxed">{bio}</p>
              )}

              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-text-muted pt-2 border-t border-border/50">
                {email && (
                  <a className="inline-flex items-center gap-1.5 hover:text-primary transition-colors" href={`mailto:${email}`}>
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                    <span>{email}</span>
                  </a>
                )}
                {phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    <span>{phone}</span>
                  </span>
                )}
                {address && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    <span>{address}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-row lg:flex-col items-stretch gap-2.5 w-full lg:w-48 flex-shrink-0 pt-2 lg:pt-0">
            <button className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-hover border border-border text-text-primary text-sm font-medium transition-all duration-150 active:scale-95 shadow-sm" onClick={handleShare}>
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span>Share</span>
            </button>
            <button className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-hover border border-border text-text-primary text-sm font-medium transition-all duration-150 active:scale-95 shadow-sm" onClick={handleCopyLink}>
              <span className="material-symbols-outlined text-[18px]">content_copy</span>
              <span>Copy Link</span>
            </button>
            <button className="w-full lg:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container hover:bg-primary-hover text-text-on-accent font-semibold text-sm shadow-[0_0_20px_rgba(234,106,64,0.3)] transition-all duration-150 active:scale-95" onClick={handleVCard}>
              <span className="material-symbols-outlined text-[18px]">contact_page</span>
              <span>Download vCard</span>
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          <div className="group relative rounded-xl bg-surface border border-border p-5 shadow-md hover:-translate-y-0.5 hover:border-primary/40 transition-all duration-200 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Archival Output</span>
              <span className="w-9 h-9 rounded-lg bg-surface-container border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">library_books</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-mono text-3xl font-bold text-text-primary">{uploadsCount.toLocaleString()}</span>
              <span className="font-display text-lg font-semibold text-primary">Codices</span>
            </div>
            <p className="font-body text-xs text-text-secondary mt-1">Illuminated treatises &amp; guild manuscripts registered</p>
          </div>

          <div className="group relative rounded-xl bg-surface border border-border p-5 shadow-md hover:-translate-y-0.5 hover:border-secondary/40 transition-all duration-200 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Patron Endorsements</span>
              <span className="w-9 h-9 rounded-lg bg-surface-container border border-border flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">favorite</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-mono text-3xl font-bold text-text-primary">{favoritesCount.toLocaleString()}</span>
              <span className="font-display text-lg font-semibold text-secondary">Scholars</span>
            </div>
            <p className="font-body text-xs text-text-secondary mt-1">Readers marked folios to sanctum study chests</p>
          </div>

          <div className="group relative rounded-xl bg-surface border border-border p-5 shadow-md hover:-translate-y-0.5 hover:border-primary/40 transition-all duration-200 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Archival Standing</span>
              <span className="w-9 h-9 rounded-lg bg-surface-container border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>grade</span>
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="font-mono text-3xl font-bold text-text-primary">{avgRating.toFixed(2)}</span>
              <div className="flex items-center text-secondary">
                {renderStars(avgRating).map((icon, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                ))}
              </div>
            </div>
            <p className="font-body text-xs text-text-secondary mt-1">Aggregated across peer reviews and citations</p>
          </div>
        </section>

        <section className="w-full flex flex-col gap-4">
          <div className="relative w-full bg-surface-container-lowest border border-border rounded-xl p-1.5 shadow-inner">
            <div className="absolute top-1.5 bottom-1.5 rounded-lg bg-surface border border-border/80 transition-all duration-300 ease-out shadow-sm pointer-events-none" ref={indicatorRef} />
            <div className="relative flex items-center justify-start overflow-x-auto gap-1" role="tablist">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  ref={(el) => { tabRefs.current[tab.id] = el; }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm transition-colors z-10 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-primary font-semibold'
                      : 'text-text-secondary font-medium hover:text-text-primary'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                >
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="w-full mt-1">
            {activeTab === 'overview' && (
              <div className="flex flex-col lg:flex-row gap-6 transition-opacity duration-200">
                <div className="flex-1 flex flex-col gap-6 min-w-0">
                  <div className="rounded-xl bg-surface border border-border p-6 shadow-md flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-lg bg-surface-container border border-border flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[20px]">history_edu</span>
                      </span>
                      <h2 className="font-display text-xl font-bold text-text-primary">Scholarly Mission</h2>
                    </div>
                    <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
                      <p>{bio || 'This archivist has not yet shared their scholarly mission.'}</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-surface border border-border p-6 shadow-md flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg bg-surface-container border border-border flex items-center justify-center text-secondary">
                          <span className="material-symbols-outlined text-[20px]">dynamic_feed</span>
                        </span>
                        <h3 className="font-display text-lg font-bold text-text-primary">Recent Activity</h3>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3.5">
                      <div className="flex items-start gap-3.5 p-3 rounded-lg hover:bg-surface-hover transition-colors border border-transparent hover:border-border">
                        <span className="w-9 h-9 rounded-full bg-surface-container border border-border flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[18px]">upload_file</span>
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-text-primary">Profile registered in the Guild Sanctuary</span>
                          <p className="text-xs text-text-secondary mt-0.5">Welcome to the Genu Library archivist network.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-96 flex flex-col gap-6 flex-shrink-0">
                  {address && (
                    <div className="rounded-xl bg-surface border border-border p-6 shadow-md flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Sanctum Location</span>
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-text-primary">{address}</h3>
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl bg-surface border border-border p-6 shadow-md flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">Guild Standing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-3xl font-bold text-text-primary">{avgRating.toFixed(2)}</span>
                      <div className="flex items-center text-secondary">
                        {renderStars(avgRating).map((icon, i) => (
                          <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'books' && (
              <div className="flex flex-col gap-6 transition-opacity duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border/60">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-text-primary">Published Codices</h2>
                    <p className="text-xs text-text-secondary mt-0.5">Manuscripts authored and cataloged by {fullName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {uploadsCount === 0 && (
                    <div className="col-span-full text-center py-12 text-text-muted text-sm">
                      No codices published yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="flex flex-col gap-6 transition-opacity duration-200">
                <div className="border-b border-border/60 pb-3">
                  <h2 className="font-display text-2xl font-bold text-text-primary">Archival Reviews</h2>
                  <p className="text-xs text-text-secondary mt-0.5">Scholarly reviews authored by {fullName}</p>
                </div>
                <div className="text-center py-12 text-text-muted text-sm">
                  No reviews published yet.
                </div>
              </div>
            )}

            {activeTab === 'playlists' && (
              <div className="flex flex-col gap-6 transition-opacity duration-200">
                <div className="border-b border-border/60 pb-3">
                  <h2 className="font-display text-2xl font-bold text-text-primary">Curated Playlists</h2>
                  <p className="text-xs text-text-secondary mt-0.5">Synthesized codex collections grouped by theme</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="col-span-full text-center py-12 text-text-muted text-sm">
                    No playlists curated yet.
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className={`fixed bottom-8 right-8 bg-surface-container-highest border border-border text-text-primary px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 transition-all duration-300 z-50 ${toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
        <span className="text-sm font-medium">{toastMsg}</span>
      </div>
    </main>
  );
}
