# Specification - Track: newsletter_email_20260114

## Overview
Implement an automated email notification system for the AIML COE newsletter using GCP-native tools. When a new blog post is published to Firestore, a Firebase Cloud Function (deployed via `gcloud` or `firebase` CLI) will trigger and send a notification email to a fixed recipient list. Authentication will be handled via `chirag.patil@onixnet.com` acting as the sender for the `aiml_coe@onixnet.com` group.

## User Stories
- As a COE Administrator, I want stakeholders to be automatically notified when new content is published so that engagement is maximized without manual effort.

## Functional Requirements
1.  **Firestore Trigger:** A Cloud Function triggered by `onDocumentCreated` in the `newsletter` or `blogs` collection.
2.  **SMTP Integration:** Use `nodemailer` within the Cloud Function to connect to the Google Workspace SMTP relay (`smtp.gmail.com`).
3.  **Authentication:**
    - **Sender:** `chirag.patil@onixnet.com`.
    - **Credential Storage:** Use **Google Secret Manager** to securely store the SMTP App Password for the sender account.
4.  **Sender Identity:** The email "From" field will be configured as `"AIML COE <chirag.patil@onixnet.com>"` with a `Reply-To` set to `aiml_coe@onixnet.com`.
5.  **Recipients:** Initial implementation will send to a fixed list. **For testing purposes, the sole recipient will be `chiragnpatil@gmail.com`.**
6.  **Deployment:** Utilize the already authenticated `gcloud` CLI / `firebase` CLI for deployment of functions and secrets.

## Non-Functional Requirements
- **Security:** Account credentials must be stored in Secret Manager, not in environment variables or code.
- **Reliability:** Basic retry logic and logging via Cloud Logging for tracking email delivery success.
- **Maintainability:** Use TypeScript for the Cloud Function to match the existing project structure.

## Acceptance Criteria
- Cloud Function is deployed successfully using the local authenticated environment.
- Creating a "published" document in Firestore triggers an email.
- The test recipient (`chiragnpatil@gmail.com`) receives an email from "AIML COE" with the correct blog title, summary, and link.
- No sensitive credentials are exposed in the repository.

## Out of Scope
- Dynamic subscriber list management.
- Unsubscribe functionality for the initial internal pilot.
