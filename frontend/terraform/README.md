# Terraform Configuration for GCP Workload Identity Federation

This directory contains Terraform configuration to set up Google Cloud Platform infrastructure for GitHub Actions CI/CD using Workload Identity Federation.

## What This Creates

This Terraform configuration automatically creates:

1. **Service Account** (`github-ci-cd@search-ahmed.iam.gserviceaccount.com`)
   - With roles: Cloud Run Admin, Cloud Build Builder, Service Account User, Storage Admin

2. **Workload Identity Pool** (`github-pool`)
   - For GitHub Actions OIDC authentication

3. **Workload Identity Provider** (`github-provider`)
   - Connected to GitHub's OIDC issuer

4. **IAM Bindings**
   - Allows your GitHub repository to impersonate the service account
   - Scoped to: `chiragpatil-lp/AIML-COE-Web-App`

5. **Required APIs**
   - IAM Credentials API
   - Cloud Run API
   - Cloud Build API
   - Container Registry API

## Prerequisites

Before running Terraform, ensure you have:

1. **Terraform installed** (>= 1.0)
   ```bash
   terraform version
   ```

2. **Google Cloud SDK (gcloud) installed and authenticated**
   ```bash
   gcloud auth application-default login
   ```

3. **Proper GCP permissions**
   - You (or your IAM admin) need these roles:
     - `roles/iam.workloadIdentityPoolAdmin`
     - `roles/iam.serviceAccountAdmin`
     - `roles/resourcemanager.projectIamAdmin`
     - `roles/serviceusage.serviceUsageAdmin`

## Quick Start

### Step 1: Initialize Terraform

Navigate to this directory and initialize:

```bash
cd terraform
terraform init
```

This downloads the required Google Cloud provider plugin.

### Step 2: Review the Plan

Preview what Terraform will create:

```bash
terraform plan
```

Review the output carefully. You should see:
- 1 service account to be created
- 1 workload identity pool to be created
- 1 workload identity provider to be created
- 4 IAM role bindings to be created
- 4 API enablements

### Step 3: Apply the Configuration

Create all resources:

```bash
terraform apply
```

Type `yes` when prompted to confirm.

The apply process typically takes 2-3 minutes.

### Step 4: Copy the Outputs

After successful apply, Terraform will display outputs:

```
Outputs:

github_secrets_summary = {
  "GCP_WORKLOAD_IDENTITY_PROVIDER" = "projects/36231825761/locations/global/workloadIdentityPools/github-pool/providers/github-provider"
  "GCP_SERVICE_ACCOUNT" = "github-ci-cd@search-ahmed.iam.gserviceaccount.com"
  "GCP_PROJECT_ID" = "search-ahmed"
  "DOCKER_IMAGE_NAME" = "aiml-coe-web-app"
}
```

**Copy these values** - you'll need them for GitHub Secrets.

You can also retrieve outputs later:

```bash
terraform output
terraform output -json
```

## Configure GitHub Secrets

After Terraform completes, configure these secrets in your GitHub repository:

1. Go to: `https://github.com/chiragpatil-lp/AIML-COE-Web-App/settings/secrets/actions`

2. Create these 4 secrets using the Terraform outputs:

| Secret Name | Value from Terraform Output |
|------------|----------------------------|
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `workload_identity_provider` |
| `GCP_SERVICE_ACCOUNT` | `service_account_email` |
| `GCP_PROJECT_ID` | `project_id` |
| `DOCKER_IMAGE_NAME` | `aiml-coe-web-app` (manual) |

## Customization

### Different GitHub Repository

To use a different repository, edit `variables.tf`:

```hcl
variable "github_repository" {
  default = "your-username/your-repo"
}
```

Or override during apply:

```bash
terraform apply -var="github_repository=your-username/your-repo"
```

### Different Service Account Name

Edit `variables.tf`:

```hcl
variable "service_account_id" {
  default = "your-service-account-name"
}
```

### Additional Roles

To add more IAM roles, add to `main.tf`:

```hcl
resource "google_project_iam_member" "additional_role" {
  project = var.project_id
  role    = "roles/your.role"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}
```

## Verification

### Verify Service Account

```bash
gcloud iam service-accounts list --project=search-ahmed | grep github-ci-cd
```

### Verify Workload Identity Pool

```bash
gcloud iam workload-identity-pools list --location=global --project=search-ahmed
```

### Verify IAM Bindings

```bash
gcloud iam service-accounts get-iam-policy github-ci-cd@search-ahmed.iam.gserviceaccount.com
```

## Troubleshooting

### Error: "API not enabled"

If you get errors about APIs not being enabled, manually enable them first:

```bash
gcloud services enable iamcredentials.googleapis.com --project=search-ahmed
gcloud services enable iam.googleapis.com --project=search-ahmed
```

Then run `terraform apply` again.

### Error: "Permission denied"

You need IAM admin permissions. Ask your GCP admin to:
1. Grant you the required roles (listed in Prerequisites)
2. Or run Terraform for you

### Error: "Resource already exists"

If resources already exist, you can import them:

```bash
terraform import google_service_account.github_actions projects/search-ahmed/serviceAccounts/github-ci-cd@search-ahmed.iam.gserviceaccount.com
```

Or delete existing resources and re-run.

## Cleanup

To destroy all resources created by Terraform:

```bash
terraform destroy
```

Type `yes` when prompted.

**Warning**: This will delete the service account and workload identity configuration. Your CI/CD pipeline will stop working.

## State Management

The Terraform state file (`terraform.tfstate`) contains sensitive information.

**Important**:
- ✅ The `.tfstate` file is already in `.gitignore`
- ❌ **NEVER** commit `terraform.tfstate` to Git
- ✅ Consider using [remote state](https://developer.hashicorp.com/terraform/language/state/remote) for team collaboration

## Next Steps

After Terraform setup:

1. ✅ Configure GitHub Secrets (see above)
2. ✅ Test the CI/CD pipeline by pushing to `main` branch
3. ✅ Monitor deployment in GitHub Actions tab

## Resources Created

Full list of resources:

- `google_project_service.iam_credentials`
- `google_project_service.cloud_run`
- `google_project_service.cloud_build`
- `google_project_service.container_registry`
- `google_service_account.github_actions`
- `google_project_iam_member.cloud_run_admin`
- `google_project_iam_member.cloud_build_service_account`
- `google_project_iam_member.service_account_user`
- `google_project_iam_member.storage_admin`
- `google_iam_workload_identity_pool.github`
- `google_iam_workload_identity_pool_provider.github`
- `google_service_account_iam_member.workload_identity_binding`

## Support

For issues or questions:
- Review the [main GCP setup documentation](../docs/GCP-SETUP.md)
- Check Terraform logs for detailed error messages
- Consult [Google Cloud Workload Identity Federation docs](https://cloud.google.com/iam/docs/workload-identity-federation)
