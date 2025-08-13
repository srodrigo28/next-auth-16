import { redirect } from 'next/navigation';
import { getUserProfile } from '../actions/profile';
import Header from './Header';
import ProfileSection from './ProfileSection';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { user, profile } = await getUserProfile();

  if (!user || !profile) {
    redirect('/login?message=Perfil não encontrado.');
  }

  return (
    <>
      <Header userEmail={user.email} />
      <main className="container mx-auto p-8">
        <ProfileSection profile={profile} />
      </main>
    </>
  );
}
