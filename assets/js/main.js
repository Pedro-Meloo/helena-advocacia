/* Helena Martins Advocacia — comportamento e animações */
(() => {
  "use strict";
  const C = window.SITE_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const digits = (s) => String(s || "").replace(/\D/g, "");

  /* ---------- Dados do config nos elementos ---------- */
  const waUrl = (msg) => `https://wa.me/${digits(C.whatsapp)}?text=${encodeURIComponent(msg || C.whatsappMessage || "")}`;
  const ig = String(C.instagram || "").replace(/^@/, "");

  $$("[data-cfg]").forEach((el) => {
    const v = C[el.dataset.cfg];
    if (v) el.textContent = v;
    else (el.closest("[data-cfg-wrap]") || el).hidden = true;
  });
  $$("[data-link]").forEach((a) => {
    const t = a.dataset.link;
    if (t === "wa") {
      a.href = waUrl(a.dataset.msg);
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    } else if (t === "tel") a.href = "tel:+55" + digits(C.phone);
    else if (t === "mail") a.href = "mailto:" + (C.email || "");
    else if (t === "ig") {
      if (!ig) return (a.closest("[data-cfg-wrap]") || a).setAttribute("hidden", "");
      a.href = "https://instagram.com/" + ig;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
  });

  const demo = $(".demo-pill");
  if (demo) demo.hidden = !C.demo;

  const map = $("[data-map]");
  if (map) {
    if (C.mapQuery) {
      const f = document.createElement("iframe");
      f.src = "https://www.google.com/maps?q=" + encodeURIComponent(C.mapQuery) + "&output=embed";
      f.loading = "lazy";
      f.title = "Localização do escritório no Google Maps";
      f.referrerPolicy = "no-referrer-when-downgrade";
      map.replaceChildren(f);
    }
  }
  const yr = $("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Cabeçalho: estado ao rolar + barra de progresso ---------- */
  const header = $(".site-header");
  const bar = $(".progress");
  const wa = $(".wa-float");
  let ticking = false;

  const onScroll = () => {
    const y = scrollY;
    header && header.classList.toggle("is-scrolled", y > 24);
    wa && wa.classList.toggle("is-visible", y > 420);
    if (bar) {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
    }
    parallax();
    words();
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);

  /* ---------- Menu mobile ---------- */
  const toggle = $(".menu-toggle");
  const menu = $(".mobile-menu");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.inert = !open;
    if (open) $("a", menu).focus({ preventScroll: true });
  };
  if (toggle && menu) {
    menu.inert = true;
    toggle.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("menu-open")) { setMenu(false); toggle.focus(); } });
    matchMedia("(min-width: 1081px)").addEventListener("change", (m) => m.matches && setMenu(false));
  }

  /* ---------- Revelações ao rolar ---------- */
  $$("[data-stagger]").forEach((p) => $$(":scope > *", p).forEach((c, i) => {
    c.setAttribute("data-reveal", "");
    c.style.setProperty("--d", i * 90 + "ms");
  }));
  $$(".lines").forEach((h) => $$(".line", h).forEach((l, i) => l.style.setProperty("--i", i)));
  $$(".steps li").forEach((li, i) => li.style.setProperty("--i", i));

  const startReveal = () => {
    const targets = $$("[data-reveal], .lines, .img-reveal.is-clip, .arch-line, .arch-outline, .signature, .steps");
    if (reduce || !("IntersectionObserver" in window)) return targets.forEach((t) => t.classList.add("is-in"));
    // elementos totalmente cortados por clip-path nunca "intersectam": observa-se o pai
    const hidden = ".is-clip, .arch-line, .arch-outline, .signature";
    const watch = new Map();
    targets.forEach((t) => {
      const w = t.matches(hidden) ? t.parentElement : t;
      watch.set(w, [...(watch.get(w) || []), t]);
    });
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { watch.get(e.target).forEach((t) => t.classList.add("is-in")); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    watch.forEach((_, w) => io.observe(w));
  };
  // espera as fontes para a revelação das linhas não "pular"
  const go = () => requestAnimationFrame(() => { startReveal(); onScroll(); });
  if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(go);
  else go();

  /* ---------- Profundidade (parallax discreto, só telas largas) ---------- */
  const px = $$("[data-parallax]");
  function parallax() {
    if (reduce || !px.length) return;
    const wide = innerWidth > 900;
    px.forEach((el) => {
      if (!wide) { el.style.transform = ""; return; }
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      const c = r.top + r.height / 2 - innerHeight / 2;
      el.style.transform = `translate3d(0, ${(c * parseFloat(el.dataset.parallax)).toFixed(1)}px, 0)`;
    });
  }

  /* ---------- Declaração: palavras acendem com a rolagem ---------- */
  const stmts = $$("[data-words]").map((p) => {
    const t = p.textContent.trim().split(/\s+/);
    p.setAttribute("aria-label", p.textContent.trim());
    p.innerHTML = t.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(" ");
    return { p, w: $$(".w", p) };
  });
  function words() {
    stmts.forEach(({ p, w }) => {
      if (reduce) return;
      const r = p.getBoundingClientRect();
      const prog = clamp((innerHeight * 0.82 - r.top) / (r.height + innerHeight * 0.3), 0, 1);
      const lit = prog * w.length;
      w.forEach((s, i) => (s.style.opacity = (0.2 + 0.8 * clamp(lit - i, 0, 1)).toFixed(2)));
    });
  }

  /* ---------- Movimento do retrato com o mouse ---------- */
  const tilt = $("[data-tilt]");
  if (tilt && !reduce && matchMedia("(hover: hover) and (min-width: 1081px)").matches) {
    const img = $("img", tilt);
    tilt.addEventListener("pointermove", (e) => {
      const r = tilt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      img.style.transform = `scale(1.05) translate(${(-x * 14).toFixed(1)}px, ${(-y * 14).toFixed(1)}px)`;
    });
    tilt.addEventListener("pointerleave", () => (img.style.transform = ""));
  }

  /* ---------- Áreas de atuação (acordeão) ---------- */
  const areas = $$(".area");
  const setArea = (a, open) => {
    a.classList.toggle("is-open", open);
    $(".area-head", a).setAttribute("aria-expanded", String(open));
    $(".area-panel", a).inert = !open;
  };
  areas.forEach((a) => {
    setArea(a, false);
    $(".area-head", a).addEventListener("click", () => {
      const open = !a.classList.contains("is-open");
      areas.forEach((o) => o !== a && setArea(o, false));
      setArea(a, open);
    });
  });

  /* ---------- Transição suave entre páginas ---------- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === "_blank" || a.hasAttribute("download") || reduce) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || !/(\.html?|\/)$/.test(u.pathname)) return;
    if (u.pathname === location.pathname) return; // âncora na mesma página
    e.preventDefault();
    document.body.classList.add("leaving");
    setTimeout(() => (location.href = a.href), 320);
  });
  addEventListener("pageshow", (e) => e.persisted && document.body.classList.remove("leaving"));

  onScroll();
})();
