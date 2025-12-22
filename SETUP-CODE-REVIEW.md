# Code Review and Branch Protection Setup Guide

This guide will help you set up:
1. Branch protection rules to require pull requests for all changes
2. Gemini Code Assist for automated code reviews
3. Claude Code Review GitHub Actions
4. Required GitHub secrets

## Prerequisites

- Repository admin access
- GitHub account
- Anthropic API key (for Claude Code Review)
- Google Cloud account (for Gemini Code Assist)

---

## 1. Branch Protection Setup

Protect your `main` branch to require pull requests for all changes.

### Steps:

1. **Navigate to Branch Protection Settings**:
   - Go to your repository on GitHub
   - Click **Settings** → **Branches**
   - Click **Add branch protection rule**

2. **Configure Branch Protection Rule**:
   - **Branch name pattern**: `main`

   **Enable the following settings**:
   - ✅ **Require a pull request before merging**
     - ✅ **Require approvals**: Set to `1` (or more for stricter reviews)
     - ✅ **Dismiss stale pull request approvals when new commits are pushed**
     - ✅ **Require review from Code Owners** (optional, if you have CODEOWNERS file)

   - ✅ **Require status checks to pass before merging**
     - ✅ **Require branches to be up to date before merging**
     - Add status checks as they become available (e.g., build, lint, tests)

   - ✅ **Require conversation resolution before merging**

   - ✅ **Do not allow bypassing the above settings**

   - ✅ **Restrict who can push to matching branches**
     - Leave empty to prevent direct pushes from everyone (recommended)
     - Or add specific users/teams who can merge without PR (not recommended)

3. **Click "Create"** to save the rule

### Result:
- All changes to `main` must now go through a pull request
- Pull requests require at least 1 approval before merging
- No one can push directly to `main`

---

## 2. Gemini Code Assist Setup

Gemini Code Assist provides AI-powered code reviews on your pull requests.

### Option A: Consumer Version (Direct GitHub Installation)

**Best for**: Individual developers, small teams, quick setup

1. **Install Gemini Code Assist**:
   - Visit: https://github.com/apps/gemini-code-assist
   - Click **Install**
   - Select your repository
   - Grant required permissions:
     - Contents: Read & Write
     - Pull Requests: Read & Write
     - Issues: Read & Write

2. **Configure Settings** (optional):
   - After installation, click **Configure**
   - Select which repositories should have access
   - Add repository-specific style guides if needed

3. **Usage**:
   - Gemini automatically reviews new pull requests
   - Use `/gemini review` in PR comments for manual reviews
   - Use `/gemini summary` for PR summaries
   - Use `/gemini help` for available commands

**Quotas**: 33 pull requests per day

### Option B: Enterprise Version (Google Cloud)

**Best for**: Enterprise teams, multiple repositories, custom style guides

1. **Prerequisites**:
   - Google Cloud project with billing enabled
   - Vertex AI API enabled
   - Required APIs:
     - IAM Credentials API
     - Security Token Service API
     - Vertex AI API

2. **Set up in Google Cloud Console**:
   - Navigate to Gemini Code Assist in Google Cloud Console
   - Go to **Agents & Tools** → **Code Assist Source Code Management**
   - Click **Create Connection**
   - Follow the setup wizard to:
     - Connect your GitHub repository via Developer Connect
     - Configure authentication (creates connection in `us-east1`)
     - Set up Workload Identity Federation

3. **Configure Style Guides** (optional):
   - Can be set per-repository in GitHub
   - Or managed centrally across multiple repos in Google Cloud

4. **Usage**:
   - Same as consumer version
   - Higher quotas: 100+ pull requests per day

**Quotas**: 100+ pull requests per day

### Gemini Features

Once installed, Gemini Code Assist will:
- ✅ Automatically review new pull requests
- ✅ Provide feedback with severity levels (Critical, High, Medium, Low)
- ✅ Suggest code improvements
- ✅ Reference your style guide (if configured)
- ✅ Add `gemini-code-assist[bot]` as a reviewer

### Invoking Gemini Manually

Comment on any PR with:
- `/gemini review` - Request a code review
- `/gemini summary` - Get a PR summary
- `/gemini` - General questions about the PR
- `/gemini help` - Show available commands

---

## 3. Claude Code Review Setup

Claude provides intelligent code reviews and can implement features directly in PRs. This setup uses **Google Vertex AI** for authentication.

### Prerequisites:

- Google Cloud project with Vertex AI enabled
- Workload Identity Federation configured for GitHub Actions
- Service account with Vertex AI permissions
- The same GCP secrets used for Cloud Run deployment

### Setup Steps:

#### Step 1: Verify GCP Configuration

This project already uses Google Cloud for deployment, so the required secrets should already be configured:

- `GCP_WORKLOAD_IDENTITY_PROVIDER` - Workload identity provider resource name
- `GCP_SERVICE_ACCOUNT` - Service account email with Vertex AI access

**Verify these secrets exist**:
1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Confirm both `GCP_WORKLOAD_IDENTITY_PROVIDER` and `GCP_SERVICE_ACCOUNT` are present

#### Step 2: Ensure Service Account Has Vertex AI Permissions

The service account needs the **Vertex AI User** role:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **IAM & Admin** → **IAM**
3. Find your service account (the one in `GCP_SERVICE_ACCOUNT` secret)
4. Click **Edit** (pencil icon)
5. Click **Add Another Role**
6. Select **Vertex AI User** (`roles/aiplatform.user`)
7. Click **Save**

#### Step 3: Enable Required APIs

Ensure these APIs are enabled in your Google Cloud project:

1. Go to [API Library](https://console.cloud.google.com/apis/library)
2. Enable the following APIs:
   - Vertex AI API
   - IAM Credentials API
   - Security Token Service API

```bash
# Or use gcloud CLI:
gcloud services enable aiplatform.googleapis.com
gcloud services enable iamcredentials.googleapis.com
gcloud services enable sts.googleapis.com
```

#### Step 4: Verify Workflow File

The Claude Code Review workflow has been created at:
```
.github/workflows/claude-code-review.yml
```

This workflow:
- ✅ Automatically reviews all new PRs and PR updates
- ✅ Responds to `@claude` mentions in PR comments
- ✅ Uses **Google Vertex AI** for authentication
- ✅ Uses Claude Sonnet 4 model via Vertex AI
- ✅ Allows up to 10 conversation turns
- ✅ Deployed in the `us-east5` region

#### Step 5: Test the Setup

1. **Create a test PR**:
   ```bash
   git checkout -b test-claude-review
   echo "# Test" > test.md
   git add test.md
   git commit -m "test: verify Claude code review"
   git push origin test-claude-review
   ```

2. **Open a Pull Request**:
   - Go to your repository on GitHub
   - Click **Pull requests** → **New pull request**
   - Select your test branch
   - Click **Create pull request**

3. **Verify Claude Reviews the PR**:
   - Claude should automatically post a review
   - Try commenting `@claude review this PR for best practices`

### Claude Features

- ✅ **Automatic PR Reviews**: Reviews code on PR creation/updates
- ✅ **Interactive**: Respond to `@claude` mentions for questions
- ✅ **Code Implementation**: Can create commits and fix issues
- ✅ **Context-Aware**: Uses CLAUDE.md for project guidelines
- ✅ **Slash Commands**: Supports `/review`, `/fix`, etc.

### Using Claude in PRs

**Automatic Review**: Claude reviews every PR automatically using `/review` command

**Interactive Commands**: Comment on a PR with:
- `@claude review this code for security issues`
- `@claude fix the TypeScript errors`
- `@claude how should I implement this feature?`
- `@claude explain this change`

**Advanced Usage**:
- Claude respects guidelines in `CLAUDE.md`
- Can create new commits to fix issues
- Understands project context and coding standards
- Provides detailed explanations and suggestions

---

## 4. Workflow Overview

With all components set up, here's how code reviews work:

### Pull Request Flow:

1. **Developer creates a feature branch**:
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

2. **Create Pull Request on GitHub**:
   - Open PR against `main` branch
   - Add description of changes

3. **Automated Reviews**:
   - **Claude Code Review** runs automatically via `/review` command
   - **Gemini Code Assist** (if installed) provides additional review
   - Both post comments with findings and suggestions

4. **Developer Interaction**:
   - Review feedback from both AI reviewers
   - Address critical and high-severity issues
   - Use `@claude` to ask questions or request fixes
   - Use `/gemini` for Gemini-specific questions

5. **Human Review**:
   - Request review from team members
   - Address feedback and make changes
   - Resolve all conversations

6. **Merge**:
   - Once approved and all checks pass
   - Merge the PR (squash or merge commit as per team preference)
   - Branch protection ensures code quality

---

## 5. Best Practices

### For Developers:

1. **Write Clear PR Descriptions**:
   - Explain what changed and why
   - Include testing steps
   - Reference related issues

2. **Respond to AI Feedback**:
   - Address critical and high-severity issues
   - Consider medium and low-severity suggestions
   - Ask clarifying questions using `@claude` or `/gemini`

3. **Keep PRs Small**:
   - Easier to review
   - Faster to merge
   - Reduces conflicts

4. **Use Draft PRs**:
   - For work-in-progress
   - Get early feedback
   - Iterate before formal review

### For Reviewers:

1. **Review AI Feedback First**:
   - Check what Claude and Gemini found
   - Focus on issues not caught by AI
   - Provide architectural and business logic feedback

2. **Be Constructive**:
   - Explain why changes are needed
   - Suggest alternatives
   - Use the severity guidelines from CLAUDE.md

3. **Approve Thoughtfully**:
   - Ensure all critical issues are resolved
   - Verify tests pass
   - Check that changes align with project goals

---

## 6. Troubleshooting

### Claude Not Responding:

- ✅ Verify `GCP_WORKLOAD_IDENTITY_PROVIDER` and `GCP_SERVICE_ACCOUNT` secrets are set
- ✅ Check service account has **Vertex AI User** role
- ✅ Ensure Vertex AI API is enabled in your GCP project
- ✅ Check workflow file is in `.github/workflows/`
- ✅ Ensure GitHub Actions are enabled for the repository
- ✅ Check Actions tab for workflow run errors
- ✅ Verify Workload Identity Federation is configured correctly

### Gemini Not Reviewing:

- ✅ Confirm Gemini Code Assist app is installed
- ✅ Check app has access to the repository
- ✅ Verify repository is not private (or has enterprise version)
- ✅ Check daily quota hasn't been exceeded

### Branch Protection Issues:

- ✅ Verify you have admin access to modify settings
- ✅ Check branch name pattern matches exactly
- ✅ Ensure status checks are properly configured
- ✅ Review who is in the bypass list (should be empty)

### Workflow Permissions:

- ✅ Ensure workflow has write permissions for contents, PRs, and issues
- ✅ Check that secrets are available to the workflow
- ✅ Verify GitHub Actions has necessary permissions in Settings → Actions → General

---

## 7. Cost Considerations

### Claude Code Review (via Vertex AI):
- Billed through Google Cloud (Vertex AI)
- Costs based on token usage (input and output tokens)
- Varies by PR size and complexity
- Optimize with `--max-turns` in workflow
- Monitor usage in Google Cloud Console
- Consider setting budget alerts in GCP

### Gemini Code Assist:
- **Consumer**: Free tier with quotas
- **Enterprise**: Billable through Google Cloud
- Monitor usage in respective consoles

### GitHub Actions:
- Consumes GitHub Actions minutes
- Free tier: 2,000 minutes/month for private repos
- See: https://docs.github.com/en/billing/managing-billing-for-github-actions

---

## 8. Next Steps

1. ✅ Set up branch protection (Section 1)
2. ✅ Install Gemini Code Assist (Section 2)
3. ✅ Configure Claude Code Review with Vertex AI (Section 3)
4. ✅ Test with a sample PR (Section 3, Step 5)
5. ✅ Train team on new workflow (Section 4)
6. ✅ Monitor and adjust as needed

---

## Resources

- **Claude Code GitHub Actions**: https://github.com/anthropics/claude-code-action
- **Gemini Code Assist Docs**: https://cloud.google.com/gemini/docs/code-assist
- **GitHub Branch Protection**: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches
- **Project Guidelines**: See `CLAUDE.md` in repository root

---

## Support

For issues or questions:
- Claude: https://github.com/anthropics/claude-code-action/issues
- Gemini: https://cloud.google.com/support
- Internal: Contact AIML COE team
