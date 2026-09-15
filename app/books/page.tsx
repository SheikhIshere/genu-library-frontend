import { books } from '@/lib/api';
import BookListClient from './BookListClient';

export const dynamic = 'force-dynamic';

interface BookItem {
  slug: string;
  title: string;
  author: string;
  cover_page: string | null;
  price: number;
  average_rating: number;
  total_favorites: number;
  tag: string[];
  uploader?: string;
}

export default async function BooksPage() {
  const data = await books.list().catch(() => [] as Record<string, unknown>[]);

  const results = Array.isArray(data) ? data : [];

  const items: BookItem[] = results.map((r) => ({
    slug: (r?.slug as string) || '',
    title: (r?.title as string) || 'Untitled',
    author: (r?.author as string) || 'Unknown',
    cover_page: (r?.cover_page as string) || null,
    price: (r?.price as number) || 0,
    average_rating: (r?.average_rating as number) || 0,
    total_favorites: (r?.total_favorites as number) || 0,
    tag: Array.isArray(r?.tag) ? (r.tag as Array<{name: string}>).map(t => t.name) : [],
    uploader: (r?.uploader && typeof r.uploader === 'object' ? (r.uploader as {username: string}).username : undefined) || (typeof r?.uploader === 'string' ? r.uploader : undefined),
  }));

  return <BookListClient books={items} totalCount={items.length} />;
}