/**
 * Quick script to fix admin permissions for chirag.patil@onixnet.com
 * Run with: node fix-admin.js
 */

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize with project ID
admin.initializeApp({
  projectId: 'search-ahmed'
});

const db = getFirestore('aiml-coe-web-app');

async function fixAdminPermissions() {
  const email = 'chirag.patil@onixnet.com';
  const uid = 'I1MmPgyzZwaij1mH3aAgPHwvk8c2';

  console.log('Starting admin permission fix...\n');

  try {
    // Step 1: Check if old email-based document exists
    console.log('Step 1: Checking for old email-based document...');
    const oldDoc = await db.collection('userPermissions').doc(email).get();

    if (oldDoc.exists) {
      console.log('✓ Found old document:', email);
      console.log('  Data:', JSON.stringify(oldDoc.data(), null, 2));
    } else {
      console.log('  No old email-based document found');
    }

    // Step 2: Create new UID-based document
    console.log('\nStep 2: Creating new UID-based document...');
    await db.collection('userPermissions').doc(uid).set({
      userId: uid,
      email: email.toLowerCase(),
      isAdmin: true,
      pillars: {
        pillar1: true,
        pillar2: false,
        pillar3: false,
        pillar4: false,
        pillar5: false,
        pillar6: false,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('✓ Created new document with UID:', uid);

    // Step 3: Set admin custom claim
    console.log('\nStep 3: Setting admin custom claim...');
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log('✓ Admin custom claim set for user');

    // Step 4: Delete old email-based document if it exists
    if (oldDoc.exists) {
      console.log('\nStep 4: Deleting old email-based document...');
      await db.collection('userPermissions').doc(email).delete();
      console.log('✓ Deleted old document:', email);
    }

    console.log('\n✅ SUCCESS! Admin permissions fixed for', email);
    console.log('\nNext steps:');
    console.log('1. Sign out of the application');
    console.log('2. Sign in again');
    console.log('3. You should now have full admin access!\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the fix
fixAdminPermissions();
