# Website
My website, created using the [Hugo](https://gohugo.io) framework, deployed to [Cloudflare pages](https://pages.cloudflare.com/)

## Deployment

Deployment happens on commits to `master`.


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

