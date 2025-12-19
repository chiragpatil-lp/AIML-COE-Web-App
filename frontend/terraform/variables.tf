variable "project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "search-ahmed"
}

variable "project_number" {
  description = "GCP Project Number"
  type        = string
  default     = "36231825761"
}

variable "region" {
  description = "Default GCP region"
  type        = string
  default     = "us-central1"
}

variable "service_account_id" {
  description = "Service Account ID for GitHub Actions"
  type        = string
  default     = "github-ci-cd"
}

variable "github_repository" {
  description = "GitHub repository in the format 'owner/repo'"
  type        = string
  default     = "chiragpatil-lp/AIML-COE-Web-App"
}

variable "workload_identity_pool_id" {
  description = "Workload Identity Pool ID"
  type        = string
  default     = "github-pool"
}

variable "workload_identity_provider_id" {
  description = "Workload Identity Provider ID"
  type        = string
  default     = "github-provider"
}
