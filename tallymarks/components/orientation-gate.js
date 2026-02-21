class OrientationGate extends HTMLElement {
  #portraitQuery = null;
  #mobileQuery = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: var(--color-bg, #1a1a2e);
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        :host([visible]) {
          display: flex;
        }

        .gate {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem;

          .icon {
            font-size: 3rem;
          }

          .message {
            font-size: 1rem;
            opacity: 0.7;
            line-height: 1.5;
            max-width: 20rem;
          }
        }
      </style>
      <div class="gate">
        <div class="icon"></div>
        <p class="message"></p>
      </div>
    `;
  }

  connectedCallback() {
    // Use viewport size to detect mobile vs desktop so that Safari's
    // responsive design mode on Mac is treated as a mobile device.
    // 1024px covers iPads; anything wider is treated as desktop.
    this.#mobileQuery = window.matchMedia('(max-width: 1024px)');
    this.#portraitQuery = window.matchMedia('(orientation: portrait)');

    this.#mobileQuery.addEventListener('change', this.#evaluate);
    this.#portraitQuery.addEventListener('change', this.#evaluate);
    this.#evaluate();
  }

  disconnectedCallback() {
    this.#mobileQuery?.removeEventListener('change', this.#evaluate);
    this.#portraitQuery?.removeEventListener('change', this.#evaluate);
  }

  #evaluate = () => {
    const isMobile = this.#mobileQuery.matches;
    const isPortrait = this.#portraitQuery.matches;

    if (!isMobile) {
      this.#show('laptop', 'Open this page on your phone or tablet for the best experience.');
    } else if (isPortrait) {
      this.#show('rotate', 'Rotate your device to landscape to play.');
    } else {
      this.#hide();
    }
  };

  #show(type, message) {
    const icons = { laptop: '\uD83D\uDCBB', rotate: '\uD83D\uDD04' };
    this.shadowRoot.querySelector('.icon').textContent = icons[type] || '';
    this.shadowRoot.querySelector('.message').textContent = message;
    this.setAttribute('visible', '');
  }

  #hide() {
    this.removeAttribute('visible');
  }
}

customElements.define('orientation-gate', OrientationGate);
