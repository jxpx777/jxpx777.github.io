class JpFooter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <footer>
          <p>&copy;&nbsp;2025&nbsp;<a href="https://jxpx777.me" rel="me">Jamie&nbsp;Phelps</a></p>
					<p>Made with care in Olympia, Washington<br>🌲</p>
      </footer>
    `;
  }
}

customElements.define("jp-footer", JpFooter);
