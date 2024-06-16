provider "cloudflare" {
  email   = var.cloudflare_email
  api_key = var.cloudflare_api_key
}

resource "cloudflare_pages_project" "nextjs_project" {
  account_id = var.cloudflare_account_id
  name       = var.project_name

  production_branch = var.production_branch
  source {
    type = "github"
    config {
      owner             = var.github_owner
      repo_name         = var.github_repo
      production_branch = var.production_branch
      branch            = var.production_branch
    }
  }

  build_config {
    build_command   = "npm run build"
    destination_dir = "out"
    root_dir        = "/apps/frontend"
  }

  environment {
    name = "production"
  }
}
