import './score-side.js';

class GameView extends HTMLElement {
  #game = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          width: 100%;
          height: 100%;
        }

        .game-container {
          display: flex;
          width: 100%;
          height: 100%;
          padding: var(--safe-top) var(--safe-right) var(--safe-bottom) var(--safe-left);
        }

        score-side.left {
          background: var(--color-left);
        }

        score-side.right {
          background: var(--color-right);
        }

        .divider {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          background: var(--color-bg);

          .back-btn {
            background: none;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: var(--color-text);
            border-radius: 50%;
            width: 2rem;
            height: 2rem;
            font-size: 0.9rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      </style>
      <div class="game-container">
        <score-side class="left"></score-side>
        <div class="divider">
          <button class="back-btn" aria-label="Back to game list">&times;</button>
        </div>
        <score-side class="right"></score-side>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.back-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        detail: { view: 'history' },
        bubbles: true,
        composed: true,
      }));
    });

    this.shadowRoot.querySelector('.left').addEventListener('score-change', (e) => {
      this.#updateScore(0, e.detail.delta);
    });
    this.shadowRoot.querySelector('.left').addEventListener('name-change', (e) => {
      this.#updateName(0, e.detail.name);
    });

    this.shadowRoot.querySelector('.right').addEventListener('score-change', (e) => {
      this.#updateScore(1, e.detail.delta);
    });
    this.shadowRoot.querySelector('.right').addEventListener('name-change', (e) => {
      this.#updateName(1, e.detail.name);
    });
  }

  loadGame(game) {
    this.#game = structuredClone(game);
    const left = this.shadowRoot.querySelector('.left');
    const right = this.shadowRoot.querySelector('.right');

    left.setAttribute('name', game.players[0].name);
    left.setAttribute('score', String(game.players[0].score));

    right.setAttribute('name', game.players[1].name);
    right.setAttribute('score', String(game.players[1].score));
  }

  #updateName(playerIndex, name) {
    if (!this.#game) return;
    this.#game.players[playerIndex].name = name;
    this.#emitUpdate();
  }

  #emitUpdate() {
    this.dispatchEvent(new CustomEvent('game-updated', {
      detail: structuredClone(this.#game),
      bubbles: true,
      composed: true,
    }));
  }

  #updateScore(playerIndex, delta) {
    if (!this.#game) return;

    const player = this.#game.players[playerIndex];
    const newScore = player.score + delta;
    if (newScore < 0) return;

    player.score = newScore;

    const sides = this.shadowRoot.querySelectorAll('score-side');
    sides[playerIndex].setAttribute('score', String(newScore));

    this.#emitUpdate();
  }
}

customElements.define('game-view', GameView);
