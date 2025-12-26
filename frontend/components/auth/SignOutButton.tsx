'use client';

import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function SignOutButton() {
  const { signOut, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out!');
    } catch (error) {
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
