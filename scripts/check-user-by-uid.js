/**
 * Generic script to check user permissions in Firebase
 * Usage: node check-user-by-uid.js <uid>
 * Example: node check-user-by-uid.js abc123xyz456
 * 
 * This script only READS and DISPLAYS user information.
 * It does NOT create or modify any permissions.
 */

const admin = require('firebase-admin');

// Get UID from command-line arguments
const uid = process.argv[2];

// Validate arguments
if (!uid) {
  console.error('❌ ERROR: Missing required argument');
  console.error('\nUsage: node check-user-by-uid.js <uid>');
  console.error('Example: node check-user-by-uid.js abc123xyz456\n');
  process.exit(1);
}

admin.initializeApp({ projectId: 'search-ahmed' });
const db = admin.firestore();

async function checkUser(uid) {
  console.log(`\n🔍 Checking user: ${uid}\n`);
  
  try {
    // Get user from Auth
    const userRecord = await admin.auth().getUser(uid);
    console.log('✅ Firebase Auth user found:');
    console.log(`   Email: ${userRecord.email}`);
    console.log(`   UID: ${userRecord.uid}`);
    console.log(`   Email Verified: ${userRecord.emailVerified}`);
    console.log(`   Created: ${userRecord.metadata.creationTime}\n`);
    
    // Get custom claims
    const customClaims = userRecord.customClaims || {};
    if (Object.keys(customClaims).length > 0) {
      console.log('🔑 Custom Claims:');
      console.log(JSON.stringify(customClaims, null, 2));
      console.log('');
    }
    
    // Get permissions document
    const permDoc = await db.collection('userPermissions').doc(uid).get();
    
    if (permDoc.exists) {
      console.log('✅ Firestore permissions document found:');
      console.log(JSON.stringify(permDoc.data(), null, 2));
      console.log('');
    } else {
      console.log('❌ No permissions document found in Firestore!');
      console.log('\nℹ️  To create permissions for this user:');
      console.log('   - Use the admin dashboard UI, or');
      console.log('   - Use fix-admin.js script with explicit parameters\n');
    }
    
    // Summary
    console.log('═══════════════════════════════════════');
    console.log('Summary:');
    console.log(`Auth: ✅ | Permissions: ${permDoc.exists ? '✅' : '❌'} | Admin: ${permDoc.exists && permDoc.data().isAdmin ? '✅' : '❌'}`);
    console.log('═══════════════════════════════════════\n');
    
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error('❌ User not found in Firebase Auth');
      console.error(`   UID: ${uid}\n`);
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  }
}

checkUser(uid)
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
