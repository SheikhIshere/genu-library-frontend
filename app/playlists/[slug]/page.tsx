import { books } from '@/lib/api';
import PlaylistDetailClient from './PlaylistDetailClient';
import { notFound } from 'next/navigation';

export default async function PlaylistDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const playlist = await books.playlistDetail(slug).catch(() => null) as Record<string, unknown> | null;
  if (!playlist) notFound();

  return <PlaylistDetailClient playlist={playlist} />;
}
