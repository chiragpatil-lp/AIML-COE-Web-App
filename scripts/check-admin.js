// Quick script to check admin permissions
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./functions/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkAndFixAdmin() {
  const userId = 'I1MmPgyzZwaij1mH3aAgPHwvk8c2'; // Your user ID from the error

  console.log('\n=== Checking permissions for userId:', userId, '===\n');

  // Check if document exists by userId
  const userDoc = await db.collection('userPermissions').doc(userId).get();

  if (userDoc.exists) {
    console.log('✅ Document found by userId');
    console.log('Current permissions:', userDoc.data());

    if (userDoc.data().isAdmin) {
      console.log('✅ You already have admin access!');
    } else {
      console.log('⚠️  Setting isAdmin to true...');
      await db.collection('userPermissions').doc(userId).update({
        isAdmin: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log('✅ Admin access granted!');
    }
  } else {
    console.log('❌ No document found for userId:', userId);
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
  }
}

checkAndFixAdmin()
  .then(() => {
    console.log('\n✅ Done! Please refresh your browser.');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
