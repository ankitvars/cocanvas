import { auth, signOut } from '../../auth';
import { getBoards } from '../actions/board';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const res = await getBoards();
  const initialBoards = res.success && res.boards ? res.boards : [];

  // Wrap signOut in a server action function
  const handleSignOut = async () => {
    'use server';
    await signOut({ redirectTo: '/' });
  };

  return (
    <DashboardClient
      initialBoards={initialBoards as any}
      user={session.user}
      signOutAction={handleSignOut}
    />
  );
}
