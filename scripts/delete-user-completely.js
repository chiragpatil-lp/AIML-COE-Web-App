/**
 * Completely delete a user from both Firebase Auth and Firestore
 * This allows testing the full onUserCreate flow
 */

const admin = require('firebase-admin');

admin.initializeApp({ projectId: 'search-ahmed' });
const db = admin.firestore();

async function deleteUser(email) {
  if (!email) {
    console.error('❌ Error: Please provide an email address');
    console.log('Usage: node delete-user-completely.js <email>');
    process.exit(1);
  }

  console.log(`\n🗑️  Deleting user: ${email}\n`);

  try {
    // Get user from Firebase Auth
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    console.log(`Found user:`);
    console.log(`   UID: ${uid}`);
    console.log(`   Email: ${userRecord.email}\n`);

    // Delete from Firestore
    const permDoc = await db.collection('userPermissions').doc(uid).get();
    if (permDoc.exists) {
      await permDoc.ref.delete();
      console.log('✅ Deleted Firestore permissions document');
    } else {
      console.log('ℹ️  No Firestore permissions document found');
    }

    // Delete from Firebase Auth
    await admin.auth().deleteUser(uid);
    console.log('✅ Deleted Firebase Auth user');

    console.log('\n✅ User completely deleted!\n');
    console.log('📝 Next steps:');
    console.log('   1. (Optional) Add user via Admin Dashboard to pre-authorize');
    console.log('   2. Sign in with this email again');
    console.log('   3. onUserCreate trigger will fire and create permissions!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'auth/user-not-found') {
      console.log('\nℹ️  User not found in Firebase Auth.\n');
    }
    process.exit(1);
  }
}

const email = process.argv[2];
deleteUser(email)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
