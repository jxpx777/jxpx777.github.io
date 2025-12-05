# AGENTS.md

This file provides guidance to Large Language Model developer tools such as ChatGPT Codex and Claude Code when working in this repository.

## Project Overview

This is a personal website (jxpx777.me) for Jamie Phelps.

## Architecture

### Static HTML Site

No build process required - files can be served directly, deployed via GitHub Pages.

### ES6 Modules

Uses modern JavaScript with ES modules (`type="module"`)

### Web Components

The project makes heavy use of custom HTML elements for recurring structures.

When creating new components, use the `jp-` prefix if one is needed, since this is a personal site specific to Jamie Phelps.

Components are defined in `js/components/` directory

Components use `customElements.define()` for registration. Classes for the custom element should be defined in its own named class and then referenced in the `define` function invocation.

Components shall define an `update` method that is called from `connectedCallback` as well as other handlers such as `MutationObserver` if needed.

Import chain: `index.js` → `components/index.js` → individual component files

#### Constructors

Never define a constructor if it does need to do any customization. For example:

##### 🙅🏻‍♂️ Bad

```
class JpArticleFooter extends HTMLElement {
	constructor() {
		super();
	}
}
```

##### 💁🏻‍♂️ Good

```
class JpArticleFooter extends HTMLElement {
constructor() {
  this.multiplier = Math.PI;
	super();
}
```

### Styling

Rely on the hierarchy of elements first before adding classes and id's. For instance, if the top level `<footer>` will be in a flex layout, you likely don't need to specify anything other than `footer { display: flex; }`. If there are other `<footer>` elements elsewhere, those can be targeted by their cascade such as `article > footer`

#### Nesting

Use native CSS nesting and other cutting edge CSS and Javascript features. We are targeting very recent browsers with this website, so no need to preserve much backward compatibility.

##### 🙅🏻‍♂️ Bad

```
	article footer {
	  font-size: 0.7em;
	}
```

##### 💁🏻‍♂️ Good

```
article {
  footer {
		font-size: 0.7em;
	}
}
```

### Key Files

- `index.html` - Main landing page
- `js/index.js` - Main JavaScript entry point that imports components.
- `js/components/index.js` - Root JS file for wrangling custom components
- `css/main.css` - Primary stylesheet

### Development Notes

- No package.json or build tools - pure static site
- Uses FontAwesome for icons (via CSS and webfonts)
- Responsive design with breakpoint-based layouts
- Template placeholders still contain Lorem ipsum content and "Untitled" branding
