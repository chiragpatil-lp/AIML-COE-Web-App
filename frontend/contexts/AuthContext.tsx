'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import type { AuthContextType, UserPermissions } from '@/lib/types/auth.types';

const AuthContext = createContext<AuthContextType>({
  user: null,
  permissions: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  hasAccessToPillar: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user permissions from Firestore
  const fetchPermissions = async (userId: string, userEmail: string) => {
    if (!db) {
      console.error('Firestore is not initialized');
      return;
    }
    try {
      const permissionsRef = doc(db, 'userPermissions', userId);
      const permissionsSnap = await getDoc(permissionsRef);

      if (permissionsSnap.exists()) {
        const data = permissionsSnap.data();
        // Convert Firestore timestamps to Date objects
        setPermissions({
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UserPermissions);
      } else {
        // Create default permissions for new user
        const defaultPermissions: UserPermissions = {
          userId,
          email: userEmail,
          isAdmin: false,
          pillars: {
            pillar1: false,
            pillar2: false,
            pillar3: false,
            pillar4: false,
            pillar5: false,
            pillar6: false,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(permissionsRef, defaultPermissions);
        setPermissions(defaultPermissions);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    if (!auth) {
      // If auth is not initialized, set loading to false after mount
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchPermissions(user.uid, user.email || '');
      } else {
        setPermissions(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized. Please check your environment variables.');
    }
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const hasAccessToPillar = (pillarNumber: number): boolean => {
    if (!permissions) return false;
    if (permissions.isAdmin) return true;
    const pillarKey = `pillar${pillarNumber}` as keyof typeof permissions.pillars;
    return permissions.pillars[pillarKey] || false;
  };

  const value: AuthContextType = {
    user,
    permissions,
    loading,
    signInWithGoogle,
    signOut,
    hasAccessToPillar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
