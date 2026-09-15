import { books } from '@/lib/api';
import PlaylistListClient from './PlaylistListClient';

interface PlaylistItem {
  slug: string;
  title: string;
  description: string;
  cover_image: string | null;
  books_count: number;
  creator_name: string;
  created_at: string;
}

export default async function PlaylistsPage() {
  const data = await books
    .playlists()
    .catch(() => [] as Record<string, unknown>[]);

  const items: PlaylistItem[] = (Array.isArray(data) ? data : []).map((r: Record<string, unknown>) => ({
    slug: (r.slug as string) || '',
    title: (r.title as string) || 'Untitled',
    description: (r.description as string) || '',
    cover_image: (r.cover_image as string) || null,
    books_count: (r.books_count as number) || (Array.isArray(r.books) ? (r.books as unknown[]).length : 0),
    creator_name: (r.creator_name as string) || (r.created_by as string) || 'Archivist',
    created_at: (r.created_at as string) || '',
  }));

  return <PlaylistListClient playlists={items} />;
}
