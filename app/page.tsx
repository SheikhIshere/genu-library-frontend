import { books as booksApi, mediaUrl } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedCarousel from "./FeaturedCarousel";

interface Book {
  id: number;
  title: string;
  slug: string;
  author: string;
  cover_page?: string;
  price?: number;
  average_rating?: number;
  category?: string;
  description?: string;
  added_at?: string;
  is_free?: boolean;
}

interface HomeData {
  featured_books: Book[];
  recent_books: Book[];
  trending_tags: string[];
  search_suggestions: string[];
  total_books: number;
  total_users: number;
  total_reviews: number;
}

const fallbackFeatured: Book[] = [
  { id: 1, title: "The Architecture of Thought", slug: "architecture-of-thought", author: "Marcus Aurelius Sterling", cover_page: "", price: 350, average_rating: 4.9, category: "Philosophy" },
  { id: 2, title: "Chronicles of the Iron Foundry", slug: "chronicles-iron-foundry", author: "Rowan K. Blackwood", cover_page: "", price: 420, average_rating: 4.8, category: "Engineering" },
  { id: 3, title: "Illuminated Manuscripts & Glyphs", slug: "illuminated-manuscripts", author: "Elena Rostova", cover_page: "", price: 290, average_rating: 5.0, category: "Art & Design" },
  { id: 4, title: "The Astrolabe Companion", slug: "astrolabe-companion", author: "Dr. Silas Vane", cover_page: "", price: 510, average_rating: 4.7, category: "Astronomy" },
  { id: 5, title: "The Nocturnal Herbal", slug: "nocturnal-herbal", author: "Astrid Valmont", cover_page: "", price: 380, average_rating: 4.9, category: "Herbalism" },
];

const fallbackRecent: Book[] = [
  { id: 6, title: "The Book of Lost Pigments", slug: "book-lost-pigments", author: "Cecily Morrow", cover_page: "", price: 180, average_rating: 4.7, category: "Alchemy & Art", description: "An encyclopedic recreation of forgotten medieval mineral extraction recipes.", added_at: "2025-01-10T10:00:00Z" },
  { id: 7, title: "Foundational Metallurgy", slug: "foundational-metallurgy", author: "T. E. Thorne", cover_page: "", price: 310, average_rating: 4.8, category: "Craftsmanship", description: "Thermodynamic principles applied to Damascus steel and alloy tempering.", added_at: "2025-01-09T10:00:00Z" },
  { id: 8, title: "Hermetic Geometry", slug: "hermetic-geometry", author: "Julian Croft", cover_page: "", price: 240, average_rating: 4.6, category: "Sacred Math", description: "The harmonious proportions of cathedral vaulting and celestial harmonics.", added_at: "2025-01-08T10:00:00Z" },
  { id: 9, title: "Echoes of the High Library", slug: "echoes-high-library", author: "Vivienne Laurent", cover_page: "", price: 400, average_rating: 4.9, category: "Monograph", description: "Historiographical accounts of legendary lost archives across the continent.", added_at: "2025-01-07T10:00:00Z" },
  { id: 10, title: "Woodblock Printing Primer", slug: "woodblock-printing", author: "Kenji Sato", cover_page: "", price: 195, average_rating: 4.8, category: "Printmaking", description: "Step-by-step masterclass on traditional mokuhanga registration and pigment mixing.", added_at: "2025-01-06T10:00:00Z" },
  { id: 11, title: "Lexicon of Antiquity", slug: "lexicon-antiquity", author: "Prof. Alistair Vance", cover_page: "", price: 360, average_rating: 4.7, category: "Linguistics", description: "Etymological origins of classical trade argot, alchemical glyphs, and archaic idioms.", added_at: "2025-01-05T10:00:00Z" },
];

function timeAgo(dateStr?: string, referenceTime?: number): string {
  if (!dateStr) return "";
  const now = referenceTime ?? Date.now();
  const diff = now - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default async function HomePage() {
  let homeData: HomeData | null = null;
  try {
    homeData = await booksApi.home() as unknown as HomeData;
  } catch {}

  const serverTime = Date.now();
  const featured = homeData?.featured_books?.length ? homeData.featured_books : fallbackFeatured;
  const recent = homeData?.recent_books?.length ? homeData.recent_books : fallbackRecent;
  const totalBooks = homeData?.total_books ?? 28400;
  const totalUsers = homeData?.total_users ?? 14200;
  const totalReviews = homeData?.total_reviews ?? 96800;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-canvas pt-20 pb-20 md:pb-0">
        {/* HERO SECTION */}
        <section className="relative w-full overflow-hidden">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-40 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="max-w-7xl mx-auto px-margin py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-space-xl items-center">
              <div className="lg:col-span-7 flex flex-col space-y-space-lg">
                <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container border border-border w-fit">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                  <span className="font-overline text-overline uppercase tracking-wider text-secondary">The Guild Ledger &bull; Season of Fire</span>
                </div>
                <div className="space-y-space-sm">
                  <h1 className="font-display text-display-xl-mobile lg:text-display-xl text-text-primary tracking-tight leading-none">
                    Discover Your Next{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary underline decoration-primary-container/30 decoration-wavy">
                      Great Read
                    </span>
                  </h1>
                  <p className="font-body-large text-body-large text-text-secondary max-w-2xl pt-2">
                    Step into an artisan digital sanctuary. Explore rare manuscripts, classical literature, and technical
                    grimoires curated by a global fellowship of scholars and master archivists.
                  </p>
                </div>
                <div className="relative w-full max-w-2xl pt-2">
                  <div className="relative flex items-center bg-surface-container-lowest border border-border rounded-xl p-2 focus-within:border-primary-container focus-within:ring-2 focus-within:ring-primary-container/20 shadow-xl transition-all">
                    <span className="material-symbols-outlined text-text-muted text-[24px] ml-3 mr-2">travel_explore</span>
                    <input
                      className="w-full bg-transparent border-none outline-none font-body-default text-body-default text-text-primary placeholder:text-text-muted pr-4"
                      placeholder="Search by title, author, topic, or ISBN..."
                      type="text"
                    />
                    <button className="shrink-0 bg-primary-container hover:bg-primary-hover text-text-on-accent font-body-default text-body-small font-semibold px-space-md py-2.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md active:scale-95">
                      <span>Inquire</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="font-overline text-overline text-text-muted uppercase tracking-wider mr-1">Trending:</span>
                  {["All Books", "Philosophy", "Ancient History", "Grimoires", "Typography", "Alchemical Arts", "Craftsmanship"].map((tag, i) => (
                    <button
                      key={tag}
                      className={`font-body-small text-caption px-3.5 py-1 rounded-full transition-all ${
                        i === 0
                          ? "bg-primary-container/15 text-primary border border-primary-container hover:bg-primary-container/25"
                          : "bg-surface-container text-text-secondary border border-border hover:border-text-muted hover:text-text-primary"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] lg:min-h-[460px]">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <svg className="w-[380px] h-[380px] text-primary" fill="none" viewBox="0 0 380 380">
                    <circle className="animate-[spin_60s_linear_infinite]" cx="190" cy="190" r="170" stroke="currentColor" strokeDasharray="4 8" strokeWidth="1" />
                    <circle className="animate-[spin_40s_linear_infinite_reverse]" cx="190" cy="190" r="130" stroke="currentColor" strokeDasharray="2 6" strokeWidth="1.5" />
                    <circle cx="190" cy="190" r="85" stroke="currentColor" strokeWidth="0.75" />
                    <path d="M 190 20 L 190 360 M 20 190 L 360 190" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" />
                  </svg>
                </div>
                <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
                  <div className="w-64 sm:w-72 h-14 bg-surface-container-highest border border-border rounded-lg shadow-2xl transform rotate-3 translate-y-6 flex items-center px-4 justify-between transition-transform duration-300 hover:rotate-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-7 bg-outline rounded-full" />
                      <span className="font-overline text-overline text-text-muted">VOL. III &bull; METALLURGY</span>
                    </div>
                    <span className="font-label-mono text-overline text-outline">FOLIO-09</span>
                  </div>
                  <div className="w-68 sm:w-80 h-16 bg-surface-container border border-border rounded-lg shadow-2xl transform -rotate-2 translate-y-3 flex items-center px-5 justify-between transition-transform duration-300 hover:-rotate-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-8 bg-secondary rounded-full" />
                      <span className="font-display text-headline-3 text-secondary font-semibold tracking-tight text-sm">Philosophia Naturalis</span>
                    </div>
                    <span className="font-label-mono text-caption text-secondary">🪙 480</span>
                  </div>
                  <div className="w-72 sm:w-84 bg-surface border border-primary-container/40 rounded-xl p-space-md shadow-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] group">
                    <div className="absolute -top-6 -right-6 w-14 h-14 bg-primary-container/15 rounded-full border border-primary-container/40 flex items-end justify-start p-1.5">
                      <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                    </div>
                    <div className="flex gap-space-md items-start">
                      <div className="w-20 h-28 shrink-0 rounded-lg overflow-hidden border border-border relative bg-surface-container-highest">
                        <img className="w-full h-full object-cover" alt="Featured book" src={mediaUrl(featured[0]?.cover_page)} />
                        <div className="absolute inset-0 bg-gradient-to-t from-canvas/90 via-transparent to-transparent" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="font-overline text-overline text-primary uppercase tracking-wider">Tome of the Week</span>
                        <h3 className="font-display text-headline-3 text-text-primary leading-tight truncate">{featured[0]?.title ?? "De Sphaera Mundi"}</h3>
                        <p className="font-caption text-caption text-text-secondary">{featured[0]?.author ?? "Johannes de Sacrobosco"}</p>
                        <div className="pt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-secondary">
                            <span className="text-sm">🪙</span>
                            <span className="font-label-mono text-label-mono font-semibold text-secondary">{featured[0]?.price ?? 540}</span>
                          </div>
                          <div className="flex items-center text-status-warning text-caption gap-0.5">
                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="font-label-mono text-caption text-text-primary">{featured[0]?.average_rating?.toFixed(2) ?? "4.95"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-caption font-body-small text-text-muted">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-success" /> Available in Sanctum
                      </span>
                      <span className="font-label-mono text-overline text-primary">EDITION #042</span>
                    </div>
                  </div>
                  <div className="w-3/4 h-3 bg-gradient-to-r from-transparent via-primary-container/30 to-transparent blur-sm mt-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS COUNTER BAR */}
        <section className="w-full bg-surface-container-low border-y border-border relative py-8">
          <div className="max-w-7xl mx-auto px-margin">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter lg:gap-space-xl divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="flex items-center gap-space-md py-4 md:py-0 md:px-space-md group">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center border border-border text-primary group-hover:border-primary transition-colors shrink-0">
                  <span className="material-symbols-outlined text-[26px]">library_books</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-label-mono text-headline-1 font-bold text-text-primary tracking-tight">
                      {totalBooks >= 1000 ? `${(totalBooks / 1000).toFixed(1)}K` : totalBooks}
                    </span>
                    <span className="font-label-mono text-caption text-primary font-medium">+184</span>
                  </div>
                  <p className="font-body-small text-caption text-text-secondary uppercase font-medium tracking-wider">Total Bound Folios &amp; Codices</p>
                </div>
              </div>
              <div className="flex items-center gap-space-md py-4 md:py-0 md:px-space-md group">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center border border-border text-secondary group-hover:border-secondary transition-colors shrink-0">
                  <span className="material-symbols-outlined text-[26px]">local_library</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-label-mono text-headline-1 font-bold text-text-primary tracking-tight">
                      {totalUsers >= 1000 ? `${(totalUsers / 1000).toFixed(1)}K` : totalUsers}
                    </span>
                    <span className="font-label-mono text-caption text-status-success font-medium">Online</span>
                  </div>
                  <p className="font-body-small text-caption text-text-secondary uppercase font-medium tracking-wider">Guild Scholars &amp; Archivists</p>
                </div>
              </div>
              <div className="flex items-center gap-space-md py-4 md:py-0 md:px-space-md group">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center border border-border text-primary-container group-hover:border-primary-container transition-colors shrink-0">
                  <span className="material-symbols-outlined text-[26px]">rate_review</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-label-mono text-headline-1 font-bold text-text-primary tracking-tight">
                      {totalReviews >= 1000 ? `${(totalReviews / 1000).toFixed(1)}K` : totalReviews}
                    </span>
                    <span className="font-label-mono text-caption text-secondary font-medium">99.4% Ver.</span>
                  </div>
                  <p className="font-body-small text-caption text-text-secondary uppercase font-medium tracking-wider">Critical Annotations &amp; Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED COLLECTION SECTION */}
        <section className="w-full py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-margin space-y-space-lg">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md pb-2 border-b border-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-[18px]">auto_stories</span>
                  <span className="font-overline text-overline text-primary uppercase tracking-wider">Curated Sanctum Selection</span>
                </div>
                <h2 className="font-display text-headline-1 text-text-primary">Featured Collection</h2>
              </div>
              <div className="flex items-center gap-space-md">
                <span className="font-body-default text-body-small text-text-secondary flex items-center gap-1">
                  <span>View All ({featured.length})</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                </span>
              </div>
            </div>
            <FeaturedCarousel books={featured} />
          </div>
        </section>

        {/* RECENTLY ADDED SECTION */}
        <section className="w-full py-16 bg-surface-dim border-t border-border">
          <div className="max-w-7xl mx-auto px-margin space-y-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-2 border-b border-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-secondary text-[18px]">update</span>
                  <span className="font-overline text-overline text-secondary uppercase tracking-wider">Sanctum Ingest Stream</span>
                </div>
                <h2 className="font-display text-headline-1 text-text-primary">Recently Added</h2>
              </div>
              <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-border self-start md:self-auto overflow-x-auto">
                {["All", "New Releases", "Community Uploads", "Rare Editions"].map((tab, i) => (
                  <button
                    key={tab}
                    className={`px-3 py-1.5 rounded-md font-body-small text-caption font-medium transition-colors ${
                      i === 0
                        ? "bg-primary-container text-text-on-accent"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {recent.map((book) => (
                <div
                  key={book.id}
                  className="bg-surface border border-border rounded-xl p-space-md flex flex-col justify-between hover:border-border-hover hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(232,105,63,0.1)] transition-all duration-300 group"
                >
                  <div className="flex gap-space-md items-start">
                    <div className="w-20 h-28 rounded-lg overflow-hidden bg-surface-container shrink-0 border border-border">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        alt={book.title}
                        src={mediaUrl(book.cover_page)}
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-overline text-overline text-status-warning uppercase">{book.category}</span>
                        <span className="font-caption text-caption text-text-muted">{timeAgo(book.added_at, serverTime)}</span>
                      </div>
                      <h3 className="font-display text-headline-3 text-text-primary group-hover:text-primary transition-colors truncate">
                        {book.title}
                      </h3>
                      <p className="font-body-small text-caption text-text-secondary truncate">{book.author}</p>
                      {book.description && (
                        <p className="font-caption text-caption text-text-muted line-clamp-2 pt-1">{book.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="pt-space-sm mt-3 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-secondary text-xs">🪙</span>
                      <span className="font-label-mono text-label-mono font-medium text-secondary">{book.price ?? 0}</span>
                    </div>
                    <span className="font-body-small text-caption text-primary hover:text-primary-hover flex items-center gap-1">
                      <span>Read Folio</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="w-full py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-margin">
            <div className="relative bg-surface rounded-2xl border border-border p-8 md:p-14 lg:p-16 overflow-hidden shadow-2xl">
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary-container/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 -right-10 -translate-y-1/2 opacity-5 pointer-events-none text-primary">
                <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 100 100">
                  <path d="M50 0 L60 35 L95 20 L75 50 L100 70 L65 75 L50 100 L35 75 L0 70 L25 50 L5 20 L40 35 Z" />
                </svg>
              </div>
              <div className="relative z-10 max-w-2xl space-y-space-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/15 border border-primary-container/30 text-primary">
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  <span className="font-overline text-overline uppercase tracking-wider">Archivist Concordat</span>
                </div>
                <h2 className="font-display text-display-mobile md:text-display text-text-primary tracking-tight">
                  Share Your Knowledge With the Guild
                </h2>
                <p className="font-body-large text-body-default md:text-body-large text-text-secondary leading-relaxed">
                  Have you unearthed rare texts, penned a masterwork treatise, or digitized fragile out-of-print prints?
                  Immortalize your contributions within the immutable ledger and earn Guild patronage tokens from fellow
                  readers worldwide.
                </p>
                <div className="flex flex-wrap items-center gap-space-md pt-4">
                  <a
                    href="/upload"
                    className="bg-primary-container hover:bg-primary-hover text-text-on-accent font-body-default text-body-default font-semibold px-space-lg py-3 rounded-lg flex items-center gap-2 shadow-lg transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                    <span>Start Uploading</span>
                  </a>
                  <a
                    href="/books"
                    className="bg-transparent hover:bg-surface-container border border-border hover:border-primary text-text-primary font-body-default text-body-default font-medium px-space-lg py-3 rounded-lg flex items-center gap-2 transition-all"
                  >
                    <span>Browse All Books</span>
                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  </a>
                </div>
                <div className="pt-6 border-t border-border/80 grid grid-cols-1 sm:grid-cols-3 gap-space-sm text-text-muted font-caption text-caption">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-status-success text-[16px]">check_circle</span>
                    <span>Decentralized Archiving</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-status-success text-[16px]">check_circle</span>
                    <span>Token Patronage Splits</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-status-success text-[16px]">check_circle</span>
                    <span>OCR &amp; Translation Engine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
