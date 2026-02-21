class HistoryView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          width: 100%;
          height: 100%;
        }

        .history-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          height: 100%;
          padding: 2rem;
          padding-top: calc(var(--safe-top, 0px) + 2rem);
          padding-bottom: calc(var(--safe-bottom, 0px) + 2rem);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;

          h1 {
            font-size: 1.5rem;
            font-weight: 300;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-bottom: 1.5rem;
          }

          .new-game-btn {
            background: var(--color-left, #e94560);
            color: var(--color-text, #eee);
            border: none;
            border-radius: 0.5rem;
            padding: 0.75rem 2rem;
            font-size: 1rem;
            font-family: inherit;
            cursor: pointer;
            margin-bottom: 2rem;
          }

          .game-list {
            list-style: none;
            width: 100%;
            max-width: 24rem;

            .game-item {
              display: flex;
              align-items: center;
              padding: 0.75rem 1rem;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              cursor: pointer;
              gap: 0.75rem;

              &:active {
                background: rgba(255, 255, 255, 0.05);
              }

              .game-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 0.2rem;

                .game-players {
                  font-size: 0.95rem;
                }

                .game-meta {
                  display: flex;
                  gap: 0.75rem;
                  align-items: baseline;

                  .game-scores {
                    font-size: 0.85rem;
                    font-variant-numeric: tabular-nums;
                    opacity: 0.7;
                  }

                  .game-date {
                    font-size: 0.75rem;
                    opacity: 0.4;
                  }
                }
              }

              .delete-btn {
                background: none;
                border: none;
                color: var(--color-text, #eee);
                opacity: 0.3;
                font-size: 1.1rem;
                padding: 0.25rem 0.5rem;
                cursor: pointer;
                flex-shrink: 0;

                &:active {
                  opacity: 0.8;
                }
              }
            }
          }

          .empty {
            opacity: 0.4;
            font-size: 0.9rem;
            margin-top: 1rem;
          }
        }
      </style>
      <div class="history-container">
        <h1>Tally Marks</h1>
        <button class="new-game-btn">New Game</button>
        <ul class="game-list"></ul>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.new-game-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('new-game', {
        bubbles: true,
        composed: true,
      }));
    });

    this.shadowRoot.querySelector('.game-list').addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.delete-btn');
      if (deleteBtn) {
        const item = deleteBtn.closest('.game-item');
        if (item) {
          this.dispatchEvent(new CustomEvent('game-deleted', {
            detail: { id: item.dataset.id },
            bubbles: true,
            composed: true,
          }));
        }
        return;
      }

      const item = e.target.closest('.game-item');
      if (!item) return;
      this.dispatchEvent(new CustomEvent('game-selected', {
        detail: { id: item.dataset.id },
        bubbles: true,
        composed: true,
      }));
    });
  }

  loadGames(games) {
    const list = this.shadowRoot.querySelector('.game-list');
    list.innerHTML = '';

    if (games.length === 0) {
      list.innerHTML = '<li class="empty">No games yet.</li>';
      return;
    }

    for (const game of games) {
      const li = document.createElement('li');
      li.className = 'game-item';
      li.dataset.id = game.id;

      const info = document.createElement('div');
      info.className = 'game-info';

      const players = document.createElement('span');
      players.className = 'game-players';
      players.textContent = `${game.players[0].name} vs ${game.players[1].name}`;

      const meta = document.createElement('div');
      meta.className = 'game-meta';

      const scores = document.createElement('span');
      scores.className = 'game-scores';
      scores.textContent = `${game.players[0].score} \u2013 ${game.players[1].score}`;

      const date = document.createElement('span');
      date.className = 'game-date';
      date.textContent = new Date(game.updatedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });

      meta.appendChild(scores);
      meta.appendChild(date);
      info.appendChild(players);
      info.appendChild(meta);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.setAttribute('aria-label', 'Delete game');
      deleteBtn.textContent = '\u2715';

      li.appendChild(info);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    }
  }
}

customElements.define('history-view', HistoryView);
