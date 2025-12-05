const DAY_IN_MS = 24 * 60 * 60 * 1000;
const BIRTHDAY_EMOJIS = ["🥳", "🎂", "🎈", "🎉"];

const parseISODate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(Date.UTC(year, month - 1, day));
};

const formatISODate = (date) => date.toISOString().slice(0, 10);

const addDays = (date, amount) => new Date(date.getTime() + amount * DAY_IN_MS);

const todayUTC = () => {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
};

class WeekNote extends HTMLElement {
  connectedCallback() {
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "tooltip");
    }
  }
}

class LifeWeek extends HTMLElement {
  static observedAttributes = ["title"];

  #childObserver;
  #suppressTitleReaction = false;

  constructor() {
    super();
    this.#handleMouseEnter = this.#handleMouseEnter.bind(this);
    this.#handleMouseLeave = this.#handleMouseLeave.bind(this);
  }

  connectedCallback() {
    if (!this.tabIndex) {
      this.tabIndex = -1;
    }

    if (!this.#childObserver) {
      this.#childObserver = new MutationObserver(() =>
        this.refreshAnnotationState(),
      );
    }

    this.#childObserver.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    this.addEventListener("mouseenter", this.#handleMouseEnter);
    this.addEventListener("mouseleave", this.#handleMouseLeave);
    this.addEventListener("focus", this.#handleMouseEnter);
    this.addEventListener("blur", this.#handleMouseLeave);

    this.refreshAnnotationState();
  }

  disconnectedCallback() {
    this.#childObserver?.disconnect();
    this.removeEventListener("mouseenter", this.#handleMouseEnter);
    this.removeEventListener("mouseleave", this.#handleMouseLeave);
    this.removeEventListener("focus", this.#handleMouseEnter);
    this.removeEventListener("blur", this.#handleMouseLeave);
  }

  attributeChangedCallback(name) {
    if (name === "title" && !this.#suppressTitleReaction) {
      this.refreshAnnotationState();
    }
  }

  hasAnnotation() {
    if (this.dataset.inlineBirthday === "true") {
      return Boolean(this.querySelector("week-note"));
    }
    if (this.querySelector("week-note")) return true;
    if (this.textContent.trim().length > 0) return true;
    const title = this.getAttribute("title");
    if (title && this.dataset.eraTitle !== "true" && !this.dataset.birthdayLabel)
      return true;
    return false;
  }

  refreshAnnotationState() {
    const note = this.querySelector("week-note");
    if (note) {
      const currentTitle = this.getAttribute("title");
      if (currentTitle) {
        this.dataset.storedTitle = currentTitle;
        this.#suppressTitleReaction = true;
        this.removeAttribute("title");
        this.#suppressTitleReaction = false;
      }
    } else if (!this.hasAttribute("title") && this.dataset.storedTitle) {
      this.#suppressTitleReaction = true;
      this.setAttribute("title", this.dataset.storedTitle);
      this.#suppressTitleReaction = false;
      delete this.dataset.storedTitle;
    }

    this.classList.toggle("annotated", this.hasAnnotation());
  }

  #handleMouseEnter() {
    const note = this.querySelector("week-note");
    if (!note) return;
    note.classList.remove("above", "below", "left", "right");

    const rect = this.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const space = {
      above: rect.top,
      below: viewportHeight - rect.bottom,
      left: rect.left,
      right: viewportWidth - rect.right,
    };
    let placement = "above";
    let maxSpace = space.above;
    for (const [direction, value] of Object.entries(space)) {
      if (value > maxSpace) {
        maxSpace = value;
        placement = direction;
      }
    }

    note.classList.add(placement);
  }

  #handleMouseLeave() {
    const note = this.querySelector("week-note");
    if (!note) return;
    note.classList.remove("above", "below", "left", "right");
  }
}

class JpEra extends HTMLElement {
  static observedAttributes = ["from", "to", "label"];

  connectedCallback() {
    this.#notifyGrid();
  }

  attributeChangedCallback() {
    this.#notifyGrid();
  }

  #notifyGrid() {
    const grid = this.closest("life-grid");
    grid?.update();
  }
}

class LifeGrid extends HTMLElement {
  static observedAttributes = ["born", "years"];

  connectedCallback() {
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "list");
    }
    this.update();
  }

  attributeChangedCallback() {
    this.update();
  }

  update() {
    if (!this.isConnected) return;
    const bornDate = parseISODate(this.getAttribute("born"));
    if (!bornDate) return;

    const now = todayUTC();
    this.querySelectorAll("life-week[date]").forEach((week) => {
      const weekStart = parseISODate(week.getAttribute("date"));
      if (!weekStart) return;
      this.#decorateWeek({ week, weekStart, now, bornDate });
      week.refreshAnnotationState?.();
    });
  }

  #decorateWeek({ week, weekStart, now, bornDate }) {
    const era = week.closest("jp-era");
    const eraLabel = era?.getAttribute("label")?.trim();
    const hasEraTitle = week.dataset.eraTitle === "true";
    const isInlineBirthday = week.dataset.inlineBirthday === "true";
    const hasUserAnnotation = week.hasAnnotation?.() ?? false;

    const weekEnd = addDays(weekStart, 7);
    const isPast = now >= weekEnd;
    const isFuture = now < weekStart;
    const isCurrent = !isPast && !isFuture;
    week.classList.toggle("past", isPast);
    week.classList.toggle("future", isFuture);
    week.classList.toggle("current", isCurrent);

    const birthdayLabel = this.#birthdayLabel(weekStart, bornDate);
    if (birthdayLabel) {
      week.classList.add("birthday");
      week.dataset.age = String(birthdayLabel.age);
      week.dataset.birthdayLabel = birthdayLabel.text;
      const showInlineBirthday = !hasUserAnnotation;
      week.classList.toggle("birthday-inline", showInlineBirthday);
      if (showInlineBirthday) {
        week.dataset.inlineBirthday = "true";
        week.textContent = birthdayLabel.text;
      } else if (isInlineBirthday) {
        week.textContent = "";
        delete week.dataset.inlineBirthday;
      }
      if (!hasUserAnnotation && !week.hasAttribute("title")) {
        week.setAttribute("title", birthdayLabel.text);
      }
    } else {
      week.classList.remove("birthday");
      week.classList.remove("birthday-inline");
      delete week.dataset.age;
      delete week.dataset.birthdayLabel;
      if (isInlineBirthday) {
        week.textContent = "";
        delete week.dataset.inlineBirthday;
      }
    }

    if (eraLabel && !hasUserAnnotation && !week.hasAttribute("title")) {
      week.setAttribute("title", eraLabel);
      week.dataset.eraTitle = "true";
    } else if ((!eraLabel || hasUserAnnotation) && hasEraTitle) {
      week.removeAttribute("title");
      delete week.dataset.eraTitle;
    }
  }

  #birthdayLabel(weekStart, bornDate) {
    const bornMonth = bornDate.getUTCMonth();
    const bornDay = bornDate.getUTCDate();
    const year = weekStart.getUTCFullYear();
    const birthday = new Date(Date.UTC(year, bornMonth, bornDay));
    if (birthday < bornDate) return null;
    if (birthday >= weekStart && birthday < addDays(weekStart, 7)) {
      const age = birthday.getUTCFullYear() - bornDate.getUTCFullYear();
      const emoji = BIRTHDAY_EMOJIS[age % BIRTHDAY_EMOJIS.length];
      return { text: `${emoji} Turned ${age}`, age };
    }
    return null;
  }
}

customElements.define("week-note", WeekNote);
customElements.define("life-week", LifeWeek);
customElements.define("jp-era", JpEra);
customElements.define("life-grid", LifeGrid);
