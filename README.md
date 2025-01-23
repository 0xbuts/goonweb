# Goon Website

[$GOON](https://polygonscan.com/token/0x433cde5a82b5e0658da3543b47a375dffd126eb6) Website.

## Intro

This is a static site built with [Hugo](https://gohugo.io), and [Bulma](https://bulma.io) as a CSS framework. Bulma has a default theme which can be customized, [see here](#bulma-customization).

[Node](http://nodejs.org/) is being used to handle the dependencies (other than Hugo) and the dev/build process.

## Setup dev environment

1) [Install Hugo](https://gohugo.io/installation/) version 0.131.0 or later
2) [Install Node](https://nodejs.org/en/download) version v18 or later
3) Run `npm i` to install dependencies.
4) Run `npm run build-bulma` to build the customized bulma theme (this step is necessary each time the theme is modified, [see here](#bulma-customization)).

## Run local web server

Run `npm run dev` to start a local web server with live reloading (if you change a file the site is automatically reloaded in the browser for you).

## Bulma customization

The Bulma theme is in `assets/sass/bulma.scss`.

To build it, run `npm run build-bulma`.
To iterate it you can run `npm run watch-bulma`, which runs the build automatically after modifying it. This triggers a live reload if you are running a [local web server](#run-local-web-server), so you can see the changes automatically.

## CSS

The CSS that aren't part of the Bulma theme are written in `assets/sass/main.scss` and are automatically compiled by hugo on the fly. So if you don't need to modify the theme, you only need to run `npm run dev` and everything is compiled on the fly live.
