provider "netlify" {
  token    = var.netlify_token
  version  = "~> 0.4"
}

resource "netlify_deploy_key" "key" {}

resource "netlify_site" "martinbjeldbak-com" {
  name = "martinbjeldbak-v2"

  repo {
    repo_branch   = "master"
    command       = "hugo --gc"
    deploy_key_id = netlify_deploy_key.key.id
    dir           = "build"
    provider      = "github"
    repo_path     = "martinbjeldbak/website"
  }
}