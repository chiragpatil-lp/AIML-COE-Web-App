/**
 * Quick script to initialize permissions for a specific user by email
 * Run with: node initialize-current-user.js <email>
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  projectId: 'search-ahmed'
});
const db = admin.firestore().collection('userPermissions');

async function initializeUser(email) {
  if (!email) {
    console.error('❌ Error: Please provide an email address');
    console.log('Usage: node initialize-current-user.js <email>');
    process.exit(1);
  }

  console.log(`\n🔍 Looking up user with email: ${email}\n`);

  try {
    // Get user by email from Firebase Auth
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    console.log(`✅ Found user in Firebase Auth:`);
    console.log(`   UID: ${uid}`);
    console.log(`   Email: ${userRecord.email}\n`);

    // Check if permissions document already exists
    const permDoc = await db.doc(uid).get();

    if (permDoc.exists) {
      console.log('ℹ️  User already has permissions:');
      console.log(JSON.stringify(permDoc.data(), null, 2));
      console.log('\n✅ No action needed.\n');
      return;
    }

    // Check for pending permissions
    const pendingQuery = await admin.firestore()
      .collection('userPermissions')
      .where('email', '==', email.toLowerCase())
      .where('isPending', '==', true)
      .limit(1)
      .get();

    let permissions;

    if (!pendingQuery.empty) {
      const pendingDoc = pendingQuery.docs[0];
      const pendingData = pendingDoc.data();

      console.log('✅ Found pending permissions!');
      console.log(JSON.stringify(pendingData, null, 2));

      permissions = {
        userId: uid,
        email: userRecord.email,
        isAdmin: pendingData.isAdmin || false,
        pillars: pendingData.pillars || {
          pillar1: false,
          pillar2: false,
          pillar3: false,
          pillar4: false,
          pillar5: false,
          pillar6: false,
        },
        createdAt: pendingData.createdAt || admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Create the real document
      await db.doc(uid).set(permissions);

      // Delete the pending document
      await pendingDoc.ref.delete();

      console.log('\n✅ Successfully migrated pending permissions to real document!');
    } else {
      console.log('⚠️  No pending permissions found. Creating default permissions...');

      permissions = {
        userId: uid,
        email: userRecord.email,
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

      await db.doc(uid).set(permissions);

      console.log('\n✅ Successfully created default permissions!');
    }

    console.log('\n📄 Final permissions:');
    console.log(JSON.stringify(permissions, null, 2));
    console.log('\n✅ User can now sign in successfully!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'auth/user-not-found') {
      console.log('\nℹ️  The user has not signed up yet. They need to sign in first.\n');
    }
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];
initializeUser(email)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
