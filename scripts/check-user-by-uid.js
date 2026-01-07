const admin = require('firebase-admin');

admin.initializeApp({ projectId: 'search-ahmed' });
const db = admin.firestore();

async function checkUser(uid) {
  console.log(`\n🔍 Checking user: ${uid}\n`);
  
  try {
    // Get user from Auth
    const userRecord = await admin.auth().getUser(uid);
    console.log('✅ Firebase Auth user:');
    console.log(`   Email: ${userRecord.email}`);
    console.log(`   UID: ${userRecord.uid}\n`);
    
    // Get permissions document
    const permDoc = await db.collection('userPermissions').doc(uid).get();
    
    if (permDoc.exists) {
      console.log('✅ Firestore permissions:');
      console.log(JSON.stringify(permDoc.data(), null, 2));
    } else {
      console.log('❌ No permissions document found!');
      console.log('\n   Creating default permissions...');
      
      await db.collection('userPermissions').doc(uid).set({
        userId: uid,
        email: userRecord.email,
        isAdmin: true, // Making them admin by default
        pillars: {
          pillar1: true,
          pillar2: true,
          pillar3: true,
          pillar4: true,
          pillar5: true,
          pillar6: true,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      console.log('✅ Created admin permissions!');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('');
}

checkUser('I1MmPgyzZwaij1mH3aAgPHwvk8c2')
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
