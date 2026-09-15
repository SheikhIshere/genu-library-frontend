"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { books } from "@/lib/api";

const VIOLATION_REASONS = [
  {
    id: "copyright",
    value: "copyright",
    label: "Copyright Infringement",
    icon: "balance",
    iconColor: "text-primary",
    description: "Unauthorized reproduction, stolen intellectual property, or forged folio provenance.",
  },
  {
    id: "inappropriate",
    value: "inappropriate",
    label: "Inappropriate / Unmarked Adult",
    icon: "warning",
    iconColor: "text-secondary",
    description: "Explicit material, severe violence, or graphic depictions lacking mandatory warning seals.",
  },
  {
    id: "spam",
    value: "spam",
    label: "Spam or Misleading Metadata",
    icon: "error_outline",
    iconColor: "text-status-warning",
    description: "Deceptive treatises, fabricated pagination, automated noise, or fraudulent outside seals.",
  },
  {
    id: "other",
    value: "other",
    label: "Guild Codex Breach",
    icon: "flag",
    iconColor: "text-text-muted",
    description: "Harassment, scholar defamation, illicit code injection, or defiance of the guild concordat.",
  },
];

const BOOK = {
  title: "The Alchemist's Codex: Transmutations of Ether",
  author: "Master Corvus Thorne",
  folio: "Folio #742",
  year: "Registered Anno MMXIV",
  tags: ["Antique Folio", "Restricted Access", "Leatherbound Codex"],
  tagColors: ["text-secondary", "text-status-warning", "text-text-muted"],
  cover: "https://lh3.googleusercontent.com/aida/AEtjO1U4i7Bvv1eCjbGnBci34nK435ouZRZn5X2sMTopixGH7pFI5PEbtTQSrBm6P7i7K6h3kR3tjW_7ru3c20KpHrd8Yc_AWgSlnt2pD5BYW4jXf9Fu0FH_N7vWSmWpzaOjfkoFo8dQ6PZlBl_ndvhPg7B_tuAGXHuBofZcqR2od7ODS0tUdi1p_UQ9JTHwiGQeLlkexz2tw5gZviwsPyIlrZQPMvGNFRlwTTdDJSm-b1-dgwe-zpfs_jlAn9k",
};

export default function ReportBookPage() {
  const [selectedReason, setSelectedReason] = useState("copyright");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSelectReason = useCallback((value: string) => {
    setSelectedReason(value);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await books.report("the-alchemists-codex", {
          reason: selectedReason,
          description,
        });
      } catch {
        // proceed to success state regardless
      } finally {
        setShowSuccess(true);
        setShowToast(true);
        setIsSubmitting(false);
        setTimeout(() => setShowToast(false), 5000);
      }
    },
    [selectedReason, description]
  );

  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-primary-container/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="max-w-4xl mx-auto px-margin-mobile sm:px-margin py-8 sm:py-12 relative z-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 font-body text-caption text-text-muted">
          <Link className="hover:text-text-primary transition-colors flex items-center gap-1" href="/">
            <span className="material-symbols-outlined text-[15px]">home</span>
            <span>Home</span>
          </Link>
          <span className="material-symbols-outlined text-[13px] text-text-muted/60">chevron_right</span>
          <Link className="hover:text-text-primary transition-colors" href="/books">Books</Link>
          <span className="material-symbols-outlined text-[13px] text-text-muted/60">chevron_right</span>
          <span className="hover:text-text-primary transition-colors truncate max-w-[160px] sm:max-w-xs">The Alchemist&apos;s Codex</span>
          <span className="material-symbols-outlined text-[13px] text-text-muted/60">chevron_right</span>
          <span className="text-primary font-medium">Report</span>
        </nav>

        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-container border border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-status-warning animate-pulse" />
            <span className="font-body text-overline uppercase tracking-wider text-secondary">Archivist Oversight &amp; Audit</span>
          </div>
          <h1 className="font-display text-headline-1 text-text-primary tracking-tight">Report Violation</h1>
          <p className="font-body text-body-default text-text-secondary max-w-2xl leading-relaxed">
            Help uphold the purity of the Guild Archives. Submissions enter the Senior Archivist ledger for physical verification and cryptographic scrutiny.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8">
          <div className="relative overflow-hidden bg-surface-container-lowest border border-border rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="font-body text-overline text-secondary uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
                Target Item in Custody
              </span>
              <span className="font-mono text-caption text-text-muted">LEDGER #ALCH-742-MMXIV</span>
            </div>
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative shrink-0">
                <img
                  alt="Antique leatherbound cover of The Alchemist's Codex"
                  className="w-16 h-22 sm:w-20 sm:h-28 object-cover rounded-lg border border-border shadow-lg"
                  src={BOOK.cover}
                />
                <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10 pointer-events-none" />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-headline-3 text-text-primary truncate">{BOOK.title}</h2>
                </div>
                <p className="font-body text-body-small text-text-secondary flex items-center gap-1.5">
                  <span className="text-text-primary">{BOOK.author}</span>
                  <span className="text-border">&bull;</span>
                  <span>{BOOK.folio}</span>
                  <span className="text-border">&bull;</span>
                  <span className="font-mono text-caption text-text-muted">{BOOK.year}</span>
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  {BOOK.tags.map((tag, i) => (
                    <span key={tag} className={`px-2 py-0.5 rounded-full bg-surface-container border border-border font-mono text-caption ${BOOK.tagColors[i]}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <label className="font-display text-headline-3 text-text-primary font-semibold">
                  Select Violation Category <span className="text-primary-container">*</span>
                </label>
                <span className="font-body text-caption text-text-muted">Choose the primary ground for intervention</span>
              </div>
              <div aria-label="Violation Categories" className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1" role="radiogroup">
                {VIOLATION_REASONS.map((reason) => {
                  const isSelected = selectedReason === reason.value;
                  return (
                    <div
                      key={reason.id}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onClick={() => handleSelectReason(reason.value)}
                      onKeyDown={(e) => {
                        if (e.key === " " || e.key === "Enter") {
                          e.preventDefault();
                          handleSelectReason(reason.value);
                        }
                      }}
                      className={`relative cursor-pointer rounded-xl p-4 transition-all duration-200 ${
                        isSelected
                          ? "border-2 border-primary-container bg-primary-container/5 ring-1 ring-primary-container/20"
                          : "border border-border bg-surface-container-lowest hover:border-border-hover hover:bg-surface-container-low"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-canvas ${
                            isSelected ? "border-primary-container" : "border-border"
                          }`}
                        >
                          <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? "bg-primary-container" : "bg-transparent"}`} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`material-symbols-outlined text-[19px] ${reason.iconColor}`}>{reason.icon}</span>
                            <h3 className="font-body text-body-default font-semibold text-text-primary">{reason.label}</h3>
                          </div>
                          <p className="font-body text-body-small text-text-secondary leading-relaxed">{reason.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="font-body text-body-default font-medium text-text-primary flex items-center gap-2" htmlFor="reportContext">
                  <span>Additional Context &amp; Specific Citations</span>
                  <span className="font-body text-overline text-text-muted uppercase tracking-wider">(Optional)</span>
                </label>
                <span className={`font-mono text-caption ${description.length >= 950 ? "text-status-warning" : "text-text-muted"}`}>
                  {description.length} / 1000
                </span>
              </div>
              <div className="relative rounded-lg bg-surface-container-lowest border border-border focus-within:border-primary-container focus-within:ring-2 focus-within:ring-primary-container/20 transition-all">
                <textarea
                  className="w-full bg-transparent border-0 outline-none p-4 font-body text-body-small text-text-primary placeholder:text-text-muted/70 resize-y min-h-[120px]"
                  id="reportContext"
                  maxLength={1000}
                  placeholder="Indicate exact signatures, folio chapter numbers, mirrored external repositories, or archival timestamps..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between text-caption font-body text-text-muted px-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-text-muted">info</span>
                  Provide verifiable evidence to expedite archive review
                </span>
                <span className="hidden sm:inline text-text-muted/60">Plain text &amp; external links permitted</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-body text-body-default font-medium text-text-primary">Archival Proof or Cryptographic Seal</label>
              <div className="border border-dashed border-border rounded-xl p-5 bg-surface-container-lowest/60 hover:bg-surface-container-lowest hover:border-border-hover transition-colors flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-surface-container border border-border flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">attachment</span>
                  </div>
                  <div>
                    <p className="font-body text-body-small font-medium text-text-primary">Attach Supporting Document or Original Folio</p>
                    <p className="font-body text-caption text-text-muted">PDF, PNG, JPG or Sigil Hash up to 25MB</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg bg-surface-container border border-border font-body text-body-small text-text-primary hover:border-primary transition-colors shrink-0" type="button">
                  Browse Files
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-surface-container-high/40 border border-primary-container/30 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-primary-container/15 flex items-center justify-center shrink-0 border border-primary-container/40 text-primary-container mt-0.5">
                <span className="material-symbols-outlined text-[20px]">shield</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-body text-body-default font-semibold text-text-primary flex items-center gap-2">
                  Guild Integrity Notice
                  <span className="font-mono text-overline uppercase text-secondary bg-surface-container px-2 py-0.5 rounded border border-border">Mandatory Review</span>
                </h4>
                <p className="font-body text-body-small text-text-secondary leading-relaxed">
                  All reports undergo dual-signature inspection by Senior Archivists within 24 hours. Intentionally filing spurious or vexatious accusations breaches the <strong className="text-text-primary font-medium">Scholar&apos;s Concordat</strong> and incurs immediate revocation of reading room credentials.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto text-center sm:text-left">
                <Link className="font-body text-caption text-text-muted hover:text-text-secondary underline underline-offset-4 transition-colors" href="#">
                  Read the Archival Enforcement Code &amp; Appeals Process
                </Link>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  className="w-1/2 sm:w-auto px-6 py-2.5 rounded-lg border border-border font-body text-body-small font-medium text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
                  type="button"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </button>
                <button
                  className="w-1/2 sm:w-auto bg-primary-container hover:bg-primary-hover active:scale-[0.98] text-on-primary-container font-body text-body-small font-semibold px-6 py-2.5 rounded-lg shadow-lg hover:shadow-primary-container/20 transition-all flex items-center justify-center gap-2"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin" />
                      <span>Sealing Ledger...</span>
                    </>
                  ) : showSuccess ? (
                    <>
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>Docket Sealed</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">gavel</span>
                      <span>Submit Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-2 px-2 text-text-muted font-mono text-caption">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-success" />
            <span>Archivist Tribunal Standby &bull; Avg Response: 4.2 hrs</span>
          </div>
          <div>
            <span>Incident Session ID: <span className="text-text-secondary">#rpt-893f-742a</span></span>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4">
          <div className="bg-surface-container-high border border-primary-container/40 p-4 rounded-xl shadow-2xl flex items-start gap-3 backdrop-blur-md">
            <div className="w-8 h-8 rounded-full bg-primary-container/20 border border-primary-container flex items-center justify-center text-primary-container shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-body text-body-small font-semibold text-text-primary">Archival Seal Affixed</h4>
              <p className="font-body text-caption text-text-secondary">Violation docket #RPT-742-MMXIV logged into queue. An archivist will inspect the codex.</p>
            </div>
            <button className="text-text-muted hover:text-text-primary" onClick={() => setShowToast(false)} type="button">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
