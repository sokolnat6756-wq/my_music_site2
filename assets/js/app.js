/* =========================================================
   Natalya Sokol — основная логика сайта
   ========================================================= */

/* ============================================================
   КОНФИГУРАЦИЯ — ОБЯЗАТЕЛЬНО ОТРЕДАКТИРУЙТЕ ЭТОТ БЛОК
   Здесь вы указываете свои контакты, чтобы кнопки и форма работали.
   ============================================================ */
const CONFIG = {
  // Ваш Telegram username без @ (например: "natalya_sokol")
  telegramUsername: "kamnatusya",

  // Ваш WhatsApp в международном формате БЕЗ + и пробелов
  // (например, для номера +7 999 123-45-67 укажите "79991234567")
  whatsappPhone: "79269365996",

  // Текст по умолчанию для кнопок «Написать в Telegram» / «WhatsApp»
  // (без формы — просто прямые ссылки)
  defaultMessage: "Здравствуйте, Наталья! Хочу заказать у Вас песню."
};

/* ============================================================
   ИНИЦИАЛИЗАЦИЯ ПОСЛЕ ЗАГРУЗКИ DOM
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initContactLinks();
  initHeader();
  initMobileMenu();
  initHeroLoad();
  initReveal();
  initRevealStagger();
  initStatCounters();
  initFloatingCTA();
  initOrderModal();
  initSmoothScroll();
  initAudioPlayers();
});

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ============================================================
   Hero — каскадная анимация при загрузке страницы
   ============================================================ */
function initHeroLoad() {
  const hero = document.querySelector(".hero-section");
  if (!hero) return;
  requestAnimationFrame(() => {
    hero.classList.add("hero-loaded");
  });
}

/* ============================================================
   Контактные ссылки (Telegram, WhatsApp)
   ============================================================ */
function initContactLinks() {
  const tg = document.getElementById("telegram-link");
  const wa = document.getElementById("whatsapp-link");

  if (tg) {
    tg.href = `https://t.me/${encodeURIComponent(CONFIG.telegramUsername)}?text=${encodeURIComponent(CONFIG.defaultMessage)}`;
  }
  if (wa) {
    wa.href = `https://wa.me/${encodeURIComponent(CONFIG.whatsappPhone)}?text=${encodeURIComponent(CONFIG.defaultMessage)}`;
  }
}

/* ============================================================
   Header — изменение фона при скролле
   ============================================================ */
function initHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const toggle = () => header.classList.toggle("scrolled", window.scrollY > 40);
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
}

/* ============================================================
   Мобильное меню
   ============================================================ */
function initMobileMenu() {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobile-menu");
  if (!burger || !menu) return;

  const close = () => {
    burger.classList.remove("active");
    menu.classList.add("hidden");
  };

  burger.addEventListener("click", () => {
    const isOpen = burger.classList.toggle("active");
    menu.classList.toggle("hidden", !isOpen);
  });

  menu.querySelectorAll(".mobile-link, [data-open-order]").forEach(el => {
    el.addEventListener("click", close);
  });
}

/* ============================================================
   Reveal-анимация при скролле (через IntersectionObserver)
   ============================================================ */
function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length || !("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute("data-reveal-delay") || 0;
        setTimeout(() => entry.target.classList.add("is-visible"), Number(delay));
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(el => io.observe(el));
}

/* ============================================================
   Stagger — карточки песен и шаги процесса по очереди
   ============================================================ */
function initRevealStagger() {
  const groups = document.querySelectorAll("[data-reveal-stagger]");
  if (!groups.length) return;

  const reduced = prefersReducedMotion();
  const stepMs = 110;

  const showGroup = (group) => {
    const items = group.querySelectorAll("[data-reveal-stagger-item]");
    if (reduced) {
      items.forEach(el => el.classList.add("is-visible"));
      return;
    }
    items.forEach((el, i) => {
      setTimeout(() => el.classList.add("is-visible"), i * stepMs);
    });
  };

  if (!("IntersectionObserver" in window)) {
    groups.forEach(showGroup);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      showGroup(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  groups.forEach(g => io.observe(g));
}

/* ============================================================
   Счётчик «100+» в блоке «О Наталье»
   ============================================================ */
function initStatCounters() {
  const counters = document.querySelectorAll("[data-count-to]");
  if (!counters.length) return;

  const animate = (el) => {
    const to = Number(el.dataset.countTo) || 0;
    const suffix = el.dataset.countSuffix || "";
    if (prefersReducedMotion()) {
      el.textContent = to + suffix;
      return;
    }
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(to * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animate);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  counters.forEach(el => io.observe(el));
}

/* ============================================================
   Плавающая CTA-кнопка
   ============================================================ */
function initFloatingCTA() {
  const cta = document.getElementById("float-cta");
  if (!cta) return;
  const toggle = () => cta.classList.toggle("is-visible", window.scrollY > 600);
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
}

/* ============================================================
   Плавная прокрутка (для якорей #songs, #about и т.д.)
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* ============================================================
   Модальное окно заказа
   ============================================================ */
function initOrderModal() {
  const modal = document.getElementById("order-modal");
  const form = document.getElementById("order-form");
  if (!modal || !form) return;

  const openers = document.querySelectorAll("[data-open-order]");
  const closers = modal.querySelectorAll("[data-close-order], .modal-overlay");

  const open = () => {
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => modal.classList.add("is-visible"));
    setTimeout(() => {
      const firstInput = form.querySelector("input, select, textarea");
      if (firstInput) firstInput.focus();
    }, 350);
  };

  const close = () => {
    modal.classList.remove("is-visible");
    document.body.classList.remove("modal-open");
    setTimeout(() => modal.classList.remove("is-open"), 350);
  };

  openers.forEach(btn => btn.addEventListener("click", (e) => {
    e.preventDefault();
    open();
  }));
  closers.forEach(btn => btn.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleOrderSubmit(form, close);
  });
}

/* ============================================================
   Обработка отправки формы — открывает Telegram / WhatsApp
   с предзаполненным сообщением
   ============================================================ */
function handleOrderSubmit(form, onSuccess) {
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());

  const lines = [
    "🎵 Заявка на персональную песню",
    "",
    `👤 Имя: ${data.name || "—"}`,
    `🎉 Событие: ${data.event || "—"}`,
    data.date ? `📅 Дата: ${formatDate(data.date)}` : null,
    "",
    "📝 История:",
    data.story || "—",
    "",
    data.contact ? `📞 Контакт: ${data.contact}` : null
  ].filter(Boolean);

  const message = lines.join("\n");

  let url;
  if (data.channel === "whatsapp") {
    url = `https://wa.me/${encodeURIComponent(CONFIG.whatsappPhone)}?text=${encodeURIComponent(message)}`;
  } else {
    url = `https://t.me/${encodeURIComponent(CONFIG.telegramUsername)}?text=${encodeURIComponent(message)}`;
  }

  window.open(url, "_blank", "noopener");

  form.reset();
  if (typeof onSuccess === "function") onSuccess();
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

/* ============================================================
   Кастомный аудио-плеер
   - Создаёт скрытый <audio> и красивые кнопки/прогресс-бар
   - Только один трек играет одновременно
   ============================================================ */
const allPlayers = [];

function initAudioPlayers() {
  document.querySelectorAll(".custom-player").forEach(buildPlayer);
}

function buildPlayer(root) {
  const src = root.dataset.src;
  const title = root.dataset.title || "";

  root.innerHTML = `
    <button class="player-btn" type="button" aria-label="Воспроизвести">
      ${iconPlay()}
    </button>
    <div class="player-body">
      <div class="player-title">${escapeHtml(title)}</div>
      <div class="player-progress-wrap">
        <div class="player-progress">
          <div class="player-progress-fill"></div>
          <div class="player-progress-thumb"></div>
        </div>
        <div class="player-time">0:00 / 0:00</div>
      </div>
    </div>
    <audio preload="none" src="${src}"></audio>
  `;

  const btn = root.querySelector(".player-btn");
  const audio = root.querySelector("audio");
  const fill = root.querySelector(".player-progress-fill");
  const thumb = root.querySelector(".player-progress-thumb");
  const progress = root.querySelector(".player-progress");
  const time = root.querySelector(".player-time");

  let isPlaying = false;

  const update = () => {
    const cur = audio.currentTime || 0;
    const dur = audio.duration || 0;
    const pct = dur ? (cur / dur) * 100 : 0;
    fill.style.width = pct + "%";
    thumb.style.left = pct + "%";
    time.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
  };

  const play = () => {
    allPlayers.forEach(p => { if (p !== api) p.pause(); });
    root.classList.add("is-loading");
    audio.play().then(() => {
      root.classList.remove("is-loading");
      root.classList.add("is-playing");
      isPlaying = true;
      btn.innerHTML = iconPause();
      btn.setAttribute("aria-label", "Пауза");
    }).catch(() => {
      root.classList.remove("is-loading", "is-playing");
      root.classList.add("is-error");
    });
  };

  const pause = () => {
    audio.pause();
    isPlaying = false;
    root.classList.remove("is-playing");
    btn.innerHTML = iconPlay();
    btn.setAttribute("aria-label", "Воспроизвести");
  };

  btn.addEventListener("click", () => {
    if (isPlaying) pause(); else play();
  });

  audio.addEventListener("timeupdate", update);
  audio.addEventListener("loadedmetadata", update);
  audio.addEventListener("ended", () => {
    isPlaying = false;
    root.classList.remove("is-playing");
    btn.innerHTML = iconPlay();
    audio.currentTime = 0;
    update();
  });
  audio.addEventListener("error", () => {
    root.classList.add("is-error");
    root.classList.remove("is-loading");
  });

  progress.addEventListener("click", (e) => {
    const rect = progress.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    if (audio.duration) audio.currentTime = pct * audio.duration;
  });

  const api = { pause };
  allPlayers.push(api);

  update();
}

function formatTime(sec) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function iconPlay() {
  return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;
}
function iconPause() {
  return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
