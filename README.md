# Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/6d470199-21c2-4c1b-8150-c50946292ccf/deploy-status)](https://app.netlify.com/sites/martinbjeldbak/deploys)

My website, created using the [Hugo](https://gohugo.io) framework.

## Deployment

Deployment happens on commits to `master` via Netlify. See documentation on this [here](https://gohugo.io/hosting-and-deployment/hosting-on-netlify/).


## Infrastructure

Currently managed via Terraform. See terraform files in repository.

* Terraform's GitHub provider does not currently support generating deploy keys on an
individual GitHub account (only organizations), so to provide Netlify access to the repository, the Netlify deploy SSH
key needs to be copied from Netlify into the GitHub repository's deploy keys section. Netlify's
public key can be found in the UI via the `Settings -> Build & Deploy -> Deploy key` section.


## Updating dependencies

To update the theme follow [this](https://gohugo.io/hosting-and-deployment/hosting-on-netlify/#use-hugo-themes-with-netlify) guide. Alternatively the gist of it is

```sh
$ git submodule update --rebase --remote
```

Then, commit the changes made.

## Development

Install hugo with

```sh
brew install hugo
```

You can now run the development server with

```sh
hugo server
```

