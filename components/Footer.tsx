import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-border mt-space-xl">
      <div className="max-w-7xl mx-auto px-margin py-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl">
          <div className="lg:col-span-2 space-y-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center border border-border">
                <span className="material-symbols-outlined text-primary text-[18px]">local_fire_department</span>
              </div>
              <span className="font-display text-headline-3 font-semibold text-text-primary">Genu Library</span>
            </div>
            <p className="font-body-default text-body-small text-text-secondary max-w-sm">
              An artisan guild repository and deluxe reading sanctum curated for digital archivists, scholars, and
              craftspeople safeguarding rare manuscripts and auditory codices.
            </p>
            <div className="flex items-center gap-space-sm text-text-muted">
              <Link className="w-9 h-9 rounded-lg bg-surface-container border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px]">terminal</span>
              </Link>
              <Link className="w-9 h-9 rounded-lg bg-surface-container border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px]">share</span>
              </Link>
              <Link className="w-9 h-9 rounded-lg bg-surface-container border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px]">hub</span>
              </Link>
            </div>
          </div>
          <div className="space-y-space-sm">
            <h4 className="font-overline text-overline uppercase text-text-muted tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              <li className="list-none">
                <Link className="font-body-small text-body-small text-text-secondary hover:text-text-primary transition-colors" href="/">Home</Link>
              </li>
              <li className="list-none">
                <Link className="font-body-small text-body-small text-text-secondary hover:text-text-primary transition-colors" href="/books">Books Catalog</Link>
              </li>
              <li className="list-none">
                <Link className="font-body-small text-body-small text-text-secondary hover:text-text-primary transition-colors" href="/playlists">Auditory Playlists</Link>
              </li>
              <li className="list-none">
                <Link className="font-body-small text-body-small text-text-secondary hover:text-text-primary transition-colors" href="/upload">Upload Folio</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-space-sm">
            <h4 className="font-overline text-overline uppercase text-text-muted tracking-wider">Guild Archive</h4>
            <ul className="space-y-2">
              <li className="list-none">
                <Link className="font-body-small text-body-small text-text-secondary hover:text-text-primary transition-colors" href="#">Guild Concordat</Link>
              </li>
              <li className="list-none">
                <Link className="font-body-small text-body-small text-text-secondary hover:text-text-primary transition-colors" href="#">Ledger Rarity</Link>
              </li>
              <li className="list-none">
                <Link className="font-body-small text-body-small text-text-secondary hover:text-text-primary transition-colors" href="#">Archivist API</Link>
              </li>
              <li className="list-none">
                <Link className="font-body-small text-body-small text-text-secondary hover:text-text-primary transition-colors" href="#">Terms of Preservation</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-space-md">
            <h4 className="font-overline text-overline uppercase text-text-muted tracking-wider">The Monthly Dispatch</h4>
            <p className="font-body-small text-body-small text-text-secondary">
              Receive curated codex summaries and ledger updates directly to your station.
            </p>
            <form className="space-y-2">
              <div className="flex flex-col gap-2">
                <input
                  className="w-full bg-canvas border border-border rounded-lg px-space-sm py-2 font-body-small text-body-small text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors"
                  placeholder="archivist@guild.internal"
                  type="email"
                />
                <button
                  className="w-full bg-primary text-text-on-accent font-body-default text-body-small font-semibold px-space-md py-2 rounded-lg hover:bg-primary-hover transition-colors"
                  type="button"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="border-t border-border mt-space-xl pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm">
          <p className="font-body-small text-caption text-text-muted">
            &copy; 2025 Genu Library Guild. All rights reserved under the Sovereign Archives.
          </p>
          <div className="flex items-center gap-space-md font-body-small text-caption text-text-muted">
            <Link className="hover:text-text-secondary transition-colors" href="#">Sanctum Privacy</Link>
            <Link className="hover:text-text-secondary transition-colors" href="#">Ledger Index</Link>
            <Link className="hover:text-text-secondary transition-colors" href="#">Status Core</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
