class JpHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
	<header>
  <div class="title">
		<a href="/">Jamie&nbsp;Phelps</a>
	</div>
	<div class="subtitle">
	Smartsure&nbsp;&amp;&nbsp;cocksure
	</div>
	<nav>
    <ul>
			<li><a href="/blog">Blog</a></li>
			<li><a href="/projects">Projects</a></li>
      <li><a href="/now">Now</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
	</header>`;
  }
}

customElements.define("jp-header", JpHeader);
