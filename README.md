# Website
My website, created using the [Hugo](https://gohugo.io) framework, deployed to [Cloudflare pages](https://pages.cloudflare.com/)

## Deployment

Deployment happens on commits to `master`.


## Updating dependencies

Ensure submodules are pulled, such as themes in the `themes/` folder.

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
