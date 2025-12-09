import { html } from "../../lib/html.js";

const pathify = url => url && new URL(url).pathname;

class BlogLatestPosts extends HTMLElement {
  connectedCallback() {
    this.textContent = "Loading...";
    const featuredAttr = this.getAttribute("featured");
    const showOnlyFeatured = this.hasAttribute("featured") && featuredAttr !== "skip";
    const skipFeatured = featuredAttr === "skip";

    // Load metadata and feed in parallel
    Promise.all([
      fetch(import.meta.resolve("/blog/articles/metadata.json"))
        .then(response => response.json())
        .catch(() => ({ featured: [] })), // fallback if no metadata
      fetch(import.meta.resolve("/blog/feed.xml"))
        .then(response => response.text())
        .then(text => new DOMParser().parseFromString(text, "text/xml"))
    ])
      .then(([metadata, data]) => {
        const parserError = data.querySelector("parsererror div");
        if (parserError) {
          throw new Error(parserError.textContent);
        }

        const featuredSlugs = new Set(metadata.featured || []);

        // only the 6 most recent entries
        const feedItems = [...data.querySelectorAll("entry")]
          .map(item => {
            const link = pathify(item.querySelector("id")?.textContent);
            const slug = link?.split("/").filter(Boolean).pop();
            return {
              title: item.querySelector("title")?.textContent,
              link,
              published: item.querySelector("published")?.textContent,
              updated: item.querySelector("updated")?.textContent,
              summary: item.querySelector("summary")?.textContent,
              image: pathify(item.querySelector("content")?.getAttribute("url")),
              featured: featuredSlugs.has(slug),
            };
          })
          // sanity check
          .filter(item => item.link && item.title)
          // filter by featured attribute
          .filter(item => {
            if (showOnlyFeatured) return item.featured;
            if (skipFeatured) return !item.featured;
            return true;
          })
          .slice(0, 6);
        if (feedItems.length) {
          this.innerHTML = feedItems
            .map(
              item => html`
                <time datetime="${item.published}">
                  ${new Date(item.published).toLocaleDateString("en-US", {
                    dateStyle: "long",
                  })}
                </time>
                <article>
                  ${item.image
                    ? html`<img
                        src="${item.image}"
                        aria-hidden="true"
                        loading="lazy" />`
                    : ""}
                  <h3><a href="${item.link}">${item.title}</a></h3>
                  <p>${item.summary}</p>
                </article>
              `,
            )
            .join("\n");
        } else {
          this.innerHTML = "Something went wrong...";
        }
      })
      .catch(e => (this.textContent = e.message));
  }
}
customElements.define("blog-latest-posts", BlogLatestPosts);
