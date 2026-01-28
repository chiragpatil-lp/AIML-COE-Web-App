"use strict";
/**
 * Firebase Cloud Functions for AIML COE Web App (Gen 2)
 *
 * These functions handle server-side operations that require elevated privileges:
 * - User creation with default permissions
 * - Admin role management
 * - Custom claims management
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUser = exports.getUserPermissions = exports.updateUserPermissions = exports.setAdminClaim = exports.onUserCreate = void 0;
const https_1 = require("firebase-functions/v2/https");
const identity_1 = require("firebase-functions/v2/identity");
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
// Initialize Firebase Admin SDK
admin.initializeApp();
// Initialize Firestore with named database
const db = (0, firestore_1.getFirestore)(admin.app(), 'aiml-coe-web-app');
/**
 * Triggered when a new user signs up
 * Creates default user permissions in Firestore
 */
exports.onUserCreate = (0, identity_1.beforeUserCreated)(async (event) => {
    const user = event.data;
    if (!user) {
        console.error('User data not available');
        return;
    }
    const { uid, email } = user;
    if (!email) {
        console.error('User created without email - skipping permission creation');
        // PII: User ID commented out
        // console.error('User created without email:', uid);
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
            const defaultPermissions = {
                userId: uid,
                email,
                isAdmin: pendingData.isAdmin || false,
                pillars: pendingData.pillars,
                createdAt: pendingData.createdAt || admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            await db.collection('userPermissions').doc(uid).set(defaultPermissions);
            await pendingDoc.ref.delete(); // Clean up pending document
            console.log('Created user permissions from pending record successfully', {
                source: 'pending',
                originalPendingId: pendingDoc.id
            });
            // PII: User ID and email commented out
            // console.log('Created user permissions from pending record:', {
            //   uid,
            //   email,
            //   originalPendingId: pendingDoc.id
            // });
            return;
        }
        const defaultPermissions = {
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
                pillar7: false,
            },
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await db.collection('userPermissions').doc(uid).set(defaultPermissions);
        console.log('Created default permissions for new user successfully');
        // PII: User ID and email commented out
        // console.log('Created default permissions for user:', {
        //   uid,
        //   email,
        // });
    }
    catch (error) {
        console.error('Error creating user permissions:', error);
        throw error;
    }
});
/**
 * Callable function to set admin custom claim
 * Can only be called by existing admins
 */
exports.setAdminClaim = (0, https_1.onCall)({
    cors: true,
    region: 'us-central1',
}, async (request) => {
    var _a;
    const data = request.data;
    const context = request;
    // Verify caller is authenticated
    if (!context.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    // Verify caller is admin
    // Check Firestore for admin status as a fallback or primary source
    // This resolves the Catch-22 where an admin needs the claim to set the claim
    const callerToken = context.auth.token;
    let hasAdminPrivileges = callerToken.admin === true;
    if (!hasAdminPrivileges) {
        const callerPermissions = await db.collection('userPermissions').doc(context.auth.uid).get();
        if (callerPermissions.exists && ((_a = callerPermissions.data()) === null || _a === void 0 ? void 0 : _a.isAdmin) === true) {
            hasAdminPrivileges = true;
        }
    }
    if (!hasAdminPrivileges) {
        throw new https_1.HttpsError('permission-denied', 'Only admins can set admin claims');
    }
    const { userId, isAdmin } = data;
    if (!userId || typeof userId !== 'string') {
        throw new https_1.HttpsError('invalid-argument', 'userId must be a string');
    }
    if (typeof isAdmin !== 'boolean') {
        throw new https_1.HttpsError('invalid-argument', 'isAdmin must be a boolean');
    }
    try {
        // Set custom claim
        await admin.auth().setCustomUserClaims(userId, { admin: isAdmin });
        // Update Firestore permissions document
        await db
            .collection('userPermissions')
            .doc(userId)
            .update({
            isAdmin,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        // Log the change for audit purposes
        await db
            .collection('adminAuditLog')
            .add({
            action: 'admin_claim_set',
            targetUserId: userId,
            isAdmin,
            performedBy: context.auth.uid,
            performedByEmail: context.auth.token.email,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log('Admin claim set successfully:', {
            isAdmin,
        });
        // PII: User IDs commented out - check audit logs for tracking
        // console.log('Admin claim set:', {
        //   targetUserId: userId,
        //   isAdmin,
        //   performedBy: context.auth.uid,
        // });
        return {
            success: true,
            message: `Admin claim ${isAdmin ? 'granted' : 'revoked'} for user ${userId}`,
        };
    }
    catch (error) {
        console.error('Error setting admin claim:', error);
        throw new https_1.HttpsError('internal', 'Failed to set admin claim');
    }
});
/**
 * Callable function to update user pillar permissions
 * Can only be called by admins
 */
exports.updateUserPermissions = (0, https_1.onCall)({
    cors: true,
    region: 'us-central1',
}, async (request) => {
    var _a;
    const data = request.data;
    const context = request;
    // Verify caller is authenticated
    if (!context.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    // Verify caller is admin
    // Check Firestore for admin status as a fallback or primary source
    const callerToken = context.auth.token;
    let hasAdminPrivileges = callerToken.admin === true;
    if (!hasAdminPrivileges) {
        const callerPermissions = await db.collection('userPermissions').doc(context.auth.uid).get();
        if (callerPermissions.exists && ((_a = callerPermissions.data()) === null || _a === void 0 ? void 0 : _a.isAdmin) === true) {
            hasAdminPrivileges = true;
        }
    }
    if (!hasAdminPrivileges) {
        throw new https_1.HttpsError('permission-denied', 'Only admins can update user permissions');
    }
    const { userId, pillars } = data;
    if (!userId || typeof userId !== 'string') {
        throw new https_1.HttpsError('invalid-argument', 'userId must be a string');
    }
    if (!pillars || typeof pillars !== 'object') {
        throw new https_1.HttpsError('invalid-argument', 'pillars must be an object');
    }
    // Validate pillars object structure
    const validPillarKeys = ['pillar1', 'pillar2', 'pillar3', 'pillar4', 'pillar5', 'pillar6', 'pillar7'];
    for (const key of Object.keys(pillars)) {
        if (!validPillarKeys.includes(key)) {
            throw new https_1.HttpsError('invalid-argument', `Invalid pillar key: ${key}`);
        }
        if (typeof pillars[key] !== 'boolean') {
            throw new https_1.HttpsError('invalid-argument', `Pillar value must be boolean: ${key}`);
        }
    }
    try {
        // Update Firestore permissions document
        await db
            .collection('userPermissions')
            .doc(userId)
            .update({
            pillars,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        // Log the change for audit purposes
        await db
            .collection('adminAuditLog')
            .add({
            action: 'permissions_updated',
            targetUserId: userId,
            pillars,
            performedBy: context.auth.uid,
            performedByEmail: context.auth.token.email,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log('User permissions updated successfully:', {
            pillarCount: Object.keys(pillars).filter(k => pillars[k]).length,
        });
        // PII: User IDs commented out - check audit logs for tracking
        // console.log('User permissions updated:', {
        //   targetUserId: userId,
        //   pillars,
        //   performedBy: context.auth.uid,
        // });
        return {
            success: true,
            message: `Permissions updated for user ${userId}`,
        };
    }
    catch (error) {
        console.error('Error updating user permissions:', error);
        throw new https_1.HttpsError('internal', 'Failed to update user permissions');
    }
});
/**
 * Callable function to get user permissions
 * Users can get their own permissions, admins can get any user's permissions
 */
exports.getUserPermissions = (0, https_1.onCall)({
    cors: true,
    region: 'us-central1',
}, async (request) => {
    var _a;
    const data = request.data;
    const context = request;
    // Verify caller is authenticated
    if (!context.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { userId } = data;
    const requestedUserId = userId || context.auth.uid;
    // Check if user is requesting their own permissions or is an admin
    const isOwnPermissions = requestedUserId === context.auth.uid;
    let isAdmin = context.auth.token.admin === true;
    // Also check Firestore for admin status if not in token
    if (!isAdmin) {
        // We can't easily await inside this synchronous check flow efficiently without refactoring 
        // but for read permissions, strict token check + own permission check is usually safer.
        // However, to be consistent with write operations, we should allow Firestore admins to read.
        const callerPermissions = await db.collection('userPermissions').doc(context.auth.uid).get();
        if (callerPermissions.exists && ((_a = callerPermissions.data()) === null || _a === void 0 ? void 0 : _a.isAdmin) === true) {
            isAdmin = true;
        }
    }
    if (!isOwnPermissions && !isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Users can only view their own permissions');
    }
    try {
        const permissionsDoc = await db
            .collection('userPermissions')
            .doc(requestedUserId)
            .get();
        if (!permissionsDoc.exists) {
            throw new https_1.HttpsError('not-found', 'User permissions not found');
        }
        return {
            success: true,
            permissions: permissionsDoc.data(),
        };
    }
    catch (error) {
        console.error('Error getting user permissions:', error);
        throw new https_1.HttpsError('internal', 'Failed to get user permissions');
    }
});
/**
 * Callable function to manually initialize user permissions
 * Use this as a fallback if the onCreate trigger fails
 */
exports.initializeUser = (0, https_1.onCall)({
    cors: true,
    region: 'us-central1',
}, async (request) => {
    const context = request;
    // Verify caller is authenticated
    if (!context.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { uid, email } = context.auth.token;
    if (!email) {
        throw new https_1.HttpsError('failed-precondition', 'User must have an email');
    }
    const userRef = db.collection('userPermissions').doc(uid);
    try {
        const doc = await userRef.get();
        if (doc.exists) {
            return { success: true, message: 'User already initialized' };
        }
        // Check for pending permissions by email before creating defaults
        const pendingQuery = await db.collection('userPermissions')
            .where('email', '==', email.toLowerCase())
            .where('isPending', '==', true)
            .limit(1)
            .get();
        if (!pendingQuery.empty) {
            const pendingDoc = pendingQuery.docs[0];
            const pendingData = pendingDoc.data();
            const defaultPermissions = {
                userId: uid,
                email,
                isAdmin: pendingData.isAdmin || false,
                pillars: pendingData.pillars,
                createdAt: pendingData.createdAt || admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            await userRef.set(defaultPermissions);
            await pendingDoc.ref.delete(); // Clean up pending document
            return { success: true, message: 'User initialized from pending permissions' };
        }
        const defaultPermissions = {
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
                pillar7: false,
            },
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await userRef.set(defaultPermissions);
        return { success: true, message: 'User initialized successfully' };
    }
    catch (error) {
        console.error('Error initializing user:', error);
        throw new https_1.HttpsError('internal', 'Failed to initialize user');
    }
});
//# sourceMappingURL=index.js.map