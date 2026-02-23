/* =========================================================
  PORTFÓLIO PREMIUM - JS
  - Partículas (canvas)
  - Navbar mobile
  - ScrollReveal (lib externa leve)
  - Typewriter
  - Botão voltar ao topo
  - Tabs do "Sobre"
  - Barras de skills animadas
  - Toggle tema (salva no localStorage)
========================================================= */

(() => {
  "use strict";

  /* -------------------------
    Helpers
  ------------------------- */
  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

  /* -------------------------
    Ano no footer
  ------------------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------
    Navbar mobile (menu)
  ------------------------- */
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");
  const navLinks = $$(".nav__link");

  const closeMenu = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });

    // Fecha ao clicar em um link
    navLinks.forEach((a) => a.addEventListener("click", closeMenu));

    // Fecha ao clicar fora
    document.addEventListener("click", (e) => {
      const clickedInside = navMenu.contains(e.target) || navToggle.contains(e.target);
      if (!clickedInside) closeMenu();
    });

    // Fecha com ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* -------------------------
    Toggle tema (dark/light)
  ------------------------- */
  const themeToggle = $("#themeToggle");
  const THEME_KEY = "gabriel_portfolio_theme";

  const applyTheme = (theme) => {
    // theme: "dark" | "light"
    if (theme === "light") document.body.classList.add("is-light");
    else document.body.classList.remove("is-light");

    // troca ícone
    if (themeToggle) {
      const icon = themeToggle.querySelector("i");
      if (icon) {
        icon.className = theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
      }
    }
  };

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = document.body.classList.contains("is-light");
      const next = isLight ? "dark" : "light";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  /* -------------------------
    Typewriter (título)
  ------------------------- */
  const typeEl = $("#typewriter");
  const phrases = [
    "Estudante de Desenvolvimento de Sistemas",
    "Back-end",
    "Engenharia de Software"
  ];

  function typewriter(el, texts, typingSpeed = 36, deleteSpeed = 22, pause = 900) {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const tick = () => {
      const current = texts[textIndex];
      if (!isDeleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex >= current.length) {
          isDeleting = true;
          setTimeout(tick, pause);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex <= 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
        }
      }
      setTimeout(tick, isDeleting ? deleteSpeed : typingSpeed);
    };

    tick();
  }

  if (typeEl) typewriter(typeEl, phrases);

  /* -------------------------
    Tabs do Sobre Mim
  ------------------------- */
  const tabs = $$(".tab");
  const panelNatural = $("#tab-natural");
  const panelProf = $("#tab-profissional");

  const setTab = (name) => {
    tabs.forEach((t) => {
      const active = t.dataset.tab === name;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });

    if (panelNatural && panelProf) {
      const isNatural = name === "natural";
      panelNatural.classList.toggle("is-active", isNatural);
      panelProf.classList.toggle("is-active", !isNatural);

      // hidden por acessibilidade (evita leitura duplicada)
      panelNatural.hidden = !isNatural;
      panelProf.hidden = isNatural;
    }
  };

  tabs.forEach((t) =>
    t.addEventListener("click", () => setTab(t.dataset.tab || "natural"))
  );

  /* -------------------------
    Botão "Voltar ao topo"
  ------------------------- */
  const toTop = $("#toTop");
  const toggleToTop = () => {
    if (!toTop) return;
    const show = window.scrollY > 600;
    toTop.classList.toggle("is-visible", show);
  };

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", toggleToTop, { passive: true });
    toggleToTop();
  }

  /* -------------------------
    ScrollReveal (lib importada via CDN no HTML)
    -> Leve e simples. Se remover a lib, o site continua funcionando.
  ------------------------- */
  if (window.ScrollReveal) {
    const sr = ScrollReveal({
      distance: "18px",
      duration: 650,
      easing: "cubic-bezier(.2,.8,.2,1)",
      origin: "bottom",
      interval: 80,
      reset: false
    });

    sr.reveal(".reveal");
  }

  /* -------------------------
    Barras de skills animadas ao entrar na tela
  ------------------------- */
  const skillBars = $$(".skill__bar");

  const fillSkillBars = () => {
    skillBars.forEach((bar) => {
      const level = Number(bar.dataset.level || "0");
      const fill = $(".skill__fill", bar);
      if (!fill) return;
      // trava para não reanimar toda hora
      if (bar.dataset.filled === "1") return;

      fill.style.width = `${Math.max(0, Math.min(100, level))}%`;
      bar.dataset.filled = "1";
    });
  };

  // IntersectionObserver: anima quando a seção aparece
  if ("IntersectionObserver" in window && skillBars.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) fillSkillBars();
        });
      },
      { threshold: 0.25 }
    );

    // observa a primeira barra (já é o suficiente)
    io.observe(skillBars[0]);
  } else {
    // fallback
    fillSkillBars();
  }

  /* =========================================================
    PARTÍCULAS (Canvas) - leve, sem libs
    - Adapta ao tamanho da tela
    - Respeita prefer-reduced-motion
  ========================================================== */
  const canvas = $("#particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let w = 0, h = 0;
  let particles = [];
  let rafId = null;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const resize = () => {
    w = canvas.width = Math.floor(window.innerWidth * (window.devicePixelRatio || 1));
    h = canvas.height = Math.floor(window.innerHeight * (window.devicePixelRatio || 1));
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  };

  const rand = (min, max) => Math.random() * (max - min) + min;

  const createParticles = () => {
    const count = Math.floor(Math.min(120, Math.max(50, window.innerWidth / 12)));
    particles = Array.from({ length: count }, () => ({
      x: rand(0, w),
      y: rand(0, h),
      r: rand(1.2, 2.8) * (window.devicePixelRatio || 1),
      vx: rand(-0.35, 0.35) * (window.devicePixelRatio || 1),
      vy: rand(-0.25, 0.25) * (window.devicePixelRatio || 1),
      a: rand(0.18, 0.55) // alpha
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);

    // Partículas
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // bounce suave nas bordas
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

      // cor dinâmica aproximada (ciano/roxo), sem pesar
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
      gradient.addColorStop(0, `rgba(25, 211, 255, ${p.a})`);
      gradient.addColorStop(1, `rgba(124, 77, 255, 0)`);

      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Conexões (linhas finas)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const maxDist = 160 * (window.devicePixelRatio || 1);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.strokeStyle = `rgba(25, 211, 255, ${alpha})`;
          ctx.lineWidth = 1 * (window.devicePixelRatio || 1) * 0.35;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(draw);
  };

  const start = () => {
    if (prefersReducedMotion) return; // respeita acessibilidade
    cancelAnimationFrame(rafId);
    resize();
    createParticles();
    draw();
  };

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  }, { passive: true });

  start();
})();