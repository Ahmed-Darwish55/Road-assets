import gsap from "gsap";

export const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
const page = document.documentElement;

// Cards open from their leading edge, one after another.
export function bloom(els, step = 0.07) {
  if (still || !els.length) return;
  const origin = page.dir === "rtl" ? "100% 50%" : "0% 50%";
  [...els].forEach((el, i) =>
    gsap.fromTo(
      el,
      { autoAlpha: 0, scale: 0.3, transformOrigin: origin },
      { autoAlpha: 1, scale: 1, duration: 0.6, delay: Math.min(0.7, i * step), ease: "back.out(1.7)", overwrite: true, clearProps: "transform,opacity,visibility" }
    )
  );
}

// A pressed control springs back.
export function pop(el) {
  if (still || !el) return;
  gsap.fromTo(el, { scale: 0.86 }, { scale: 1, duration: 0.75, ease: "elastic.out(1.1,0.42)", overwrite: true, clearProps: "transform" });
}

// The new theme opens as a circle from the button that was pressed.
export function themeReveal(button, next, apply) {
  if (!document.startViewTransition || still) return apply();
  const r = button.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const closed = `circle(0px at ${x}px ${y}px)`, open = `circle(${rad}px at ${x}px ${y}px)`, dark = next === "dark";
  if (dark) page.removeAttribute("data-shrinking"); else page.setAttribute("data-shrinking", "");
  const t = document.startViewTransition(apply);
  t.ready.then(() => {
    page.animate(
      { clipPath: dark ? [closed, open] : [open, closed] },
      { duration: 700, easing: dark ? "cubic-bezier(0.55,0,0.8,0.6)" : "cubic-bezier(0.2,0.4,0.45,1)", fill: "forwards", pseudoElement: dark ? "::view-transition-new(root)" : "::view-transition-old(root)" }
    );
  }).catch(() => {});
  t.finished.finally(() => page.removeAttribute("data-shrinking"));
}

// Switching language turns the whole page over like a leaf of a book.
let turning = false;
export function pageTurn(el, toArabic, swap) {
  if (turning) return;
  if (still || !el || !el.animate) return swap();
  turning = true;
  page.classList.add("turn");
  const s = toArabic ? 1 : -1, oy = Math.round(scrollY + innerHeight / 2 - el.offsetTop) + "px", P = "perspective(2200px) ";
  const done = () => { el.style.transformOrigin = ""; page.classList.remove("turn"); turning = false; };
  el.style.transformOrigin = (s > 0 ? "0% " : "100% ") + oy;
  const out = el.animate(
    [{ transform: P + "rotateY(0deg)", opacity: 1 }, { transform: P + `rotateY(${-88 * s}deg)`, opacity: 0.25 }],
    { duration: 430, easing: "cubic-bezier(.5,0,.9,.5)", fill: "forwards" }
  );
  out.onfinish = () => {
    swap();
    out.cancel();
    el.style.transformOrigin = (s > 0 ? "100% " : "0% ") + oy;
    const inn = el.animate(
      [{ transform: P + `rotateY(${88 * s}deg)`, opacity: 0.25 }, { transform: P + "rotateY(0deg)", opacity: 1 }],
      { duration: 560, easing: "cubic-bezier(.15,.7,.3,1)" }
    );
    inn.onfinish = inn.oncancel = done;
  };
}

// A line draws itself from its start, like a road being laid.
export function drawIn(paths, opts = {}) {
  if (still) return;
  [...paths].forEach((p, i) => {
    const len = p.getTotalLength();
    gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, {
      strokeDashoffset: 0, duration: opts.duration || 1.4, delay: (opts.delay || 0) + i * 0.12, ease: "power2.inOut",
      onComplete: () => { p.style.strokeDasharray = ""; p.style.strokeDashoffset = ""; },
    });
  });
}

// Lines of a headline rise into place one after another.
export function rise(els, delay = 0) {
  if (still || !els.length) return;
  gsap.fromTo(els, { yPercent: 110 }, { yPercent: 0, duration: 0.9, delay, stagger: 0.09, ease: "power4.out", clearProps: "transform" });
}

// Things below the fold open as they scroll into view.
export function onReveal(els, play) {
  if (still || !("IntersectionObserver" in window)) return () => {};
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); play(e.target); } }), { threshold: 0.18 });
  [...els].forEach((el) => io.observe(el));
  return () => io.disconnect();
}
export { gsap };
