class JpEmail extends HTMLElement {
  connectedCallback() {
    this.update();
  }

  update() {
    const user = this.getAttribute("user");
    const domain = this.getAttribute("domain");

    if (!user || !domain) return;

    const email = `${user}@${domain}`;
    const link = document.createElement("a");
    link.href = `mailto:${email}`;
    link.textContent = email;
    link.setAttribute(
      "aria-label",
      `Email ${user.charAt(0).toUpperCase() + user.slice(1)}`,
    );

    this.replaceChildren(link);
  }

  static get observedAttributes() {
    return ["user", "domain"];
  }

  attributeChangedCallback() {
    this.update();
  }
}

customElements.define("jp-email", JpEmail);
