import { profile } from '@/lib/api';
import { notFound } from 'next/navigation';
import ProfileClient from './ProfileClient';

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const userData = await profile.detail(params.username).catch(() => null) as Record<string, unknown> | null;
  if (!userData) notFound();

  return <ProfileClient userData={userData} />;
}
