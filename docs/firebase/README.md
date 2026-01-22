# Firebase Authentication Documentation

**Last Updated**: January 22, 2026
**Status**: ✅ Production Ready

This folder contains all documentation related to Firebase Authentication implementation for the AIML COE Web App.

---

## 📚 Documentation

### 1. **[FIREBASE-AUTH-COMPLETE-SETUP.md](./FIREBASE-AUTH-COMPLETE-SETUP.md)** ⭐ **START HERE**

**Complete implementation and setup guide**

This is your primary reference for everything Firebase Authentication. It includes:

- ✅ What has been implemented
- ✅ Actual Firebase configuration (`search-ahmed` project)
- ✅ Firestore database setup (`aiml-coe-web-app` named database)
- ✅ Step-by-step Firebase Console configuration
- ✅ Firestore security rules (admin-only write access)
- ✅ Local development setup
- ✅ Testing procedures (validated)
- ✅ Making your first admin user
- ✅ Comprehensive troubleshooting
- ✅ Production deployment guide
- ✅ Architecture & technical details
- ✅ Phase 2 roadmap

**Status**: ✅ Complete, tested, and production-ready (Jan 21, 2026)

---

### 2. **[FIREBASE-AUTH-IMPLEMENTATION.md](./FIREBASE-AUTH-IMPLEMENTATION.md)**

**Original implementation guide** (reference)

This document contains:

- Original step-by-step implementation instructions
- Code examples and technical details
- File structure and component architecture

**Use this for**: Understanding the code structure and technical implementation details.

**Note**: Some details may differ from the actual implementation. For accurate configuration, always refer to FIREBASE-AUTH-COMPLETE-SETUP.md.

---

## 🚀 Quick Start

### For New Developers

1. **Read**: [FIREBASE-AUTH-COMPLETE-SETUP.md](./FIREBASE-AUTH-COMPLETE-SETUP.md)

   - Start with "What Has Been Implemented"
   - Review "Architecture & Technical Details"
   - Follow "Local Development Setup"

2. **Test**: Sign in at http://localhost:3000/auth/signin

   - Use your Google account
   - Check the dashboard

3. **Request Access**: Ask an admin to grant you permissions in Firestore

### For Administrators

**Granting User Permissions** (Two Options):

**Option 1: Via Admin Panel (Recommended)**
1. Sign in as admin
2. Navigate to `/admin`
3. Search for user by email
4. Click "Edit" button
5. Toggle admin status or pillar permissions
6. Save changes
7. User must sign out and back in to see changes

**Option 2: Via Firebase Console**
1. User signs in once (Cloud Function creates Firestore document automatically)
2. Go to Firebase Console → Firestore → `userPermissions` collection
3. Find user's document (by email or UID)
4. Edit permissions:
   - Set `isAdmin: true` for full admin access
   - Or set individual pillars: `pillar1: true`, `pillar2: true`, etc.
5. User signs out and signs back in to see changes

**Detailed Instructions**: See [FIREBASE-AUTH-COMPLETE-SETUP.md](./FIREBASE-AUTH-COMPLETE-SETUP.md#making-your-first-admin-user)

---

## 🏗️ Implementation Summary

### What's Working

- ✅ **Google OAuth Sign-In**: Popup-based authentication with auto-redirect to dashboard
- ✅ **Firestore Permissions**: User permissions stored in `aiml-coe-web-app` database
- ✅ **6 Strategic Pillars**: Individual access control per pillar
- ✅ **Admin Role**: Full access to all pillars
- ✅ **Admin Panel**: Full user management UI at `/admin` (add, edit, delete users)
- ✅ **Protected Routes**: Dashboard and admin panel require authentication
- ✅ **Cloud Functions**: Auto-creates permissions on signup via `onUserCreate` trigger
- ✅ **Security Rules**: Admin-only write access (no self-registration)
- ✅ **Pending Permissions**: Admins can pre-authorize users before they sign up (handled by `onUserCreate` trigger)
- ✅ **User Deletion**: Admins can permanently delete users and their permissions via admin panel
- ✅ **Session Management**: Secure HttpOnly cookies with automatic token refresh
- ✅ **Pillar SSO**: Token-based authentication flow for pillar applications

### Tech Stack

- **Authentication**: Firebase Authentication (Google OAuth)
- **Database**: Firestore (`aiml-coe-web-app` database in `search-ahmed` project)
- **SDK**: Firebase v12.7.0 (modular imports)
- **Framework**: Next.js 16 (App Router)
- **State Management**: React Context API

---

## 📋 Common Tasks

### Setting Up Locally

```bash
# 1. Install dependencies
cd frontend
pnpm install

# 2. Environment variables already configured in .env.local
# (Firebase credentials from search-ahmed project)

# 3. Start dev server
pnpm dev

# 4. Open http://localhost:3000/auth/signin
```

### Making Someone an Admin

```bash
# Firebase Console
# 1. Go to: https://console.firebase.google.com/project/search-ahmed/firestore
# 2. Collection: userPermissions
# 3. Find user's document
# 4. Edit field: isAdmin = true
# 5. User signs out and back in
```

### Checking User Permissions

```bash
# Firebase Console
# 1. Go to: https://console.firebase.google.com/project/search-ahmed/firestore
# 2. Collection: userPermissions
# 3. Document ID = User's UID
# View all permissions (isAdmin, pillar1-6, etc.)
```

---

## 🔧 Troubleshooting

### Quick Fixes

| Issue                                 | Solution                                        |
| ------------------------------------- | ----------------------------------------------- |
| "Missing or insufficient permissions" | Check Firestore security rules are published    |
| Sign-in redirects to dashboard        | This is expected behavior (auto-redirect)       |
| Popup blocked                         | Allow popups for localhost:3000                 |
| Build fails                           | Code is SSR-safe, should build without env vars |
| Admin panel shows access denied       | Verify `isAdmin: true` in Firestore             |

**Full Troubleshooting Guide**: [FIREBASE-AUTH-COMPLETE-SETUP.md](./FIREBASE-AUTH-COMPLETE-SETUP.md#troubleshooting)

---

## 🚢 Deployment

### Production Checklist

- [ ] Add GitHub Secrets (Firebase credentials)
- [ ] Update GitHub Actions workflow
- [ ] Add production domain to Firebase authorized domains
- [ ] Test deployment
- [ ] Verify Firestore security rules

**Detailed Deployment Guide**: [FIREBASE-AUTH-COMPLETE-SETUP.md](./FIREBASE-AUTH-COMPLETE-SETUP.md#deployment-to-production)

---

## 📞 Support

### Getting Help

1. **Check documentation**: [FIREBASE-AUTH-COMPLETE-SETUP.md](./FIREBASE-AUTH-COMPLETE-SETUP.md)
2. **Common issues**: See Troubleshooting section
3. **Firebase Console**: Check Firestore data and logs
4. **Browser console**: Check for error messages
5. **Contact**: AIML COE team

### Reporting Issues

Include:

- What you were trying to do
- What happened instead
- Error messages (full text)
- Screenshots if relevant
- Browser and OS

---

## 📖 Additional Resources

### Firebase Documentation

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

### Firebase Console Links

- [Project Overview](https://console.firebase.google.com/project/search-ahmed)
- [Authentication](https://console.firebase.google.com/project/search-ahmed/authentication)
- [Firestore Database](https://console.firebase.google.com/project/search-ahmed/firestore)
- [Firestore Rules](https://console.firebase.google.com/project/search-ahmed/firestore/rules)

---

## 🔮 Future Enhancements (Phase 2)

Implemented:

- [x] Admin panel for user management (`/admin`)
- [x] Auto-redirect after sign-in
- [x] Cloud Functions for user initialization and admin custom claims

Planned features:

- [ ] Email notifications for permission changes
- [ ] Enhanced permissions (time-based, approval workflow)
- [ ] Permission groups/roles
- [ ] Audit log viewer UI in admin panel
- [ ] Sub-permissions within pillars
- [ ] Permission expiration dates

---

**Last Updated**: January 21, 2026
**Status**: ✅ Production Ready (Deployed)
**Branch**: `main`
**Maintained By**: AIML COE Team
