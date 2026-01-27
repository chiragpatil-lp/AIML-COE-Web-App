/**
 * Generic script to fix admin permissions for any user
 * Usage: node fix-admin.js <email> <uid>
 * Example: node fix-admin.js user@example.com abc123xyz456
 */

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Get email and UID from command-line arguments
const email = process.argv[2];
const uid = process.argv[3];

// Validate arguments
if (!email || !uid) {
  console.error('ERROR: Missing required arguments');
  console.error('\nUsage: node fix-admin.js <email> <uid>');
  console.error('Example: node fix-admin.js user@example.com abc123xyz456\n');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('ERROR: Invalid email format');
  console.error('Please provide a valid email address\n');
  process.exit(1);
}

// Initialize with project ID
admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID || 'search-ahmed'
});

const db = getFirestore('aiml-coe-web-app');

async function fixAdminPermissions() {

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

    console.log('\nSUCCESS! Admin permissions fixed for', email);
    console.log('\nNext steps:');
    console.log('1. Sign out of the application');
    console.log('2. Sign in again');
    console.log('3. You should now have full admin access!\n');

  } catch (error) {
    console.error('\nERROR:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the fix
fixAdminPermissions();
