'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function SignOutButton() {
  const { signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Success toast is shown in AuthContext
      // Navigate to signin page
      router.push('/auth/signin');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to sign out';
      console.error('Sign-out error:', errorMsg);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="btn btn-outline"
    >
      Sign Out
    </button>
  );
}
