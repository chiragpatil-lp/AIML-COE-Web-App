# Implementation Plan - Track: newsletter_email_20260114

This plan outlines the steps to implement a GCP-native automated email notification system for the AIML COE newsletter.

## Phase 1: Environment Setup & Secret Management
Configure the necessary GCP resources and secure credentials.

- [ ] **Task 1: Create SMTP Secret in Google Secret Manager**
    - [ ] Create a secret named `SMTP_APP_PASSWORD` in the GCP project.
    - [ ] Store the App Password for `chirag.patil@onixnet.com` securely.
    - [ ] Grant the Cloud Functions service account `roles/secretmanager.secretAccessor` permission for this secret.
- [ ] **Task 2: Configure Firebase Functions Environment**
    - [ ] Ensure the `functions` directory is ready for a new trigger function.
    - [ ] Install `nodemailer` and `@types/nodemailer` in the `functions` folder.
- [ ] **Task: Conductor - User Manual Verification 'Phase 1: Environment Setup & Secret Management' (Protocol in workflow.md)**

## Phase 2: Cloud Function Implementation
Develop the Firestore-triggered function to send emails.

- [ ] **Task 3: Develop `onBlogPostPublished` Trigger**
    - [ ] Create a new Cloud Function in `functions/src/index.ts` (or a dedicated file).
    - [ ] Implement the Firestore `onDocumentCreated` trigger for the `newsletter` collection.
    - [ ] Add logic to retrieve the SMTP secret at runtime.
- [ ] **Task 4: Implement Email Logic with Nodemailer**
    - [ ] Configure `nodemailer` with `smtp.gmail.com`, port 465, and the retrieved credentials.
    - [ ] Set "From" as `AIML COE <chirag.patil@onixnet.com>` and "Reply-To" as `aiml_coe@onixnet.com`.
    - [ ] Build a basic HTML template using the data from the Firestore document (title, slug, excerpt).
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Cloud Function Implementation' (Protocol in workflow.md)**

## Phase 3: Deployment & Testing
Deploy the function and verify end-to-end functionality.

- [ ] **Task 5: Deploy Function via gcloud/firebase CLI**
    - [ ] Run the deployment command ensuring the secret is correctly bound to the function.
- [ ] **Task 6: End-to-End Verification**
    - [ ] Manually create a test document in the `newsletter` Firestore collection.
    - [ ] Verify that `chiragnpatil@gmail.com` receives the email.
    - [ ] Check Cloud Logs for successful execution or errors.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Deployment & Testing' (Protocol in workflow.md)**
