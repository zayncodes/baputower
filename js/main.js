/* ═══════════════════════════════════════════════════════
   Beyond Dining — animation & interaction engine
   GSAP + ScrollTrigger + Lenis
   ═══════════════════════════════════════════════════════ */

(() => {
  "use strict";

  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ── Smooth scrolling (Lenis) ── */
  let lenis = null;
  if (!prefersReduced) {
    lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const scrollToTarget = (target) => {
    const el = document.querySelector(target);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  /* ── Anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href.length > 1) {
        e.preventDefault();
        closeMenu();
        scrollToTarget(href);
      }
    });
  });

  /* ── Split text helper (words → masked lines) ── */
  const splitToLines = (el) => {
    const text = el.innerHTML;
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = "";
    const probe = document.createElement("span");
    probe.innerHTML = text;
    el.appendChild(probe);
    // Wrap each word to measure line breaks
    const words = probe.innerHTML.split(/\s+/).filter(Boolean);
    probe.innerHTML = words.map((w) => `<span class="w" style="display:inline-block">${w}</span>`).join(" ");
    const lines = [];
    let lastTop = null;
    probe.querySelectorAll(".w").forEach((w) => {
      const top = w.offsetTop;
      if (top !== lastTop) { lines.push([]); lastTop = top; }
      lines[lines.length - 1].push(w.innerHTML);
    });
    el.innerHTML = lines
      .map((line) => `<span class="line" aria-hidden="true"><span>${line.join(" ")}</span></span>`)
      .join("");
    return el.querySelectorAll(".line > span");
  };

  /* ═══════════ PRELOADER ═══════════ */
  const preloader = document.getElementById("preloader");
  const counter = document.getElementById("preloaderCount");
  const bar = document.getElementById("preloaderBar");
  const nav = document.getElementById("nav");

  const introHero = () => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".hero__panel", { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 1.3, ease: "power4.inOut" }, 0.05)
      .to(".hero__img", { scale: 1.08, duration: 2.4, ease: "power2.out" }, 0.3)
      .fromTo(".hero__eyebrow span", { yPercent: 120 }, { yPercent: 0, duration: 0.9 }, 0.15)
      .fromTo(".hero__title-line > span", { yPercent: 115 }, { yPercent: 0, duration: 1.2, stagger: 0.12, ease: "power4.out" }, 0.25)
      .fromTo(".hero__sub", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 0.7)
      .fromTo(".hero__cta", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 0.85)
      .fromTo(".hero__footer", { opacity: 0 }, { opacity: 1, duration: 1 }, 1.1)
      .add(() => nav.classList.add("is-ready"), 0.9);
    // These elements are animated by the intro, not the generic reveal
    document.querySelectorAll(".hero [data-reveal]").forEach((el) => el.removeAttribute("data-reveal"));
  };

  if (prefersReduced) {
    preloader.remove();
    nav.classList.add("is-ready");
    gsap.set(".hero__title-line > span, .hero__img", { clearProps: "all" });
    document.querySelectorAll(".hero [data-reveal]").forEach((el) => el.removeAttribute("data-reveal"));
  } else {
    document.body.style.overflow = "hidden";
    const load = { n: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        preloader.remove();
        introHero();
      },
    });
    tl.fromTo("#preloaderWord",
        { opacity: 0, y: 26, filter: "blur(14px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.15, ease: "power3.out" })
      .to(".preloader__tag", { opacity: 1, duration: 0.7 }, "-=0.5")
      .to(load, {
        n: 100, duration: 1.6, ease: "power2.inOut",
        onUpdate: () => { counter.textContent = String(Math.round(load.n)).padStart(2, "0"); },
      }, "-=0.5")
      .to(bar, { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, "<")
      .to(".preloader__inner", { opacity: 0, y: -30, duration: 0.5, ease: "power2.in" }, "+=0.15")
      .to(".preloader__curtain--2", { scaleY: 1, duration: 0.55, ease: "power3.inOut" }, "-=0.1")
      .to(".preloader__curtain--1", { scaleY: 1, duration: 0.55, ease: "power3.inOut" }, "-=0.38")
      .to(preloader, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "+=0.05");
  }

  /* ═══════════ CUSTOM CURSOR ═══════════ */
  if (isFinePointer && !prefersReduced) {
    const cursor = document.getElementById("cursor");
    const dot = cursor.querySelector(".cursor__dot");
    const ring = cursor.querySelector(".cursor__ring");
    const label = cursor.querySelector(".cursor__label");
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { x: pos.x, y: pos.y };

    window.addEventListener("mousemove", (e) => { pos.x = e.clientX; pos.y = e.clientY; }, { passive: true });
    gsap.ticker.add(() => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      dot.style.left = pos.x + "px"; dot.style.top = pos.y + "px";
      ring.style.left = ringPos.x + "px"; ring.style.top = ringPos.y + "px";
    });

    const labels = { view: "View", drag: "Drag" };
    document.querySelectorAll("[data-cursor]").forEach((el) => {
      const mode = el.getAttribute("data-cursor");
      el.addEventListener("mouseenter", () => {
        if (labels[mode]) { cursor.classList.add("is-label"); label.textContent = labels[mode]; }
        else cursor.classList.add("is-hover");
      });
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover", "is-label"));
    });
  } else {
    const c = document.getElementById("cursor");
    if (c) c.remove();
  }

  /* ═══════════ NAV BEHAVIOUR ═══════════ */
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle("is-scrolled", y > 60);
      if (y > 400 && y > lastY + 4 && !document.getElementById("fsmenu").classList.contains("is-open")) {
        nav.classList.add("is-hidden");
      } else if (y < lastY - 4) {
        nav.classList.remove("is-hidden");
      }
      lastY = y;
    },
  });

  /* ═══════════ FULLSCREEN MENU ═══════════ */
  const burger = document.getElementById("burger");
  const fsmenu = document.getElementById("fsmenu");
  let menuOpen = false;
  const menuTl = gsap.timeline({ paused: true });
  gsap.set(".fsmenu__bg", { yPercent: -100 });
  gsap.set(".fsmenu__link span", { yPercent: 120 });
  menuTl
    .to(".fsmenu__bg", { yPercent: 0, duration: 0.7, ease: "power4.inOut" })
    .to(".fsmenu__link span", { yPercent: 0, duration: 0.7, stagger: 0.06, ease: "power3.out" }, "-=0.25")
    .fromTo(".fsmenu__aside", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.4");

  function openMenu() {
    menuOpen = true;
    fsmenu.classList.add("is-open");
    fsmenu.setAttribute("aria-hidden", "false");
    burger.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    nav.classList.remove("is-hidden");
    if (lenis) lenis.stop();
    menuTl.timeScale(1).play();
  }
  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    if (lenis) lenis.start();
    menuTl.timeScale(1.6).reverse().eventCallback("onReverseComplete", () => {
      fsmenu.classList.remove("is-open");
      fsmenu.setAttribute("aria-hidden", "true");
    });
  }
  burger.addEventListener("click", () => (menuOpen ? closeMenu() : openMenu()));
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  /* ═══════════ SCROLL-TRIGGERED REVEALS ═══════════ */
  if (!prefersReduced) {
    // Eyebrow line reveals
    document.querySelectorAll("[data-reveal-line] span").forEach((el) => {
      gsap.fromTo(el, { yPercent: 130 }, {
        yPercent: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el.parentElement, start: "top 88%" },
      });
    });

    // Split headline reveals
    document.querySelectorAll("[data-split-lines]").forEach((el) => {
      const lines = splitToLines(el);
      gsap.to(lines, {
        y: 0, yPercent: 0, duration: 1.1, stagger: 0.1, ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
        startAt: { yPercent: 125 },
      });
    });

    // Generic fade-up reveals with per-section stagger
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 88%",
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out", overwrite: true }),
    });

    // Clip-path mask reveals for imagery
    document.querySelectorAll("[data-reveal-mask]").forEach((el) => {
      gsap.to(el, {
        clipPath: "inset(0 0 0% 0)", duration: 1.3, ease: "power4.inOut",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
      const img = el.querySelector("img");
      if (img) {
        gsap.fromTo(img, { scale: 1.25 }, {
          scale: 1, duration: 1.6, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      }
    });

    // Hero panel photo drifts gently as you scroll away
    gsap.fromTo(".hero__panel .hero__img", { yPercent: -5 }, {
      yPercent: 5, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });

    // Background parallax (tower / reserve sections)
    document.querySelectorAll("[data-parallax-media]").forEach((el) => {
      gsap.fromTo(el, { yPercent: -8 }, {
        yPercent: 8, ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // Element parallax
    document.querySelectorAll("[data-parallax]").forEach((el) => {
      const amt = parseFloat(el.getAttribute("data-parallax")) || 0.1;
      gsap.fromTo(el, { y: 0 }, {
        y: () => -window.innerHeight * amt * 0.5, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // Marquee — velocity-reactive drift
    const track = document.querySelector("[data-marquee]");
    if (track) {
      const half = () => track.scrollWidth / 2;
      const drift = gsap.to(track, { x: () => -half(), duration: 26, ease: "none", repeat: -1 });
      ScrollTrigger.create({
        start: 0, end: "max",
        onUpdate: (self) => {
          gsap.to(drift, { timeScale: 1 + Math.min(Math.abs(self.getVelocity()) / 1500, 3), duration: 0.4, overwrite: true });
        },
      });
    }

    // Animated counters
    document.querySelectorAll("[data-count]").forEach((el) => {
      const target = parseInt(el.getAttribute("data-count"), 10);
      const obj = { n: 0 };
      gsap.to(obj, {
        n: target, duration: 1.8, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
        onUpdate: () => { el.textContent = Math.round(obj.n); },
      });
    });
  } else {
    document.querySelectorAll("[data-count]").forEach((el) => {
      el.textContent = el.getAttribute("data-count");
    });
  }

  /* ═══════════ MAGNETIC BUTTONS ═══════════ */
  if (isFinePointer && !prefersReduced) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - r.left - r.width / 2) * 0.25,
          y: (e.clientY - r.top - r.height / 2) * 0.35,
          duration: 0.5, ease: "power3.out",
        });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  /* ═══════════ DISH CARD TILT ═══════════ */
  if (isFinePointer && !prefersReduced) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
        gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 900, duration: 0.5, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
      });
    });
  }

  /* ═══════════ AMBIENCE SLIDER (drag + buttons) ═══════════ */
  const slider = document.getElementById("ambSlider");
  const ambTrack = document.getElementById("ambTrack");
  if (slider && ambTrack) {
    let offset = 0;
    const maxOffset = () => Math.max(0, ambTrack.scrollWidth - slider.clientWidth + 40);
    const setOffset = (v, dur = 0.9) => {
      offset = Math.max(0, Math.min(v, maxOffset()));
      gsap.to(ambTrack, { x: -offset, duration: dur, ease: "power3.out", overwrite: true });
    };
    const step = () => {
      const slide = ambTrack.querySelector(".ambience__slide");
      return slide ? slide.offsetWidth + 24 : 400;
    };
    document.getElementById("ambNext").addEventListener("click", () => setOffset(offset + step()));
    document.getElementById("ambPrev").addEventListener("click", () => setOffset(offset - step()));

    // Pointer drag — 1:1 tracking while the pointer is down, a rubber-band
    // past the edges, and a touch of momentum on release
    let dragging = false, startX = 0, startOffset = 0;
    let lastX = 0, lastT = 0, velocity = 0;
    slider.addEventListener("pointerdown", (e) => {
      dragging = true;
      startX = lastX = e.clientX; startOffset = offset;
      lastT = performance.now(); velocity = 0;
      slider.classList.add("is-dragging");
      slider.setPointerCapture(e.pointerId);
      gsap.killTweensOf(ambTrack);
    });
    slider.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const now = performance.now();
      if (now > lastT) { velocity = (e.clientX - lastX) / (now - lastT); lastT = now; lastX = e.clientX; }
      let v = startOffset - (e.clientX - startX);
      const max = maxOffset();
      if (v < 0) v *= 0.35;
      else if (v > max) v = max + (v - max) * 0.35;
      offset = v;
      gsap.set(ambTrack, { x: -offset });
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      slider.classList.remove("is-dragging");
      setOffset(offset - velocity * 160, 0.8);
    };
    slider.addEventListener("pointerup", endDrag);
    slider.addEventListener("pointercancel", endDrag);
    slider.addEventListener("lostpointercapture", endDrag);
    ambTrack.addEventListener("dragstart", (e) => e.preventDefault());
    window.addEventListener("resize", () => setOffset(offset, 0));
  }

  /* ═══════════ MENU TABS ═══════════ */
  const tabs = document.querySelectorAll(".menu__tab");
  const panels = document.querySelectorAll(".menu__panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.getAttribute("data-tab");
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      panels.forEach((p) => p.classList.toggle("is-active", p.getAttribute("data-panel") === id));
      const activePanel = document.querySelector(`.menu__panel[data-panel="${id}"]`);
      if (!prefersReduced && activePanel) {
        gsap.fromTo(activePanel.querySelectorAll(".menu__item"),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: "power3.out", overwrite: true });
      }
    });
  });
  // Menu items inside inactive panels shouldn't wait on scroll reveals
  document.querySelectorAll(".menu__panel:not(.is-active) [data-reveal]").forEach((el) => {
    el.removeAttribute("data-reveal");
    el.style.opacity = ""; el.style.transform = "";
  });

  /* ═══════════ TESTIMONIALS ═══════════ */
  const quotes = document.querySelectorAll(".quote");
  const dots = document.querySelectorAll("#quotesDots button");
  let quoteIndex = 0, quoteTimer = null;
  const showQuote = (i) => {
    if (i === quoteIndex) return;
    const prev = quotes[quoteIndex];
    quoteIndex = (i + quotes.length) % quotes.length;
    const next = quotes[quoteIndex];
    dots.forEach((d, di) => d.classList.toggle("is-active", di === quoteIndex));
    if (prefersReduced) {
      prev.classList.remove("is-active");
      next.classList.add("is-active");
      return;
    }
    gsap.to(prev, {
      opacity: 0, y: -20, duration: 0.45, ease: "power2.in",
      onComplete: () => {
        prev.classList.remove("is-active");
        gsap.set(prev, { clearProps: "all" });
        next.classList.add("is-active");
        gsap.fromTo(next, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
      },
    });
  };
  const restartQuoteTimer = () => {
    clearInterval(quoteTimer);
    quoteTimer = setInterval(() => showQuote(quoteIndex + 1), 6000);
  };
  dots.forEach((d, i) => d.addEventListener("click", () => { showQuote(i); restartQuoteTimer(); }));
  restartQuoteTimer();

  /* ═══════════ RESERVATION FORM ═══════════ */
  const form = document.getElementById("reserveForm");
  const confirmMsg = document.getElementById("reserveConfirm");
  if (form) {
    const dateInput = document.getElementById("rDate");
    if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const name = form.name.value.trim().split(" ")[0];
      confirmMsg.textContent = `Thank you, ${name} — our team will confirm your table within the hour.`;
      if (!prefersReduced) {
        gsap.fromTo(confirmMsg, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
      }
      form.reset();
    });
  }

  /* ═══════════ AMBIENT AUDIO ═══════════ */
  const bgAudio = document.getElementById("bgAudio");
  const audioBtn = document.getElementById("audioToggle");
  if (bgAudio && audioBtn) {
    bgAudio.volume = 0.35;
    let wantsAudio = true;
    const setState = (playing) => {
      audioBtn.classList.toggle("is-playing", playing);
      audioBtn.setAttribute("aria-pressed", String(playing));
      audioBtn.setAttribute("aria-label", playing ? "Mute background music" : "Play background music");
    };
    const tryPlay = () => bgAudio.play().then(() => setState(true)).catch(() => setState(false));
    audioBtn.addEventListener("click", () => {
      if (bgAudio.paused) { wantsAudio = true; tryPlay(); }
      else { wantsAudio = false; bgAudio.pause(); setState(false); }
    });
    // Autoplay with sound is blocked until the user interacts — begin
    // softly on the first gesture unless they've muted it themselves.
    const firstGesture = (e) => {
      if (e.target.closest && e.target.closest("#audioToggle")) return;
      if (wantsAudio && bgAudio.paused) tryPlay();
    };
    window.addEventListener("pointerdown", firstGesture, { once: true });
    window.addEventListener("keydown", firstGesture, { once: true });
    tryPlay(); // some browsers allow it outright
  }

  /* ═══════════ MAP ═══════════ */
  // The Google embed takes seconds to hand shake and boot its own scripts, so
  // waiting until it scrolls into view means watching it load. Start it once
  // the page is idle instead — off the critical path, but warm on arrival.
  const mapFrame = document.querySelector(".contact__map iframe[data-src]");
  if (mapFrame) {
    let started = false;
    const loadMap = () => {
      if (started) return;
      started = true;
      mapFrame.src = mapFrame.dataset.src;
    };
    window.addEventListener("load", () => {
      if ("requestIdleCallback" in window) requestIdleCallback(loadMap, { timeout: 2500 });
      else setTimeout(loadMap, 1200);
    });
    // …and straight away for anyone who scrolls down before that.
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { loadMap(); io.disconnect(); }
      }, { rootMargin: "1000px 0px" });
      io.observe(mapFrame);
    } else {
      loadMap();
    }
  }

  /* ═══════════ Refresh triggers once images size in ═══════════ */
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
