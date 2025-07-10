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
	<jp-nav></jp-nav>
	</header>`;
  }
}

customElements.define("jp-header", JpHeader);
