/**
 * Generic script to check and optionally fix admin permissions
 * Usage: node check-admin.js <uid> [--fix]
 * 
 * Examples:
 *   node check-admin.js abc123xyz456          (check only - read-only)
 *   node check-admin.js abc123xyz456 --fix    (check and fix if needed)
 */

const admin = require('firebase-admin');

// Get UID from command-line arguments
const userId = process.argv[2];
const shouldFix = process.argv[3] === '--fix';

// Validate arguments
if (!userId) {
  console.error('ERROR: Missing required argument');
  console.error('\nUsage: node check-admin.js <uid> [--fix]');
  console.error('\nExamples:');
  console.error('  node check-admin.js abc123xyz456          (check only - read-only)');
  console.error('  node check-admin.js abc123xyz456 --fix    (check and fix if needed)\n');
  process.exit(1);
}

// Initialize Firebase Admin with Application Default Credentials (ADC)
// This uses the same approach as fix-admin.js - no hardcoded service account
admin.initializeApp({
  projectId: 'search-ahmed'
});

const db = admin.firestore();

async function checkAndFixAdmin() {
  console.log('\n=== Checking permissions for userId:', userId, '===');
  if (shouldFix) {
    console.log('FIX MODE ENABLED - Will update permissions if needed');
  } else {
    console.log('READ-ONLY MODE - Use --fix flag to modify permissions');
  }
  console.log('');

  // Check if document exists by userId
  const userDoc = await db.collection('userPermissions').doc(userId).get();

  if (userDoc.exists) {
    console.log('Document found by userId');
    console.log('Current permissions:', JSON.stringify(userDoc.data(), null, 2));
    console.log('');

    if (userDoc.data().isAdmin) {
      console.log('User already has admin access!\n');
    } else {
      if (shouldFix) {
        console.log('⚠️  Setting isAdmin to true...');
        await db.collection('userPermissions').doc(userId).update({
          isAdmin: true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log('Admin access granted!\n');
      } else {
        console.log('User does NOT have admin access');
        console.log('Run with --fix flag to grant admin access\n');
      }
    }
  } else {
    console.log('No document found for userId:', userId);
    console.log('\nSearching for documents keyed by email...');

    // List all documents to see what we have
    const allDocs = await db.collection('userPermissions').limit(10).get();
    console.log(`Found ${allDocs.size} documents:\n`);

    allDocs.forEach(doc => {
      console.log(`  - Document ID: ${doc.id}`);
      console.log(`    Email: ${doc.data().email}`);
      console.log(`    isAdmin: ${doc.data().isAdmin}`);
      console.log('');
    });
    
    console.log('To create permissions for this user, use fix-admin.js instead:\n');
    console.log(`   node fix-admin.js user@example.com ${userId}\n`);
  }
}

checkAndFixAdmin()
  .then(() => {
    console.log('Done!');
    if (shouldFix) {
      console.log('If you made changes, please refresh your browser.\n');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('\nError:', error.message);
    if (error.code === 'auth/user-not-found') {
      console.error('User not found in Firebase Auth\n');
    }
    process.exit(1);
  });
