class TallyGroup extends HTMLElement {
  static observedAttributes = ['count'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const count = Math.min(5, Math.max(0, parseInt(this.getAttribute('count') || '0', 10)));
    if (count === 0) {
      this.shadowRoot.innerHTML = '';
      return;
    }

    const lines = [];
    for (let i = 0; i < Math.min(count, 4); i++) {
      const x = 4 + i * 8;
      lines.push(`<line x1="${x}" y1="2" x2="${x}" y2="26"/>`);
    }
    if (count === 5) {
      lines.push(`<line x1="0" y1="22" x2="32" y2="6" class="diagonal"/>`);
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          width: 2.5em;
          height: 1.75em;
        }
        svg {
          width: 100%;
          height: 100%;
        }
        line {
          stroke: var(--tally-color, #eee);
          stroke-width: 2.5;
          stroke-linecap: round;
        }
      </style>
      <svg viewBox="0 0 40 28" preserveAspectRatio="xMidYMid meet">
        ${lines.join('\n        ')}
      </svg>
    `;
  }
}

customElements.define('tally-group', TallyGroup);
