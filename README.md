# devtools

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Configurable ICP / 公网安备 备案号

The footer of the site can display registration numbers. Set the following environment variables (e.g. in a `.env` file at the project root) before building:

```env
VITE_ICP_NUMBER=2026005080      # example value without the “京ICP备” prefix
VITE_PUBLIC_SECURITY_NUMBER=11010702003005
```

These values will be injected at build time, and the footer component will only render if at least one is defined.

> **Note:** do **not** commit your `.env` file to version control. It is already included in `.gitignore` by default.

By default the numbers are wrapped with links to the official record search pages and open in a new tab. You can override the URL templates using:

```env
VITE_ICP_LINK=https://some.site/lookup?code={number}
VITE_PUBLIC_SECURITY_LINK=https://another.site/records/{number}
```

The `{number}` placeholder will be replaced with the actual registration value.

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
