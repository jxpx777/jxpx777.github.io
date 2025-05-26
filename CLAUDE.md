# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website based on the "Elevation" template by Pixelarity. It's a personal website (jxpx777.me) with a landing page layout containing sections for features, content showcases, and contact information.

## Architecture

- **Static HTML Site**: No build process required - files can be served directly
- **ES6 Modules**: Uses modern JavaScript with ES modules (`type="module"`)
- **Web Components**: Custom elements pattern with `<jp-header>` component
- **Template Structure**: Based on Pixelarity's Elevation template with custom modifications

### Key Files

- `index.html` - Main landing page (production version with custom header component)
- `js/index.js` - Main JavaScript entry point that imports components
- `js/components/JpHeader.js` - Custom header web component
- `css/main.css` - Primary stylesheet

### Component System

The site uses vanilla Web Components:

- Components are defined in `js/components/` directory
- `JpHeader` component replaces static header HTML with reusable custom element
- Components use `customElements.define()` for registration
- Import chain: `index.js` → `components/index.js` → individual component files

### Development Notes

- No package.json or build tools - pure static site
- Uses FontAwesome for icons (via CSS and webfonts)
- Responsive design with breakpoint-based layouts
- Template placeholders still contain Lorem ipsum content and "Untitled" branding
