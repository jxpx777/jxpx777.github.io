class JpHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
<header>
        <h1><a href="index.html">Elevation</a></h1>
        <nav id="nav">
          <ul>
            <li><a href="index.html">Home</a></li>
            <li>
              <a href="#" class="icon solid fa-angle-down">Page Layouts</a>
              <ul>
                <li><a href="left-sidebar.html">Left Sidebar</a></li>
                <li><a href="right-sidebar.html">Right Sidebar</a></li>
                <li><a href="no-sidebar.html">No Sidebar</a></li>
                <li>
                  <a href="#">Submenu</a>
                  <ul>
                    <li><a href="#">Option 1</a></li>
                    <li><a href="#">Option 2</a></li>
                    <li><a href="#">Option 3</a></li>
                    <li><a href="#">Option 4</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><a href="elements.html">Elements</a></li>
          </ul>
        </nav>
      </header>

		`;
  }
}

customElements.define("jp-header", JpHeader);
