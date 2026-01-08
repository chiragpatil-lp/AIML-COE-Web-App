/**
 * Firebase Cloud Functions for AIML COE Web App (Gen 2)
 * 
 * This file contains ONLY the essential Cloud Functions that cannot be replaced
 * by Next.js API routes:
 * 
 * - onUserCreate: Identity trigger that runs when a new user signs up
 * 
 * All admin operations (setAdminClaim, updateUserPermissions, etc.) have been
 * migrated to Next.js API routes to avoid CORS issues and improve performance.
 */

import { beforeUserCreated } from 'firebase-functions/v2/identity';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize Firestore with named database
const db = getFirestore(admin.app(), 'aiml-coe-web-app');

interface UserPermissions {
  userId: string;
  email: string;
  isAdmin: boolean;
  pillars: {
    pillar1: boolean;
    pillar2: boolean;
    pillar3: boolean;
    pillar4: boolean;
    pillar5: boolean;
    pillar6: boolean;
  };
  createdAt: admin.firestore.FieldValue;
  updatedAt: admin.firestore.FieldValue;
}

/**
 * Triggered when a new user signs up
 * Creates default user permissions in Firestore
 * 
 * This is an Identity Trigger and MUST remain a Cloud Function because:
 * - It runs automatically when Firebase Auth creates a new user
 * - Cannot be triggered from client-side or API routes
 * - Ensures every user has permissions set up immediately upon account creation
 */
export const onUserCreate = beforeUserCreated(async (event) => {
  const user = event.data;
  
  if (!user) {
    console.error('User data not available');
    return;
  }

  const { uid, email } = user;

  if (!email) {
    console.error('User created without email:', uid);
    return;
  }

  try {
    // Check for pending permissions by email before creating defaults
    const pendingQuery = await db.collection('userPermissions')
      .where('email', '==', email.toLowerCase())
      .where('isPending', '==', true)
      .limit(1)
      .get();

    if (!pendingQuery.empty) {
      const pendingDoc = pendingQuery.docs[0];
      const pendingData = pendingDoc.data();
      const defaultPermissions: UserPermissions = {
        userId: uid,
        email,
        isAdmin: pendingData.isAdmin || false,
        pillars: pendingData.pillars,
        createdAt: pendingData.createdAt || admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      
      await db.collection('userPermissions').doc(uid).set(defaultPermissions);
      await pendingDoc.ref.delete(); // Clean up pending document
      
      console.log('Created user permissions from pending record:', {
        uid,
        email,
        originalPendingId: pendingDoc.id
      });
      return;
    }

    const defaultPermissions: UserPermissions = {
      userId: uid,
      email,
      isAdmin: false,
      pillars: {
        pillar1: false,
        pillar2: false,
        pillar3: false,
        pillar4: false,
        pillar5: false,
        pillar6: false,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('userPermissions').doc(uid).set(defaultPermissions);

    console.log('Created default permissions for user:', {
      uid,
      email,
    });
  } catch (error) {
    console.error('Error creating user permissions:', error);
    throw error;
  }
});
