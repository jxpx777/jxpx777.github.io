# Blog Articles

## Organization

### Folder Naming Conventions

- **No prefix** (e.g., `20251201-post-title/`) - Published post, appears in feed
- **`~` prefix** (e.g., `~20251210-draft-post/`) - Draft post, excluded from feed (work in progress)
- **`_` prefix** (e.g., `_20210426-old-post/`) - Hidden post, excluded from feed (archived/unlisted but still accessible via URL)

### Featured Posts

To mark posts as "featured", edit `metadata.json`:

```json
{
  "featured": [
    "20251201-lessons-from-linkedin-account-compromise",
    "20250719-apple-music-classical"
  ]
}
```

Featured posts will have `"featured": true` in index.json. The Atom feed remains standards-compliant without custom extensions.

## Usage in Code

### BlogLatestPosts Component

The `BlogLatestPosts` component supports a `featured` attribute to control which posts are displayed:

```html
<!-- Show all posts (default) -->
<blog-latest-posts></blog-latest-posts>

<!-- Show only featured posts -->
<blog-latest-posts featured></blog-latest-posts>

<!-- Exclude featured posts (show only non-featured) -->
<blog-latest-posts featured="skip"></blog-latest-posts>
```

This allows you to have separate sections for featured and regular posts:

```html
<h2>Featured Posts</h2>
<blog-latest-posts featured></blog-latest-posts>

<h2>Latest Posts</h2>
<blog-latest-posts featured="skip"></blog-latest-posts>
```

### Custom Implementation

The component loads `metadata.json` to determine which posts are featured:

```javascript
// Load metadata
const metadata = await fetch("/blog/articles/metadata.json").then(r => r.json());
const featuredSlugs = new Set(metadata.featured || []);

// Parse feed and check if each post is featured
const feedItems = [...data.querySelectorAll("entry")]
  .map(item => {
    const link = pathify(item.querySelector("id")?.textContent);
    const slug = link?.split("/").filter(Boolean).pop();
    return {
      // ...
      featured: featuredSlugs.has(slug),
    };
  })
```

You can then filter or style featured posts:

```javascript
// Get only featured posts
const featuredPosts = feedItems.filter(item => item.featured);

// Add a class to featured posts
<article class="${item.featured ? 'featured' : ''}">
```
