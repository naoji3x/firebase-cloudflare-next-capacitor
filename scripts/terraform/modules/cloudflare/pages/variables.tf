variable "cloudflare_email" {
  description = "Email address for Cloudflare account"
}

variable "cloudflare_api_key" {
  description = "API key for Cloudflare account"
}

variable "cloudflare_account_id" {
  description = "Account ID for Cloudflare"
}

variable "project_name" {
  description = "Name of the Cloudflare Pages project"
}

variable "production_branch" {
  description = "Branch to deploy from"
  default     = "main"
}

variable "github_owner" {
  description = "GitHub owner (user or organization)"
}

variable "github_repo" {
  description = "GitHub repository name"
}
