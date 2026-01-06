const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize with project ID from the .env file
admin.initializeApp({
  projectId: 'search-ahmed'
});

const db = getFirestore("aiml-coe-web-app");
const auth = admin.auth();

async function migrateAllUsersToAdmin() {
  console.log('Starting migration: Making all users admins...');
  
  try {
    let users = [];
    let pageToken = undefined;
    
    // 1. Fetch all users
    do {
      const result = await auth.listUsers(1000, pageToken);
      users = users.concat(result.users);
      pageToken = result.pageToken;
    } while (pageToken);

    console.log(`Found ${users.length} users to process.`);

    let successCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        const { uid, email } = user;
        if (!email) {
            console.log(`Skipping user ${uid} (no email)`);
            continue;
        }

        console.log(`Processing user: ${email} (${uid})`);

        // 2. Set Custom Claim
        await auth.setCustomUserClaims(uid, { admin: true });

        // 3. Update Firestore Document
        const userRef = db.collection('userPermissions').doc(uid);
        
        const adminPermissions = {
          userId: uid,
          email,
          isAdmin: true,
          pillars: {
            pillar1: true,
            pillar2: true,
            pillar3: true,
            pillar4: true,
            pillar5: true,
            pillar6: true,
          },
          // Use standard JS Date if not using serverTimestamp, 
          // but let's try to use FieldValue if we can
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docSnap = await userRef.get();
        if (docSnap.exists) {
          await userRef.update({
            isAdmin: true,
            pillars: {
              pillar1: true,
              pillar2: true,
              pillar3: true,
              pillar4: true,
              pillar5: true,
              pillar6: true,
            },
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        } else {
          // If it doesn't exist, we add createdAt
          adminPermissions.createdAt = admin.firestore.FieldValue.serverTimestamp();
          await userRef.set(adminPermissions);
        }

        console.log(`Successfully updated ${email} to Admin.`);
        successCount++;
      } catch (err) {
        console.error(`Error processing user ${user.uid}:`, err);
        errorCount++;
      }
    }

    console.log('\nMigration Complete!');
    console.log(`Total users processed: ${users.length}`);
    console.log(`Successfully updated: ${successCount}`);
    console.log(`Errors: ${errorCount}`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit();
  }
}

migrateAllUsersToAdmin();
