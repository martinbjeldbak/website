# Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/9c62e30d-74f1-4506-90cf-090cdf66b078/deploy-status)](https://app.netlify.com/sites/martinbjeldbak-v2/deploys)

My website, created using the [Hugo](https://gohugo.io) framework.

## Deployment

Deployment happens on commits to `master` via Netlify. See documentation on this [here](https://gohugo.io/hosting-and-deployment/hosting-on-netlify/).


## Infrastructure

Currently managed via Terraform. See terraform files in repository.

* Terraform's GitHub provider does not currently support generating deploy keys on an
individual GitHub account (only organizations), so to provide Netlify access to the repository,
the Netlify deploy SSH key needs to be copied from Netlify into the GitHub repository's deploy
keys section. Netlify's public key can be found in the UI via the
`Settings -> Build & Deploy -> Deploy key` section.

To view the plan to create the Netlify site with a custom domain, run the below command

```sh
$ terraform plan -var-file="sensitive.tfvars"
```


## Updating dependencies

To update the theme follow [this](https://gohugo.io/hosting-and-deployment/hosting-on-netlify/#use-hugo-themes-with-netlify) guide. Alternatively the gist of it is

```sh
$ git submodule update --rebase --remote
```

Then, commit the changes made.

## Development

Install hugo with

```sh
brew install hugo terraform
```

You can now run the development server with

```sh
hugo server
```

