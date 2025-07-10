function* footnoteGenerator() {
  let count = 1;
  while (true) yield count++;
}

const getNextFootnoteNumber = footnoteGenerator();

customElements.define(
  "jp-footnote",
  class extends HTMLElement {
    #observer;

    constructor() {
      super();
      this.#observer = new MutationObserver(() => this.update());
    }

    connectedCallback() {
      this.#observer.observe(this, { childList: true });

      this.update();
    }

    update() {
      if (!this.hasChildNodes()) return;

      this.#observer.disconnect();

      const container = this.closest("article");
      if (!container) {
        console.warn("<jp-footnote> must be inside an <article>.");
        return;
      }

      const idAttribute = this.getAttribute("id");
      if (!idAttribute) {
        console.warn("<jp-footnote> tag missing id attribute");
        return;
      }

      const number = getNextFootnoteNumber.next().value;
      const id = `fn${idAttribute}`;
      const ref = `#fnref${idAttribute}`;
      const title = this.getAttribute("title");

      // Replace <jp-footnote> with <sup><a>
      const sup = document.createElement("sup");
      const a = document.createElement("a");
      a.href = `#${id}`;
      a.id = `fnref${idAttribute}`;
      a.textContent = `[${number}]`;
      if (title) {
        a.title = title;
      }
      sup.appendChild(a);
      this.replaceWith(sup);

      // Move children into <li>
      const li = document.createElement("li");
      li.id = id;
      li.append(...this.childNodes);

      const backlink = document.createElement("a");
      backlink.href = ref;
      backlink.innerHTML = " ↩";
      li.appendChild(backlink);

      // Append to footnotes footer
      let footnotes = container.querySelector("footer.footnotes");
      if (!footnotes) {
        footnotes = document.createElement("footer");
        footnotes.className = "footnotes";
        footnotes.innerHTML = "<hr>";
        footnotes.appendChild(document.createElement("ol"));
        container.appendChild(footnotes);
      }

      footnotes.querySelector("ol").appendChild(li);
    }
  },
);
