'use client';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';

function SessionSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      localStorage.setItem('cocanvas_logged_in', 'true');
    } else if (status === 'unauthenticated') {
      localStorage.removeItem('cocanvas_logged_in');
    }
  }, [session, status]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
    </SessionProvider>
  );
}
