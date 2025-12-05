customElements.define(
  "jp-book",
  class extends HTMLElement {
    connectedCallback() {
      const data = {
        title: this.getAttribute("title"),
        author: this.getAttribute("author"),
        url: this.getAttribute("url"),
        year: this.getAttribute("year"),
        publisher: this.getAttribute("publisher"),
        place: this.getAttribute("place"),
        lang: this.getAttribute("lang"),
        isbn: this.getAttribute("isbn"),
        format: this.getAttribute("format") || "short",
        // New (preformatted strings; you control punctuation & “and”/commas)
        editors: (this.getAttribute("editors") || "").trim(),
        translators: (this.getAttribute("translators") || "").trim(),
      };

      let html = "";

      switch (data.format) {
        case "long":
          html = renderLong(data);
          break;
        case "short":
        default:
          html = renderShort(data);
          break;
      }

      this.innerHTML = html;
    }
  },
);

function renderShort(data) {
  const { title, author, url, publisher, year, isbn, editors, translators } =
    data;

  const citeHTML = url
    ? `<a href="${url}" class="p-name u-url"><cite>${title}</cite></a>`
    : `<cite class="p-name">${title}</cite>`;

  const authorHTML = `<span class="p-author h-card">${author}</span>`;

  const hoverParts = [];
  if (publisher) hoverParts.push(publisher);
  if (year) hoverParts.push(year);
  if (isbn) hoverParts.push(`ISBN: ${isbn}`);
  // Add editors/translators to hover for extra context (short stays visually compact)
  if (editors) hoverParts.push(`Edited by ${editors}`);
  if (translators) hoverParts.push(`Translated by ${translators}`);

  const titleAttr = hoverParts.length
    ? ` title="${title} by ${author}${hoverParts.length ? ", " + hoverParts.join(", ") : ""}"`
    : "";

  return `
		<span class="h-cite"${titleAttr}>
			${citeHTML} by ${authorHTML}
		</span>
	`;
}

// Keeping for reference, unchanged behavior
function renderLongOld(data) {
  const { title, author, url, publisher, year, isbn } = data;

  const citeHTML = url
    ? `<a href="${url}" class="p-name u-url"><cite>${title}</cite></a>`
    : `<cite class="p-name">${title}</cite>`;

  const authorHTML = `<span class="p-author h-card">${author}</span>`;

  const parts = [];
  parts.push(`${citeHTML}. By ${authorHTML}`);

  const pubParts = [];
  if (publisher) pubParts.push(`<span class="p-publisher">${publisher}</span>`);
  if (year)
    pubParts.push(
      `<time class="dt-published" datetime="${year}">${year}</time>`,
    );

  if (pubParts.length) {
    let pubText = pubParts.join(", ");
    if (isbn) {
      pubText += `; ISBN <span class="u-uid">${isbn}</span>`;
    }
    parts.push(pubText + ".");
  } else if (isbn) {
    parts.push(`ISBN <span class="u-uid">${isbn}</span>.`);
  }

  return `<span class="h-cite">${parts.join(" ")}</span>`;
}

function renderLong(data) {
  const {
    title,
    author,
    url,
    publisher,
    place,
    year,
    isbn,
    editors,
    translators,
  } = data;

  const titleHTML = url
    ? `<a href="${url}" class="p-name u-url"><cite>${title}</cite></a>`
    : `<cite class="p-name">${title}</cite>`;
  const authorHTML = `<span class="p-author h-card">${author}</span>`;
  const yearHTML = year
    ? `<time class="dt-published" datetime="${year}">${year}</time>`
    : "";

  let parts = [];

  // author + title (unchanged structure)
  parts.push(`${authorHTML}. ${titleHTML}. `);

  // NEW: post-title contributors (microformats-friendly)
  const contribBits = [];
  if (editors) {
    // p-contributor is the mf2 class for additional credited persons
    contribBits.push(
      `Edited by <span class="p-contributor h-card">${editors}</span>`,
    );
  }
  if (translators) {
    contribBits.push(
      `Translated by <span class="p-contributor h-card">${translators}</span>`,
    );
  }
  if (contribBits.length) {
    parts.push(contribBits.join("; ") + ". ");
  }

  // publication segment (as before)
  let pubSegment = "";
  if (place && publisher && yearHTML) {
    pubSegment = `${place}: <span class="p-publisher">${publisher}</span>, ${yearHTML}. `;
  } else if (place && publisher) {
    pubSegment = `${place}: <span class="p-publisher">${publisher}</span>. `;
  } else if (publisher && yearHTML) {
    pubSegment = `<span class="p-publisher">${publisher}</span>, ${yearHTML}. `;
  } else if (publisher) {
    pubSegment = `<span class="p-publisher">${publisher}</span>. `;
  } else if (place && yearHTML) {
    pubSegment = `${place}, ${yearHTML}. `;
  } else if (yearHTML) {
    pubSegment = `${yearHTML}. `;
  }
  if (pubSegment) parts.push(pubSegment);

  // ISBN (unchanged; semicolon rule)
  if (isbn) {
    parts[parts.length - 1] = parts[parts.length - 1].replace(/\.\s*$/, "");
    parts.push(`; ISBN <span class="u-uid">${isbn}</span>.`);
  }

  return `<span class="h-cite">${parts.join("")}</span>`;
}
