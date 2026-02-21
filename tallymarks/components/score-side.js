import './tally-group.js';

class ScoreSide extends HTMLElement {
  static observedAttributes = ['name', 'score'];

  #startY = 0;
  #startX = 0;
  #startTime = 0;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex: 1;
          touch-action: none;
        }

        .side {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 1rem;
          gap: 0.5rem;

          .player-name {
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            opacity: 0.6;
            background: none;
            border: none;
            border-bottom: 1px solid transparent;
            color: inherit;
            font-family: inherit;
            text-align: center;
            width: 8rem;
            padding: 0.25rem;

            &:focus {
              outline: none;
              border-bottom-color: rgba(255, 255, 255, 0.4);
              opacity: 1;
            }
          }

          .tally-area {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.25em 0.75em;
            flex: 1;
            align-content: center;
            --tally-color: var(--color-text, #eee);
          }

          .score-number {
            font-size: 2rem;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
          }

          .swipe-hint {
            font-size: 0.75rem;
            opacity: 0.3;
          }
        }

        .side.flash {
          animation: pulse 0.15s ease-out;
        }

        @keyframes pulse {
          0% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
          100% { filter: brightness(1); }
        }
      </style>
      <div class="side">
        <input class="player-name" type="text" maxlength="12" enterkeyhint="done">
        <div class="tally-area"></div>
        <span class="score-number">0</span>
        <span class="swipe-hint">swipe to score</span>
      </div>
    `;
  }

  connectedCallback() {
    this.addEventListener('touchstart', this.#onTouchStart, { passive: false });
    this.addEventListener('touchmove', this.#onTouchMove, { passive: false });
    this.addEventListener('touchend', this.#onTouchEnd, { passive: false });

    const nameInput = this.shadowRoot.querySelector('.player-name');
    nameInput.addEventListener('input', () => {
      this.dispatchEvent(new CustomEvent('name-change', {
        detail: { name: nameInput.value },
        bubbles: true,
        composed: true,
      }));
    });
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') nameInput.blur();
    });

    this.render();
  }

  disconnectedCallback() {
    this.removeEventListener('touchstart', this.#onTouchStart);
    this.removeEventListener('touchmove', this.#onTouchMove);
    this.removeEventListener('touchend', this.#onTouchEnd);
  }

  attributeChangedCallback() {
    if (this.shadowRoot.querySelector('.side')) {
      this.render();
    }
  }

  get score() {
    return parseInt(this.getAttribute('score') || '0', 10);
  }

  get #nameInputFocused() {
    return this.shadowRoot.activeElement?.classList.contains('player-name');
  }

  #onTouchStart = (e) => {
    if (this.#nameInputFocused) return;
    const touch = e.touches[0];
    this.#startY = touch.clientY;
    this.#startX = touch.clientX;
    this.#startTime = Date.now();
  };

  #onTouchMove = (e) => {
    if (this.#nameInputFocused) return;
    e.preventDefault();
  };

  #onTouchEnd = (e) => {
    if (this.#nameInputFocused) return;
    const touch = e.changedTouches[0];
    const deltaY = touch.clientY - this.#startY;
    const deltaX = touch.clientX - this.#startX;
    const elapsed = Date.now() - this.#startTime;

    if (Math.abs(deltaY) < 30 || elapsed > 500) return;
    if (Math.abs(deltaX) >= Math.abs(deltaY)) return;

    const delta = deltaY > 0 ? 1 : -1;

    if (delta === -1 && this.score <= 0) return;

    this.#flash();

    this.dispatchEvent(new CustomEvent('score-change', {
      detail: { delta },
      bubbles: true,
      composed: true,
    }));
  };

  #flash() {
    const side = this.shadowRoot.querySelector('.side');
    side.classList.remove('flash');
    void side.offsetWidth;
    side.classList.add('flash');
  }

  render() {
    const name = this.getAttribute('name') || '';
    const score = this.score;

    const nameEl = this.shadowRoot.querySelector('.player-name');
    const tallyArea = this.shadowRoot.querySelector('.tally-area');
    const scoreNum = this.shadowRoot.querySelector('.score-number');
    const hint = this.shadowRoot.querySelector('.swipe-hint');

    if (nameEl !== this.shadowRoot.activeElement) {
      nameEl.value = name;
    }
    scoreNum.textContent = score;
    hint.style.display = score > 0 ? 'none' : '';

    this.setAttribute('aria-label', `${name} score: ${score}`);

    const fullGroups = Math.floor(score / 5);
    const remainder = score % 5;

    tallyArea.innerHTML = '';
    for (let i = 0; i < fullGroups; i++) {
      const tg = document.createElement('tally-group');
      tg.setAttribute('count', '5');
      tallyArea.appendChild(tg);
    }
    if (remainder > 0) {
      const tg = document.createElement('tally-group');
      tg.setAttribute('count', String(remainder));
      tallyArea.appendChild(tg);
    }
  }
}

customElements.define('score-side', ScoreSide);
