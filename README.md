[![npm version](https://badge.fury.io/js/turbo-view-transitions.svg)](https://badge.fury.io/js/turbo-view-transitions)
[![Test](https://github.com/palkan/turbo-view-transitions/workflows/Test/badge.svg)](https://github.com/palkan/turbo-view-transitions/actions)

# Turbo View Transitions

[Turbo][] plugin to use [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API). This plugin allows you to animate transitions of specific elements between pages by adding `data-turbo-transition` attribute to them.

> [!NOTE]
> Although this library named after Turbo, it can be used with any other HTML-driven application. See, for example, how we [use it with Docsify](https://github.com/anycable/docs.anycable.io/commit/e49d916e920aa6402e4d3cfffa122eebe0f2cb5f) for [docs.anycable.io](https://docs.anycable.io).

## Installation

Using npm:

```sh
npm install turbo-view-transitions
```

Using yarn:

```sh
yarn add turbo-view-transitions
```

## Usage

The primary goal of this library is to allow animated _objects_ on the page in HTML driven applications. When you have a _collection page_ and a _single object_ page and want to animate the transition between them, you can hit the following problem: there cannot be multiple elements with the same `view-transition-name` style defined on the page. To overcome this limitation, this library helps to identify matching elements and add the `view-transition-name` style on-the-fly and only for the duration of the transition. All you need is to add a `data-turbo-transition="<transition-name>"` attribute to the elements you want to animate.

### Basic Turbo usage

Here is how you can use this plugin to animate Turbo (v7) navigation with View Trantisions:

```js
import { shouldPerformTransition, performTransition } from "turbo-view-transitions";

document.addEventListener("turbo:before-render", (event) => {
  if (shouldPerformTransition()) {
    event.preventDefault();

    performTransition(document.body, event.detail.newBody, async () => {
      await event.detail.resume();
    });
  }
});

document.addEventListener("turbo:load", () => {
  // View Transitions don't play nicely with Turbo cache
  if (shouldPerformTransition()) Turbo.cache.exemptPageFromCache();
});
```

> See [Turbo Music Drive](https://github.com/palkan/turbo-music-drive) application for a full-featured example.

### API

#### `shouldPerformTransition`

This function returns true iff both of the following conditions are satisfied:

- `document.startViewTransition` function is defined.
- `<meta name="view-transition">` element is present on the page. This meta is used to control whether the transition should be performed or not.

Use this function to check if the transitions are going to be performed or not.

#### `performTransition`

This is the main interface of this library. It's a wrapper over `document.startViewTransition` function which marks matching elements from _before_ and _after_ states with the `view-transition-name: ...` style to activate object transitions (see the Turbo example above).

This function requires you to provide old and new HTML elements as well as the callback function which responsible for the actual HTML update:

```js
const oldEl = document.body;
const newEl = document.createElement('body');
newEl.innerHTML = '<...some html from wherever...>';

performTransition(oldEl, newEl, () => {
  // Update the DOM
  document.body.replaceWith(newEl);
});
```

The elements with the `data-turbo-transition` attributes will be matched, and the corresponding `view-transition-name` style will be applied to them according to the following rules:

- If the value of the `data-turbo-transition` attribute is non-empty then it will be used as the value of the `view-transition-name` style.
- If the value of the `data-turbo-transition` attribute is empty then the `view-transition-name` will be equal to the `"$" + (el.id || "0")`.
- The `view-transition-name` is only added to elements if they are present in both old and new HTML (and have the same transition name if it's specified).
- If there are multiple elements with the same `view-transition-name` present in the old or new HTML then the **none will be activated** (i.e., the `view-transition-name` style won't be added to them).
- During the transition, the `data-turbo-transition-active` attribute is added to all activated elements (so you can use it to style them).

You can customize attribute names used to identify and mark elements by passing the `options` object as the last argument:

```js
performTransition(oldEl, newEl, () => {
  // Update the DOM
  document.body.replaceWith(newEl);
}, {
  transitionAttr: 'data-view-transition',
  activeAttr: 'data-active-view-transition',
});
```

## Using with bundlers

This library is distributed as an ES module (ESM). It works out of the box with modern bundlers like Webpack, Rollup, esbuild, and others.

### Symfony Webpack Encore

[Webpack Encore](https://symfony.com/doc/current/frontend.html) is Symfony's wrapper around Webpack. To use this library with Encore:

1. First, install the package:

    ```sh
    npm install turbo-view-transitions
    # or
    yarn add turbo-view-transitions
    ```

2. Import it in your JavaScript file (e.g., `assets/app.js`):

    ```js
    import { shouldPerformTransition, performTransition } from "turbo-view-transitions";
    ```

3. Run the build:

    ```sh
    npm run build
    # or
    yarn build
    ```

If you encounter module resolution errors, make sure:
- The package is listed in your `package.json` dependencies
- You've run `npm install` or `yarn install` after adding the dependency

[Turbo]: https://turbo.hotwire.dev/
