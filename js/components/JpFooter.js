class JpFooter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <footer>
          <p>&copy;&nbsp;2025 Jamie Phelps</p>
      </footer>
    `;
  }
}

customElements.define("jp-footer", JpFooter);
