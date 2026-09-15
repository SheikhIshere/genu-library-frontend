import { profile } from '@/lib/api';
import ProfileEditClient from './ProfileEditClient';

export default async function EditProfilePage() {
  const userData = await profile.me().catch(() => null) as Record<string, unknown> | null;

  return <ProfileEditClient userData={userData} />;
}
