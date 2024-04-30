variable "billing_account" {
  description = "Google Cloud Billing Account ID for this Firebase project"
  type        = string
}

variable "org_id" {
  description = "Google Cloud Organization ID for this Firebase project"
  type        = string
}

variable "project_name" {
  description = "Firebase Project Name"
  type        = string
}

variable "project_id" {
  description = "Firebase Project ID (a globally unique code)"
  type        = string
}

variable "iap_brand_support_email" {
  description = "Support email for the IAP brand"
  type        = string
}

variable "iap_brand_application_title" {
  description = "Application title for the IAP brand"
  type        = string
}

variable "iap_client_display_name" {
  description = "Display name for the IAP client"
  type        = string
}

