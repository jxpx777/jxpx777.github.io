class BlogArticleFooter extends HTMLElement {
  connectedCallback() {
    this.update();
  }

  update() {
    const article = this.closest("article");
    if (!article) {
      this.innerHTML =
        "<p>Error: jp-article-footer must be inside an article element</p>";
      return;
    }

    const publishedDate = article.getAttribute("data-published");
    const updatedDate = article.getAttribute("data-updated");

    if (!publishedDate) {
      this.innerHTML =
        "<p>Error: article must have data-published attribute</p>";
      return;
    }

    if (publishedDate.indexOf("T") === -1) {
      this.innerHTML =
        "<p>Error: article's publish date is missing time and timezone</p>";
      return;
    }

    const publishedDateObj = new Date(publishedDate);
    const formattedPublished = publishedDateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let updatedHtml = "";
    if (updatedDate) {
      const updatedDateObj = new Date(updatedDate);
      const formattedUpdated = updatedDateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      updatedHtml = `• Updated: <time class="dt-updated" datetime="${updatedDate}">${formattedUpdated}</time>`;
    }

    this.innerHTML = `
      <address class="p-author h-card">
        <a class="p-name u-url" href="https://jxpx777.me" rel="author">Jamie Phelps</a>
        <jp-email user="jamie" domain="jamiephelps.com"></jp-email>
        <noscript>
          <p>Email: (enable JavaScript to view)</p>
        </noscript>
      </address>
      <p>
        <time class="dt-published" datetime="${publishedDate}">${formattedPublished}</time> ${(updatedDate && updatedHtml) || ""}
      </p>
    `;
  }
}

customElements.define("blog-article-footer", BlogArticleFooter);
