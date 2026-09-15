import { books } from '@/lib/api';
import BookDetailClient from './BookDetailClient';
import { notFound } from 'next/navigation';

export default async function BookDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const book = await books.detail(slug).catch(() => null);
  if (!book) notFound();

  return <BookDetailClient book={book} />;
}
