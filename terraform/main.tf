# Creates a new Google Cloud project.
resource "google_project" "default" {
  provider = google-beta.no_user_project_override
  org_id   = var.org_id

  # project_id should be globally unique
  project_id      = var.project_id
  name            = var.project_name
  billing_account = var.billing_account

  # Required for the project to display in any list of Firebase projects.
  labels = {
    "firebase" = "enabled"
  }
}

# Enables required APIs.
resource "google_project_service" "default" {
  provider = google-beta.no_user_project_override
  project  = google_project.default.project_id
  for_each = toset([
    # example form https://zenn.dev/cloud_ace/articles/b791cce386d523
    "cloudbuild.googleapis.com",
    "firestore.googleapis.com",
    "cloudbilling.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "serviceusage.googleapis.com",
    "identitytoolkit.googleapis.com",
    "firebase.googleapis.com",
    "firebaserules.googleapis.com",
    "firebasestorage.googleapis.com",
    "storage.googleapis.com",
    # Added by naoji3x
    "cloudfunctions.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    "fcmregistrations.googleapis.com",
    "fcm.googleapis.com",
    "cloudtasks.googleapis.com",
    "securetoken.googleapis.com",
    "iap.googleapis.com"
  ])
  service            = each.key
  disable_on_destroy = false
}

# Enables Firebase services for the new project created above.
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.default.project_id

  # Waits for the required APIs to be enabled.
  depends_on = [
    google_project_service.default,
  ]
}

# Firebase Web App
resource "google_firebase_web_app" "default" {
  provider     = google-beta
  project      = var.project_id
  display_name = "Todo Web App"

  depends_on = [
    google_firebase_project.default,
  ]
}

# 各種モジュールに locals ファイルを渡す

# Firebase Authentication
module "authentication" {
  source                      = "./modules/authentication"
  project_id                  = var.project_id
  services_ready              = google_firebase_project.default
  iap_brand_support_email     = var.iap_brand_support_email
  iap_brand_application_title = var.iap_brand_application_title
  iap_client_display_name     = var.iap_client_display_name
}

# # Firebase Firestore
module "firestore" {
  source         = "./modules/firestore"
  project_id     = var.project_id
  location       = local.region
  services_ready = google_firebase_project.default
}

# Firebase Cloud Storage
module "storage" {
  source           = "./modules/storage"
  project_id       = var.project_id
  location         = local.region
  services_ready_1 = module.firestore.firestore_database
  services_ready_2 = google_firebase_project.default
}