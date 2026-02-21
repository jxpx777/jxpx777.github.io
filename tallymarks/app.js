import './components/orientation-gate.js';
import './components/game-view.js';
import './components/history-view.js';

const STORAGE_KEY = 'tallymarks_games';
const ACTIVE_KEY = 'tallymarks_active_game_id';

const GameStore = {
  _read() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },

  _write(games) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  },

  list() {
    return this._read().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  get(id) {
    return this._read().find((g) => g.id === id) || null;
  },

  create() {
    const recent = this.list()[0];
    const leftName = recent?.players[0]?.name || 'Left';
    const rightName = recent?.players[1]?.name || 'Right';

    const game = {
      id: 'g_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      players: [
        { name: leftName, score: 0 },
        { name: rightName, score: 0 },
      ],
    };
    const games = this._read();
    games.push(game);
    this._write(games);
    this.setActive(game.id);
    return game;
  },

  delete(id) {
    const games = this._read().filter((g) => g.id !== id);
    this._write(games);
    if (this.getActive() === id) {
      localStorage.removeItem(ACTIVE_KEY);
    }
  },

  update(gameData) {
    const games = this._read();
    const idx = games.findIndex((g) => g.id === gameData.id);
    if (idx !== -1) {
      gameData.updatedAt = new Date().toISOString();
      games[idx] = gameData;
      this._write(games);
    }
  },

  getActive() {
    return localStorage.getItem(ACTIVE_KEY);
  },

  setActive(id) {
    localStorage.setItem(ACTIVE_KEY, id);
  },
};

function switchView(name) {
  document.body.dataset.view = name;
  if (name === 'history') {
    document.querySelector('history-view').loadGames(GameStore.list());
  }
}

let saveTimer = null;

document.addEventListener('new-game', () => {
  const game = GameStore.create();
  document.querySelector('game-view').loadGame(game);
  switchView('game');
});

document.addEventListener('game-selected', (e) => {
  const game = GameStore.get(e.detail.id);
  if (game) {
    GameStore.setActive(game.id);
    document.querySelector('game-view').loadGame(game);
    switchView('game');
  }
});

document.addEventListener('game-updated', (e) => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    GameStore.update(e.detail);
  }, 300);
});

document.addEventListener('game-deleted', (e) => {
  GameStore.delete(e.detail.id);
  document.querySelector('history-view').loadGames(GameStore.list());
});

document.addEventListener('navigate', (e) => {
  switchView(e.detail.view);
});

// Startup
const activeId = GameStore.getActive();
const activeGame = activeId ? GameStore.get(activeId) : null;

if (activeGame) {
  document.querySelector('game-view').loadGame(activeGame);
  switchView('game');
} else {
  switchView('history');
}
