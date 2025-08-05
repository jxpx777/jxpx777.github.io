function* footnoteGenerator() {
  let count = 1;
  while (true) yield count++;
}

const getNextFootnoteNumber = footnoteGenerator();

function createFootnoteRef(idAttribute, title) {
  const id = `fn-${idAttribute}`;
  const number = getNextFootnoteNumber.next().value;

  const sup = document.createElement("sup");
  const a = document.createElement("a");
  a.href = `#${id}`;
  a.id = `fnref-${idAttribute}`;
  a.textContent = `[${number}]`;
  a.className = "footnote";
  if (title) a.title = title;
  sup.appendChild(a);
  return sup;
}

customElements.define(
  "jp-footnote",
  class extends HTMLElement {
    connectedCallback() {
      const idAttribute = this.getAttribute("id");
      if (!idAttribute) {
        console.warn("<jp-footnote> tag missing id attribute");
        return;
      }

      if (!this.querySelector("sup")) {
        const title = this.getAttribute("title");
        const sup = createFootnoteRef(idAttribute, title);
        this.appendChild(sup);
      }
    }
  },
);
