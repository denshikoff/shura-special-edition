/*
  Интерактивный архив примеров смеха Шуры.
  Подключение в index.html перед </body>:
  <script src="./laugh_examples.js?v=1"></script>

  Важно: файл содержит только несколько отобранных цитат.
  Полный Telegram-экспорт на сайт не загружается.
*/
(() => {
  "use strict";

  const EXAMPLES = {
    "ахаха": [
      { date: "2025-08-09", text: "ахахаха" },
      { date: "2026-03-22", text: "ахахаха внезапно" },
      { date: "2026-04-08", text: "сохры вк листаю ахахаха" },
      { date: "2026-05-13", text: "дело не в них самих аахаха" },
      { date: "2026-06-29", text: "ну ладно все пустился в дело ахахаха" },
      { date: "2026-07-28", text: "подавай вот это все ахахаха" }
    ],
    "длинное ахахах": [
      { date: "2025-08-09", text: "ахахахах спасибо большое!!!!!!!" },
      { date: "2026-02-24", text: "АХАХАХАХАХ" },
      { date: "2026-04-03", text: "а хорошо ахахахах" },
      { date: "2026-04-17", text: "че там глухо ахахахаах" },
      { date: "2026-05-11", text: "это не мой ахахахах" },
      { date: "2026-07-14", text: "ахахахаха постараюсь сделать так чтобы не забыл" }
    ],
    "сломанный смех": [
      { date: "2025-08-09", text: "схсхсхсхсхс" },
      { date: "2026-03-01", text: "ахахсхсхсха" },
      { date: "2026-03-12", text: "ВХАХАХАХА" },
      { date: "2026-03-23", text: "аэаэахсхсхаха" },
      { date: "2026-04-27", text: "ПХАХАХААХ" },
      { date: "2026-06-30", text: "сжмдахахахаха" }
    ],
    "ору / не могу": [
      { date: "2026-02-27", text: "я когда вспоминаю эти переписки каждый раз ржу как в первый" },
      { date: "2026-04-17", text: "орууууу" },
      { date: "2026-04-20", text: "ору че там за песенка заиграла" },
      { date: "2026-05-25", text: "скорее всего приснилось ору" },
      { date: "2026-06-01", text: "орууууууу" },
      { date: "2026-07-24", text: "оруууу" }
    ],
    "😂 / 🤣": [
      { date: "2026-04-08", text: "😂😂😂" },
      { date: "2026-05-15", text: "а многочлен не использовали😂😂😂😂" },
      { date: "2026-05-20", text: "🤣🤣🤣🤣🤣" },
      { date: "2026-06-08", text: "не зарекемся😂😂😂" },
      { date: "2026-06-12", text: "додик🤣🤣🤣🤣" },
      { date: "2026-07-06", text: "🤣🤣🤣🤣🤣" }
    ],
    "хехе / хихи": [
      { date: "2026-01-18", text: "хехе" },
      { date: "2026-02-20", text: "хехе)" },
      { date: "2026-03-11", text: "хехехе да" },
      { date: "2026-04-17", text: "ой спасибки хихи" },
      { date: "2026-05-31", text: "хихихихих" },
      { date: "2026-07-04", text: "хихихи да все хорошо" }
    ]
  };

  const STYLE_ID = "laughExamplesStyles";
  const MODAL_ID = "laughExamplesModal";
  const HINT_ID = "laughExamplesHint";

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatDate(value) {
    const [year, month, day] = String(value).split("-").map(Number);
    if (!year || !month || !day) return value;
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(year, month - 1, day));
  }

  function getLaughMeta(label) {
    const item = Array.isArray(window.LAUGH_DATA)
      ? window.LAUGH_DATA.find(row => String(row.label) === label)
      : null;

    return {
      value: Number(item?.value) || 0,
      note: String(item?.note || "")
    };
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .laugh-examples-hint {
        margin: 13px 0 0;
        color: var(--muted, #cbbfd0);
        font-size: 13px;
        line-height: 1.5;
      }

      .laugh-examples-hint strong {
        color: #ffe1e9;
      }

      #laughBars .bar-row.laugh-row-clickable {
        position: relative;
        margin: -5px -8px;
        padding: 10px 8px;
        border: 1px solid transparent;
        border-radius: 16px;
        cursor: pointer;
        outline: none;
        transition:
          transform .18s ease,
          background .18s ease,
          border-color .18s ease;
      }

      #laughBars .bar-row.laugh-row-clickable:hover,
      #laughBars .bar-row.laugh-row-clickable:focus-visible {
        transform: translateX(4px);
        border-color: rgba(255, 192, 211, .24);
        background: rgba(255, 255, 255, .055);
      }

      #laughBars .bar-row.laugh-row-clickable .bar-label::after {
        content: " ↗";
        color: var(--pink, #ff80a5);
        font-size: 12px;
        opacity: .82;
      }

      .laugh-examples-overlay {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: grid;
        place-items: center;
        padding: 16px;
        background: rgba(6, 4, 8, .72);
        backdrop-filter: blur(13px);
        opacity: 0;
        pointer-events: none;
        transition: opacity .22s ease;
      }

      .laugh-examples-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }

      .laugh-examples-dialog {
        width: min(720px, 100%);
        max-height: min(760px, calc(100vh - 32px));
        overflow: auto;
        position: relative;
        padding: clamp(21px, 5vw, 38px);
        border: 1px solid rgba(255,255,255,.15);
        border-radius: 29px;
        color: var(--text, #fff9f5);
        background:
          radial-gradient(circle at 95% 0%, rgba(255,128,165,.17), transparent 33%),
          linear-gradient(145deg, rgba(43,31,49,.98), rgba(21,15,26,.98));
        box-shadow: 0 32px 110px rgba(0,0,0,.58);
        transform: translateY(16px) scale(.98);
        transition: transform .22s ease;
      }

      .laugh-examples-overlay.open .laugh-examples-dialog {
        transform: translateY(0) scale(1);
      }

      .laugh-examples-close {
        position: sticky;
        top: 0;
        z-index: 2;
        float: right;
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(255,255,255,.14);
        border-radius: 50%;
        color: var(--text, #fff9f5);
        background: rgba(16,12,21,.86);
        cursor: pointer;
        font-size: 24px;
        line-height: 1;
      }

      .laugh-examples-eyebrow {
        margin-bottom: 9px;
        color: var(--pink, #ff80a5);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .12em;
        text-transform: uppercase;
      }

      .laugh-examples-title {
        margin: 0 50px 8px 0;
        font-size: clamp(30px, 7vw, 52px);
        line-height: 1;
        letter-spacing: -.045em;
      }

      .laugh-examples-description {
        margin: 0;
        color: var(--muted, #cbbfd0);
        line-height: 1.55;
      }

      .laugh-examples-tabs {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        margin: 21px 0 18px;
        padding-bottom: 4px;
        scrollbar-width: thin;
      }

      .laugh-examples-tab {
        flex: 0 0 auto;
        padding: 9px 12px;
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 999px;
        color: var(--muted, #cbbfd0);
        background: rgba(255,255,255,.045);
        cursor: pointer;
        font: inherit;
        font-size: 12px;
        font-weight: 750;
      }

      .laugh-examples-tab.active {
        color: #27151f;
        border-color: transparent;
        background: linear-gradient(100deg, var(--pink, #ff80a5), var(--peach, #ffc08d));
      }

      .laugh-examples-list {
        display: grid;
        gap: 10px;
      }

      .laugh-example-card {
        padding: 15px 16px;
        border: 1px solid rgba(255,255,255,.105);
        border-radius: 18px;
        background: rgba(255,255,255,.045);
      }

      .laugh-example-date {
        margin-bottom: 7px;
        color: #aa9bab;
        font-size: 11px;
        letter-spacing: .04em;
        text-transform: uppercase;
      }

      .laugh-example-text {
        font-size: 16px;
        line-height: 1.48;
        overflow-wrap: anywhere;
      }

      .laugh-examples-footer {
        margin: 17px 0 0;
        color: #9f91a1;
        font-size: 12px;
        line-height: 1.5;
      }

      body.laugh-examples-lock {
        overflow: hidden;
      }

      @media (max-width: 560px) {
        .laugh-examples-overlay {
          align-items: end;
          padding: 8px;
        }

        .laugh-examples-dialog {
          max-height: calc(100vh - 16px);
          border-radius: 25px;
        }

        #laughBars .bar-row.laugh-row-clickable {
          margin-inline: -4px;
          padding-inline: 4px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .laugh-examples-overlay,
        .laugh-examples-dialog,
        #laughBars .bar-row.laugh-row-clickable {
          transition: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createModal() {
    if (document.getElementById(MODAL_ID)) return;

    const overlay = document.createElement("div");
    overlay.id = MODAL_ID;
    overlay.className = "laugh-examples-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
      <section
        class="laugh-examples-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="laughExamplesTitle"
      >
        <button
          class="laugh-examples-close"
          type="button"
          aria-label="Закрыть примеры"
        >×</button>

        <div class="laugh-examples-eyebrow">Редакционный архив</div>
        <h3 class="laugh-examples-title" id="laughExamplesTitle"></h3>
        <p class="laugh-examples-description" id="laughExamplesDescription"></p>
        <div class="laugh-examples-tabs" id="laughExamplesTabs"></div>
        <div class="laugh-examples-list" id="laughExamplesList"></div>
        <p class="laugh-examples-footer">
          В спецвыпуск включена только небольшая подборка. Полная переписка
          на сайт не загружалась.
        </p>
      </section>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector(".laugh-examples-close").addEventListener("click", closeModal);
    overlay.addEventListener("click", event => {
      if (event.target === overlay) closeModal();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && overlay.classList.contains("open")) {
        closeModal();
      }
    });
  }

  let lastFocusedElement = null;

  function openModal(label) {
    const overlay = document.getElementById(MODAL_ID);
    if (!overlay || !EXAMPLES[label]) return;

    lastFocusedElement = document.activeElement;
    renderCategory(label);

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("laugh-examples-lock");
    overlay.querySelector(".laugh-examples-close").focus();
  }

  function closeModal() {
    const overlay = document.getElementById(MODAL_ID);
    if (!overlay) return;

    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("laugh-examples-lock");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function renderCategory(label) {
    const meta = getLaughMeta(label);
    const examples = EXAMPLES[label] || [];

    document.getElementById("laughExamplesTitle").textContent = label;
    document.getElementById("laughExamplesDescription").textContent =
      `${meta.value.toLocaleString("ru-RU")} сообщений в категории. ` +
      (meta.note || "Несколько реальных примеров из переписки.");

    document.getElementById("laughExamplesTabs").innerHTML =
      Object.keys(EXAMPLES).map(category => `
        <button
          class="laugh-examples-tab${category === label ? " active" : ""}"
          type="button"
          data-laugh-category="${escapeHtml(category)}"
        >${escapeHtml(category)}</button>
      `).join("");

    document.getElementById("laughExamplesList").innerHTML =
      examples.map(example => `
        <article class="laugh-example-card">
          <div class="laugh-example-date">${escapeHtml(formatDate(example.date))}</div>
          <div class="laugh-example-text">«${escapeHtml(example.text)}»</div>
        </article>
      `).join("");

    document.querySelectorAll("[data-laugh-category]").forEach(button => {
      button.addEventListener("click", () => {
        renderCategory(button.dataset.laughCategory);
      });
    });
  }

  function addHint() {
    if (document.getElementById(HINT_ID)) return;

    const bars = document.getElementById("laughBars");
    if (!bars) return;

    const hint = document.createElement("p");
    hint.id = HINT_ID;
    hint.className = "laugh-examples-hint";
    hint.innerHTML =
      "<strong>Нажми на любую категорию</strong> — редакционный архив покажет реальные примеры.";
    bars.before(hint);
  }

  function decorateRows() {
    const bars = document.getElementById("laughBars");
    if (!bars) return;

    bars.querySelectorAll(".bar-row").forEach(row => {
      if (row.dataset.examplesReady === "true") return;

      const label = row.querySelector(".bar-label")?.textContent?.trim();
      if (!label || !EXAMPLES[label]) return;

      row.dataset.examplesReady = "true";
      row.classList.add("laugh-row-clickable");
      row.tabIndex = 0;
      row.setAttribute("role", "button");
      row.setAttribute("aria-label", `Показать реальные примеры категории «${label}»`);

      row.addEventListener("click", () => openModal(label));
      row.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openModal(label);
        }
      });
    });
  }

  function init() {
    const bars = document.getElementById("laughBars");
    if (!bars) return;

    injectStyles();
    createModal();
    addHint();
    decorateRows();

    const observer = new MutationObserver(decorateRows);
    observer.observe(bars, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
