class JpNav extends HTMLElement {
  connectedCallback() {
    this.update();
  }

  update() {
    const currentPath = window.location.pathname;

    this.innerHTML = `
  <nav>
    <menu>
      <li><a href="/blog">Blog</a></li>
      <li>
			<a href="/projects">Projects</a>
			</li>
      <li><a href="/now">Now</a></li>
      <li><a href="/about">About</a></li>
    </menu>
  </nav>`;
  }
}

customElements.define("jp-nav", JpNav);
