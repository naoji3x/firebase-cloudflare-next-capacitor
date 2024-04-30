# Firebase IAP client
resource "google_iap_brand" "project_brand" {
  support_email     = var.iap_brand_support_email
  application_title = var.iap_brand_application_title
  project           = var.project_id
  depends_on = [
    var.services_ready
  ]
}

resource "google_iap_client" "project_client" {
  display_name = var.iap_client_display_name
  brand        = google_iap_brand.project_brand.name
}

# Firebase Authentication
resource "google_identity_platform_config" "default" {
  provider = google-beta
  project  = var.project_id
  depends_on = [
    var.services_ready
  ]
}

resource "google_identity_platform_default_supported_idp_config" "idp_config" {
  enabled       = true
  project       = var.project_id
  idp_id        = "google.com"
  client_id     = google_iap_client.project_client.client_id
  client_secret = google_iap_client.project_client.secret
  depends_on = [
    google_identity_platform_config.default
  ]
}

