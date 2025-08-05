import { html } from "/js/lib/html.js";

class BlogArchive extends HTMLElement {
  connectedCallback() {
    this.textContent = "Loading...";
    fetch(import.meta.resolve("/blog/articles/index.json"))
      .then((response) => response.json())
      .then((articles) => {
        // sort articles by published descending
        articles.sort((a, b) => {
          return -a.published.localeCompare(b.published);
        });
        this.innerHTML = articles
          .map(
            (item) => html`
              <article>
                <time datetime="${item.published}">
                  ${new Date(item.published).toLocaleDateString("en-US", {
                    dateStyle: "long",
                  })}
                </time>
                <h2>
                  <a
                    href="${import.meta.resolve(
                      `/blog/articles/${item.slug}/`,
                    )}"
                    >${item.title}</a
                  >
                </h2>
                <p>${item.summary}</p>
              </article>
            `,
          )
          .join("\n");
      })
      .catch((e) => {
        this.textContent = e.message;
      });
  }
}

customElements.define("blog-archive", BlogArchive);
