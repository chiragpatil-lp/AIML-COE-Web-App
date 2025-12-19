output "workload_identity_provider" {
  description = "The full identifier of the Workload Identity Provider (use for GCP_WORKLOAD_IDENTITY_PROVIDER secret)"
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "service_account_email" {
  description = "The email of the service account (use for GCP_SERVICE_ACCOUNT secret)"
  value       = google_service_account.github_actions.email
}

output "project_id" {
  description = "The GCP project ID (use for GCP_PROJECT_ID secret)"
  value       = var.project_id
}

output "github_secrets_summary" {
  description = "Summary of GitHub Secrets to configure"
  value = {
    GCP_WORKLOAD_IDENTITY_PROVIDER = google_iam_workload_identity_pool_provider.github.name
    GCP_SERVICE_ACCOUNT            = google_service_account.github_actions.email
    GCP_PROJECT_ID                 = var.project_id
    DOCKER_IMAGE_NAME              = "aiml-coe-web-app"
  }
}
