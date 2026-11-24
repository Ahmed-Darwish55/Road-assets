import { Suspense, lazy, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { CATEGORIES, DOCS } from "./docs.js";
import { TEAM } from "./team.js";
import { bloom, drawIn, gsap, onReveal, pageTurn, pop, rise, still, themeReveal } from "./motion.js";

const page = document.documentElement;
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
};

const UI = {
  ar: {
    brand: "مركز التوثيق", docs: "الوثائق", team: "الفريق",
    eyebrow: "أنظمة الطرق · مرجع الفريق",
    h1: ["كل ما نبنيه للطريق،", "موثّق في مكان واحد."],
    lead: "التصنيفات، مراجع التكامل، والأدلة. لكل وثيقة رابط ثابت يفتح بالعربية أو الإنجليزية.",
    browse: "تصفّح الوثائق", meet: "تعرّف على الفريق", demo: "عرض توضيحي", travel: "زمن الرحلة",
    exits: "الوثائق", exitsLead: "كل وثيقة مخرج على الطريق. اختر وجهتك.", allDocs: "كل الوثائق",
    teamLead: "من يبني ويوثّق.", allTeam: "صفحة الفريق",
    search: "ابحث في الوثائق…", all: "الكل", cards: "بطاقات", sidebar: "قائمة جانبية", view: "طريقة العرض",
    updated: "آخر تحديث", none: "لا توجد وثيقة مطابقة.", open: "فتح الوثيقة", standalone: "تبويب مستقل",
    pick: "اختر وثيقة من القائمة", missing: "الصفحة غير موجودة", home: "العودة إلى الرئيسية",
    teamH: "الفريق", teamP: "اضغط أي بطاقة لترى بطاقة التعريف والتفاصيل.", cv: "السيرة المهنية", about: "نبذة", exp: "الخبرات", skills: "المهارات", contact: "التواصل", pending: "لم تُضف بيانات هذا العضو بعد.", flip: "اقلب البطاقة", dragHint: "اسحب البطاقة لتدويرها، أو اضغطها لتقلبها", close: "إغلاق", prev: "السابق", next: "التالي", org: "أنظمة الطرق · مركز التوثيق", member: "عضو الفريق", count: (n) => `${n} وثائق`,
    foot: "مرجع داخلي للفريق.",
  },
  en: {
    brand: "Docs Hub", docs: "Docs", team: "Team",
    eyebrow: "Road systems · team reference",
    h1: ["Everything we build for the road,", "documented in one place."],
    lead: "Classifications, integration references and guides. Every document has a stable link that opens in Arabic or English.",
    browse: "Browse the docs", meet: "Meet the team", demo: "Illustration", travel: "Travel time",
    exits: "Documents", exitsLead: "Every document is an exit on the road. Pick your destination.", allDocs: "All documents",
    teamLead: "The people who build and document.", allTeam: "Team page",
    search: "Search the docs…", all: "All", cards: "Cards", sidebar: "Sidebar", view: "View",
    updated: "Updated", none: "No matching document.", open: "Open document", standalone: "Own tab",
    pick: "Pick a document from the list", missing: "Page not found", home: "Back to home",
    teamH: "The team", teamP: "Click any card to see the badge and the details.", cv: "Professional profile", about: "Summary", exp: "Experience", skills: "Skills", contact: "Contact", pending: "Details for this member have not been added yet.", flip: "Flip the card", dragHint: "Drag the card to turn it, or click it to flip", close: "Close", prev: "Previous", next: "Next", org: "Road systems · Docs Hub", member: "Team member", count: (n) => `${n} documents`,
    foot: "Internal team reference.",
  },
};
const other = (l) => (l === "ar" ? "en" : "ar");

function syncChild(lang, mode) {
  DOCS.forEach((d) => {
    if (d.sync?.modeKey) store.set(d.sync.modeKey, mode);
    if (d.sync?.langKey) store.set(d.sync.langKey, lang);
  });
}

/* ---------- shared pieces ---------- */
const Arrow = () => (
  <svg className="arw" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

function Nav({ lang, mode, onLang, onMode }) {
  const t = UI[lang];
  return (
    <nav className="nav">
      <Link to="/" className="brand" aria-label={t.brand}>
        <svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="var(--primary)" /><path d="M11 27 14 5h4l3 22" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" /><path d="M16 8v3M16 14v4M16 21v4" stroke="var(--gold-hi)" strokeWidth="2.2" strokeLinecap="round" /></svg>
        <b>{t.brand}</b>
      </Link>
      <div className="links">
        <NavLink to="/docs">{t.docs}</NavLink>
        <NavLink to="/team">{t.team}</NavLink>
      </div>
      <div className="tools">
        <div className={"pill lang" + (lang === "ar" ? " is-ar" : "")} role="group" aria-label="Language">
          <span className="knob" />
          <button type="button" aria-pressed={lang === "en"} onClick={() => onLang("en")}>EN</button>
          <button type="button" aria-pressed={lang === "ar"} onClick={() => onLang("ar")}>ع</button>
        </div>
        <div className={"pill theme" + (mode === "dark" ? " is-dark" : "")} role="group" aria-label="Appearance">
          <span className="knob" />
          <button type="button" aria-label="Light" aria-pressed={mode === "light"} onClick={(e) => onMode("light", e.currentTarget)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" /></svg>
          </button>
          <button type="button" aria-label="Dark" aria-pressed={mode === "dark"} onClick={(e) => onMode("dark", e.currentTarget)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" /></svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

/* A document drawn as a bilingual highway guide sign. */
function Sign({ doc, lang, compact }) {
  const t = UI[lang];
  return (
    <Link to={"/" + doc.slug} className={"sign" + (compact ? " compact" : "")}>
      <span className="tab">{CATEGORIES[doc.category][lang]}</span>
      <span className="plate">
        <b>{doc.title[lang]}</b>
        <span className="alt" lang={other(lang)}>{doc.title[other(lang)]}</span>
        <i className="rule" />
        <span className="sum">{doc.summary[lang]}</span>
        <span className="row">
          <span className="mono">/{doc.slug}</span>
          <span className="go"><Arrow /></span>
        </span>
      </span>
      <span className="posts" aria-hidden="true"><i /><i /></span>
      <span className="sr">{t.updated} {doc.updated}</span>
    </Link>
  );
}

/* A portrait, or the member's initials on their colour when no photo has been added. */
function Face({ m, className = "" }) {
  return (
    <span className={"face " + className} style={{ "--tone": m.tone }}>
      {m.photo ? <img src={m.photo} alt="" loading="lazy" /> : <i aria-hidden="true">{m.mark}</i>}
    </span>
  );
}

/* ---------- hero: a living stretch of road with two counting stations ---------- */
const MAIN = "M-60 430 C 180 430 300 330 450 280 S 730 150 960 120";
const RAMP = "M960 400 C 800 400 700 360 600 290 S 420 150 330 40 L 300 -40";
function HeroScene({ label, demo }) {
  const main = useRef(null), ramp = useRef(null), cars = useRef(null), clock = useRef(null), svg = useRef(null);
  const [gates, setGates] = useState([]);
  useLayoutEffect(() => {
    const m = main.current, L = m.getTotalLength();
    const at = (path, len, d) => { const p = path.getPointAtLength(len), q = path.getPointAtLength(Math.min(len + 1, path.getTotalLength())); const a = Math.atan2(q.y - p.y, q.x - p.x); return { x: p.x - Math.sin(a) * d, y: p.y + Math.cos(a) * d, a }; };
    const FA = 0.24, FB = 0.52;
    setGates([FA, FB].map((f, i) => { const g = at(m, L * f, 0); return { ...g, name: i ? "B" : "A" }; }));
    const fleet = [
      { path: m, f: 0.02, v: 0.085, lane: 10, probe: true }, { path: m, f: 0.45, v: 0.07, lane: 10 }, { path: m, f: 0.8, v: 0.095, lane: 10 },
      { path: m, f: 0.2, v: -0.075, lane: -10 }, { path: m, f: 0.62, v: -0.09, lane: -10 },
      { path: ramp.current, f: 0.1, v: 0.08, lane: 9 }, { path: ramp.current, f: 0.6, v: 0.065, lane: 9 }, { path: ramp.current, f: 0.4, v: -0.085, lane: -9 },
    ];
    const els = [...cars.current.children];
    const place = () => fleet.forEach((c, i) => { const pl = c.path.getTotalLength(), g = at(c.path, pl * c.f, c.lane); els[i].setAttribute("transform", `translate(${g.x} ${g.y}) rotate(${(g.a * 180) / Math.PI + (c.v < 0 ? 180 : 0)})`); });
    const show = (f) => { const k = Math.max(0, Math.min(1, (f - FA) / (FB - FA))), s = Math.round(k * 312); if (clock.current) clock.current.textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
    place(); show(still ? FB : 0);
    if (still) return;
    drawIn(svg.current.querySelectorAll(".lay"), { duration: 1.6 });
    gsap.fromTo(cars.current, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 1.5 });
    gsap.fromTo(svg.current.querySelectorAll(".dashes"), { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 1.3 });
    let raf, last = performance.now();
    const tick = (now) => { const dt = Math.min(0.05, (now - last) / 1000); last = now;
      fleet.forEach((c) => { c.f = (c.f + c.v * dt + 1) % 1; if (c.probe) show(c.f); });
      place(); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  useEffect(() => { if (!still && gates.length) gsap.fromTo(svg.current.querySelectorAll(".gate"), { opacity: 0, scale: 0.3, transformOrigin: "50% 50%", transformBox: "fill-box" }, { opacity: 1, scale: 1, duration: 0.6, delay: 1.2, stagger: 0.25, ease: "back.out(1.7)" }); }, [gates.length]);
  return (
    <div className="scene" aria-hidden="true">
      <svg ref={svg} viewBox="0 0 900 460" preserveAspectRatio="xMidYMid slice">
        <path className="lay shoulder" d={RAMP} /><path className="lay asphalt" d={RAMP} /><path className="dashes" d={RAMP} />
        <path className="lay shadow" d={MAIN} />
        <path className="lay shoulder" d={MAIN} /><path ref={main} className="lay asphalt" d={MAIN} /><path className="dashes" d={MAIN} />
        <path ref={ramp} d={RAMP} fill="none" />
        {gates.map((g) => (
          <g key={g.name} className="gate">
            <line x1={g.x + Math.sin(g.a) * 38} y1={g.y - Math.cos(g.a) * 38} x2={g.x - Math.sin(g.a) * 38} y2={g.y + Math.cos(g.a) * 38} />
            <circle className="ring" cx={g.x + Math.sin(g.a) * 52} cy={g.y - Math.cos(g.a) * 52} r="15" />
            <circle cx={g.x + Math.sin(g.a) * 52} cy={g.y - Math.cos(g.a) * 52} r="15" />
            <text x={g.x + Math.sin(g.a) * 52} y={g.y - Math.cos(g.a) * 52 + 5} textAnchor="middle">{g.name}</text>
          </g>
        ))}
        <g ref={cars}>{Array.from({ length: 8 }, (_, i) => (<g key={i} className={i === 0 ? "car probe" : "car"}><rect x="-9" y="-4.5" width="18" height="9" rx="3" /><rect className="glass" x="1" y="-3" width="4.5" height="6" rx="1" /></g>))}</g>
      </svg>
      <div className="readout"><span>{label} <i className="mono">A → B</i></span><b className="mono" ref={clock}>0:00</b><small>{demo}</small></div>
    </div>
  );
}

/* ---------- pages ---------- */
function Home({ lang }) {
  const t = UI[lang];
  const root = useRef(null);
  useEffect(() => { document.title = t.brand; }, [t]);
  useEffect(() => {
    const el = root.current;
    rise(el.querySelectorAll(".hero h1 span>span"), 0.15);
    if (!still) gsap.fromTo(el.querySelectorAll(".hero .eyebrow,.hero .lead,.hero .cta"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.55, stagger: 0.1, ease: "power2.out", clearProps: "transform,opacity" });
    return onReveal(el.querySelectorAll(".reveal"), (sec) => bloom(sec.querySelectorAll(".sign,.member"), 0.1));
  }, [lang]);
  return (
    <div ref={root}>
      <header className="hero">
        <HeroScene label={t.travel} demo={t.demo} />
        <div className="copy">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1>{t.h1.map((l, i) => (<span key={i} className={i ? "gold" : ""}><span>{l}</span></span>))}</h1>
          <p className="lead">{t.lead}</p>
          <div className="cta">
            <Link className="btn gold" to="/docs" onClick={(e) => pop(e.currentTarget)}>{t.browse}<Arrow /></Link>
            <Link className="btn ghost" to="/team" onClick={(e) => pop(e.currentTarget)}>{t.meet}</Link>
          </div>
        </div>
      </header>

      <section className="band reveal">
        <div className="head"><div><h2>{t.exits}</h2><p>{t.exitsLead}</p></div><Link className="more" to="/docs">{t.allDocs}<Arrow /></Link></div>
        <div className="signs">{DOCS.map((d) => <Sign key={d.slug} doc={d} lang={lang} />)}</div>
      </section>

      <section className="band reveal">
        <div className="head"><div><h2>{t.team}</h2><p>{t.teamLead}</p></div><Link className="more" to="/team">{t.allTeam}<Arrow /></Link></div>
        <div className="crew">{TEAM.map((m) => (<Link key={m.id} to={"/team/" + m.id} className="member"><Face m={m} /><b>{m.name[lang]}</b>{m.role[lang] && <small>{m.role[lang]}</small>}</Link>))}</div>
      </section>
      <footer className="foot"><span>{t.foot}</span><span className="mono">{DOCS.length} docs · {TEAM.length} people</span></footer>
    </div>
  );
}

function ViewToggle({ view, setView, t }) {
  return (
    <div className="seg" role="group" aria-label={t.view}>
      <button type="button" aria-pressed={view === "cards"} onClick={(e) => { setView("cards"); pop(e.currentTarget); }}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /></svg>{t.cards}
      </button>
      <button type="button" aria-pressed={view === "sidebar"} onClick={(e) => { setView("sidebar"); pop(e.currentTarget); }}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM10 4v16" /></svg>{t.sidebar}
      </button>
    </div>
  );
}

function Sidebar({ lang, active, q, setQ }) {
  const t = UI[lang];
  const list = DOCS.filter((d) => (d.title.ar + d.title.en + d.slug).toLowerCase().includes(q.trim().toLowerCase()));
  const cats = [...new Set(list.map((d) => d.category))];
  return (
    <aside className="side">
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} aria-label={t.search} />
      {cats.map((c) => (
        <div key={c} className="grp" style={{ "--k": CATEGORIES[c].color }}>
          <h3>{CATEGORIES[c][lang]}</h3>
          {list.filter((d) => d.category === c).map((d) => (
            <Link key={d.slug} to={"/" + d.slug} className={d.slug === active ? "on" : ""}>
              <b>{d.title[lang]}</b><small className="mono">/{d.slug}</small>
            </Link>
          ))}
        </div>
      ))}
      {!list.length && <p className="none">{t.none}</p>}
    </aside>
  );
}

function Docs({ lang, view, setView }) {
  const t = UI[lang];
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const grid = useRef(null);
  const cats = useMemo(() => [...new Set(DOCS.map((d) => d.category))], []);
  const list = DOCS.filter((d) => (cat === "all" || d.category === cat) && (d.title.ar + d.title.en + d.summary.ar + d.summary.en + d.slug).toLowerCase().includes(q.trim().toLowerCase()));
  useEffect(() => { document.title = t.docs + " · " + t.brand; }, [t]);
  useEffect(() => { if (grid.current) bloom(grid.current.children, 0.09); }, [lang, cat, view]);
  return (
    <div className="docs">
      <div className="head top"><div><h1>{t.exits}</h1><p>{t.exitsLead}</p></div><ViewToggle view={view} setView={setView} t={t} /></div>
      {view === "cards" ? (
        <>
          <div className="filters">
            <div className="chips">
              <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")}>{t.all} <span className="mono">{DOCS.length}</span></button>
              {cats.map((c) => (<button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{CATEGORIES[c][lang]} <span className="mono">{DOCS.filter((d) => d.category === c).length}</span></button>))}
            </div>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} aria-label={t.search} />
          </div>
          <div className="signs" ref={grid}>{list.map((d) => <Sign key={d.slug} doc={d} lang={lang} />)}</div>
          {!list.length && <p className="none">{t.none}</p>}
        </>
      ) : (
        <div className="split">
          <Sidebar lang={lang} q={q} setQ={setQ} />
          <div className="pane index" ref={grid}>
            {DOCS.map((d) => (
              <Link key={d.slug} to={"/" + d.slug} className="line" style={{ "--k": CATEGORIES[d.category].color }}>
                <i className="tag">{CATEGORIES[d.category][lang]}</i>
                <span><b>{d.title[lang]}</b><small>{d.summary[lang]}</small></span>
                <span className="mono when">{d.updated}</span><Arrow />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Viewer({ lang, view, setView }) {
  const t = UI[lang];
  const { slug } = useParams();
  const [q, setQ] = useState("");
  const doc = DOCS.find((d) => d.slug === slug);
  const Page = useMemo(() => (doc?.load ? lazy(doc.load) : null), [doc]);
  useEffect(() => { if (doc) document.title = doc.title[lang] + " · " + t.brand; }, [doc, lang, t]);
  if (!doc) return (<div className="docs missing"><h1>{t.missing}</h1><p className="mono">/{slug}</p><Link className="btn solid" to="/">{t.home}</Link></div>);
  const src = doc.src ? doc.src + (doc.sync?.langHash ? "#" + lang : "") : null;
  const body = src ? <iframe key={src} src={src} title={doc.title[lang]} allow="fullscreen; clipboard-write" /> : <Suspense fallback={null}><Page lang={lang} /></Suspense>;
  return (
    <div className={"viewer " + view}>
      <div className="vbar">
        <Link to="/docs" className="back"><Arrow />{t.docs}</Link>
        <b>{doc.title[lang]}</b><span className="mono path">/{doc.slug}</span>
        <ViewToggle view={view} setView={setView} t={t} />
        {src && <a className="ext" href={src} target="_blank" rel="noopener">{t.standalone}</a>}
      </div>
      <div className="vbody">{view === "sidebar" && <Sidebar lang={lang} active={slug} q={q} setQ={setQ} />}<div className="frame">{body}</div></div>
    </div>
  );
}

const code = (i) => String(9750 + i * 7 + 3);
const bars = (id) => [...id].map((c, i) => 1 + ((c.charCodeAt(0) + i * 7) % 4));

/* The lower part of the emblem: two road bands crossing, as on the Authority's employee card. */
const Roads = () => (
  <svg className="roads" viewBox="0 0 300 200" aria-hidden="true">
    <path className="band" d="M-24 2 L186 176" /><path className="dash" d="M-24 2 L186 176" />
    <path className="gap" d="M324 2 L114 176" /><path className="band" d="M324 2 L114 176" /><path className="dash" d="M324 2 L114 176" />
  </svg>
);

/* Portrait over the crossing roads. Without a photo, the member's initials stand in. */
function Portrait({ m }) {
  return (
    <span className="portrait" style={{ "--tone": m.tone }}>
      <span className="arch">{m.photo ? <img src={m.photo} alt="" loading="lazy" /> : <i aria-hidden="true">{m.mark}</i>}</span>
      <Roads />
    </span>
  );
}

/* Card front, laid out like the Authority's employee ID: photo on the emblem, Arabic and English name, position, number. */
function CardFront({ m, i }) {
  return (
    <>
      <span className="org"><b>أنظمة الطرق</b><span>Road Systems</span></span>
      <Portrait m={m} />
      <b className="nar" lang="ar" dir="rtl">{m.name.ar}</b>
      <span className="nen" lang="en" dir="ltr">{m.name.en}</span>
      <b className="rar" lang="ar" dir="rtl">{m.role.ar || "عضو الفريق"}</b>
      <span className="ren" lang="en" dir="ltr">{m.role.en || "Team member"}</span>
      <span className="idn mono">{code(i)}</span>
    </>
  );
}

/* A real two-sided card: drag to turn it, click to flip it. */
function Card3D({ m, i, t }) {
  const card = useRef(null), ang = useRef(0), drag = useRef(null);
  const to = (a, spring) => { ang.current = a; if (still || !spring) gsap.set(card.current, { rotationY: a }); else gsap.to(card.current, { rotationY: a, rotationX: 0, duration: 1, ease: "back.out(1.5)", overwrite: true }); };
  const flip = () => to(Math.round(ang.current / 180) * 180 + 180, true);
  useEffect(() => { gsap.set(card.current, { rotationX: 0 }); to(0, false); }, [m.id]);
  const down = (e) => { gsap.killTweensOf(card.current); gsap.set(card.current, { rotationX: 0 }); drag.current = { x: e.clientX, a: ang.current, moved: 0, now: ang.current }; e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e) => {
    const d = drag.current, r = e.currentTarget.getBoundingClientRect();
    if (d) { const dx = e.clientX - d.x; d.moved = Math.max(d.moved, Math.abs(dx)); d.now = d.a + dx * 0.8; gsap.set(card.current, { rotationY: d.now }); return; }
    if (!still && e.pointerType === "mouse") gsap.to(card.current, { rotationX: (0.5 - (e.clientY - r.top) / r.height) * 12, rotationY: ang.current + ((e.clientX - r.left) / r.width - 0.5) * 16, duration: 0.3, overwrite: true });
  };
  const up = () => { const d = drag.current; drag.current = null; if (!d) return; if (d.moved < 6) flip(); else to(Math.round(d.now / 180) * 180, true); };
  const leave = () => { if (!drag.current && !still) gsap.to(card.current, { rotationX: 0, rotationY: ang.current, duration: 0.5, overwrite: true }); };
  const key = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } };
  return (
    <>
      <div className="card3d" ref={card} style={{ "--tone": m.tone }} role="button" tabIndex={0} aria-label={t.flip} onKeyDown={key}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={leave}>
        <div className="cside front"><i className="slot" /><CardFront m={m} i={i} /></div>
        <div className="cside back">
          <i className="slot" />
          <svg className="pat" viewBox="0 0 240 360" preserveAspectRatio="none" aria-hidden="true">
            <path d="M-10 250 L120 150 L250 250 V290 L120 190 L-10 290Z M-10 320 L120 220 L250 320 V360 L120 260 L-10 360Z" />
            <path className="g" d="M150 -10 L250 70 V100 L120 -10Z M200 -10 L250 30 V55 L170 -10Z" />
          </svg>
          <span className="org"><b>مركز التوثيق</b><span>Docs Hub</span></span>
          <span className="bk"><b lang="ar" dir="rtl">{m.name.ar}</b><span lang="en" dir="ltr">{m.name.en}</span></span>
          <span className="bk2"><span className="mono">/team/{m.id}</span><span className="barcode" aria-hidden="true">{bars(m.id).map((w, k) => <i key={k} style={{ width: w + "px" }} />)}</span><span className="mono big">{code(i)}</span></span>
        </div>
      </div>
      <button type="button" className="flipbtn" onClick={(e) => { flip(); pop(e.currentTarget); }}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9a8 8 0 0 1 14-3M20 15a8 8 0 0 1-14 3M18 2v4h-4M6 22v-4h4" /></svg>{t.flip}
      </button>
    </>
  );
}

/* The member wearing the card on a lanyard, with a CV sheet beside it. */
function Badge({ m, i, lang }) {
  const t = UI[lang];
  const nav = useNavigate();
  const root = useRef(null), hang = useRef(null);
  const go = (d) => nav("/team/" + TEAM[(i + d + TEAM.length) % TEAM.length].id, { replace: true });
  const close = () => nav("/team");
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") close(); else if (e.key === "ArrowRight") go(lang === "ar" ? -1 : 1); else if (e.key === "ArrowLeft") go(lang === "ar" ? 1 : -1); };
    addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [m.id, lang]);
  useEffect(() => {
    if (still) return;
    const el = root.current, h = hang.current;
    const tl = gsap.timeline();
    tl.fromTo(el.querySelector(".figure"), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0)
      .fromTo(h, { rotation: -22, y: -80, opacity: 0 }, { rotation: 0, y: 0, opacity: 1, duration: 1.7, ease: "elastic.out(1,0.34)" }, 0.25)
      .fromTo(el.querySelector(".cv"), { opacity: 0, x: lang === "ar" ? -40 : 40 }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", clearProps: "transform" }, 0.3)
      .fromTo(el.querySelectorAll(".cv section,.cv .pager"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out", clearProps: "transform,opacity" }, 0.6);
    const sway = gsap.to(h, { rotation: 1.4, duration: 2.8, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2.2 });
    return () => { tl.kill(); sway.kill(); };
  }, [m.id]);
  useLayoutEffect(() => {
    const fit = () => { const st = root.current.querySelector(".stage"); st.style.zoom = innerWidth <= 900 ? "" : Math.max(0.55, Math.min(1, (innerHeight - 84) / 900)).toFixed(3); };
    fit(); addEventListener("resize", fit); return () => removeEventListener("resize", fit);
  }, []);
  const exp = m.experience, skills = m.skills[lang], has = m.summary[lang] || exp.length || skills.length || m.contact.length;
  return (
    <div className="badge" ref={root} role="dialog" aria-modal="true" aria-label={m.name[lang]} onClick={(e) => { if (e.target === e.currentTarget) close(); }} style={{ "--tone": m.tone }}>
      <button type="button" className="x" onClick={close} aria-label={t.close}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
      <div className="stage">
        <svg className="figure" viewBox="0 0 360 640" aria-hidden="true">
          <defs>
            <linearGradient id="fg-skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="var(--f1)" /><stop offset="1" stopColor="var(--f2)" /></linearGradient>
            <linearGradient id="fg-suit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--s1)" /><stop offset="1" stopColor="var(--s2)" /></linearGradient>
            <linearGradient id="fg-strap" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3b6659" /><stop offset=".5" stopColor="#4D7F71" /><stop offset="1" stopColor="#3b6659" /></linearGradient>
            <linearGradient id="fg-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0d873" /><stop offset=".5" stopColor="#B99C16" /><stop offset="1" stopColor="#8a7410" /></linearGradient>
          </defs>
          <ellipse className="floor" cx="180" cy="628" rx="150" ry="10" />
          <path className="strapback" d="M132 196 C150 176 210 176 228 196 L224 214 C206 198 154 198 136 214Z" />
          <path fill="url(#fg-suit)" d="M18 640V372c0-58 40-84 92-98l44-14 26 34 26-34 44 14c52 14 92 40 92 98v268z" />
          <path className="lapel" d="M154 260 L180 388 L128 300 L140 264Z M206 260 L180 388 L232 300 L220 264Z" />
          <path className="shirt" d="M154 260 L180 388 L206 260 L196 240 H164Z" />
          <path fill="url(#fg-skin)" d="M152 176h56v72c0 12-12 26-28 26s-28-14-28-26z" />
          <path className="chin" d="M152 206c14 16 42 16 56 0v20c-14 14-42 14-56 0z" />
          <path fill="url(#fg-skin)" d="M180 46c38 0 60 28 60 68 0 46-26 88-60 88s-60-42-60-88c0-40 22-68 60-68z" />
          <path className="shine" d="M152 68c-14 12-20 30-18 52" />
          <path className="seam" d="M64 640V430 M296 640V430" />
          <g className="lanyard">
            <path className="ribbon" d="M140 232 L180 372" /><path className="print" d="M140 232 L180 372" />
            <path className="ribbon" d="M220 232 L180 372" /><path className="print" d="M220 232 L180 372" />
            <rect className="buckle" x="-17" y="-10" width="34" height="20" rx="4" transform="translate(205 286) rotate(16)" fill="url(#fg-gold)" />
            <rect x="166" y="358" width="28" height="22" rx="3" fill="url(#fg-strap)" />
            <circle cx="180" cy="390" r="9" fill="none" stroke="url(#fg-gold)" strokeWidth="4.5" />
          </g>
        </svg>
        <div className="hang" ref={hang}>
          <svg className="hook" viewBox="0 0 30 40" aria-hidden="true"><path d="M15 2v9M8 11h14v6a7 7 0 0 1-7 7 7 7 0 0 1-7-7z M15 24v6a5 5 0 0 1-5 5" fill="none" stroke="#B99C16" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <Card3D m={m} i={i} t={t} />
        </div>
        <p className="hint">{t.dragHint}</p>
      </div>

      <article className="cv">
        <header>
          <svg className="pat" viewBox="0 0 400 120" preserveAspectRatio="xMaxYMid slice" aria-hidden="true"><path d="M250 -20 L330 60 L250 140 H290 L370 60 L290 -20Z M320 -20 L400 60 L320 140 H360 L440 60 L360 -20Z" /></svg>
          <span className="eyebrow">{t.cv} · <span className="mono">{code(i)}</span></span>
          <h2>{m.name[lang]}</h2>
          <span className="alt" lang={other(lang)}>{m.name[other(lang)]}</span>
          <p className="role">{m.role[lang] || t.member}</p>
        </header>
        <div className="cvbody">
          {m.summary[lang] && <section><h3>{t.about}</h3><div><p>{m.summary[lang]}</p></div></section>}
          {exp.length > 0 && <section><h3>{t.exp}</h3><div className="exp">{exp.map((x, k) => (<div key={k}><b>{x.title[lang]}</b><span>{x.place[lang]}</span><small className="mono">{x.period}</small></div>))}</div></section>}
          {skills.length > 0 && <section><h3>{t.skills}</h3><div className="tags">{skills.map((f) => <span key={f}>{f}</span>)}</div></section>}
          {m.contact.length > 0 && <section><h3>{t.contact}</h3><div className="contact">{m.contact.map((c, k) => (<div key={k}><span>{c.label[lang]}</span>{c.href ? <a className="mono" href={c.href}>{c.value}</a> : <b className="mono">{c.value}</b>}</div>))}</div></section>}
          {!has && <section><h3>{t.about}</h3><div><p className="pending">{t.pending}</p></div></section>}
          <div className="pager"><button type="button" onClick={() => go(-1)}><Arrow />{t.prev}</button><span className="mono">{i + 1} / {TEAM.length}</span><button type="button" onClick={() => go(1)}>{t.next}<Arrow /></button></div>
        </div>
      </article>
    </div>
  );
}

function Team({ lang }) {
  const t = UI[lang];
  const { id } = useParams();
  const root = useRef(null);
  const idx = TEAM.findIndex((m) => m.id === id);
  useEffect(() => { document.title = (idx >= 0 ? TEAM[idx].name[lang] + " · " : "") + t.team + " · " + t.brand; }, [t, idx, lang]);
  useEffect(() => { const el = root.current; rise(el.querySelectorAll("h1 span>span"), 0.1); bloom(el.querySelectorAll(".pcard"), 0.11); }, [lang]);
  const lean = (e) => { if (still) return; const el = e.currentTarget, r = el.getBoundingClientRect(); el.style.setProperty("--ry", (((e.clientX - r.left) / r.width - 0.5) * 16).toFixed(1) + "deg"); el.style.setProperty("--rx", ((0.5 - (e.clientY - r.top) / r.height) * 12).toFixed(1) + "deg"); };
  const level = (e) => { e.currentTarget.style.setProperty("--ry", "0deg"); e.currentTarget.style.setProperty("--rx", "0deg"); };
  return (
    <div className="teampage" ref={root}>
      <div className="head top"><div><h1><span><span>{t.teamH}</span></span></h1><p>{t.teamP}</p></div></div>
      <div className="people">
        {TEAM.map((m, i) => (
          <Link key={m.id} to={"/team/" + m.id} className="pcard" style={{ "--tone": m.tone }} onPointerMove={lean} onPointerLeave={level} aria-label={m.name[lang]}>
            <i className="slot" /><CardFront m={m} i={i} />
          </Link>
        ))}
      </div>
      {idx >= 0 && <Badge m={TEAM[idx]} i={idx} lang={lang} />}
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState(page.lang === "en" ? "en" : "ar");
  const [mode, setMode] = useState(page.getAttribute("data-mode") || "light");
  const [view, setViewState] = useState(store.get("docs-view") === "sidebar" ? "sidebar" : "cards");
  const loc = useLocation();
  useEffect(() => { syncChild(lang, mode); }, [lang, mode]);
  useEffect(() => { if (!loc.pathname.startsWith("/team/")) scrollTo(0, 0); }, [loc.pathname]);
  const setView = (v) => { store.set("docs-view", v); setViewState(v); };
  const onLang = (next) => {
    if (next === lang) return;
    pageTurn(document.getElementById("wrap"), next === "ar", () => {
      page.lang = next; page.dir = next === "ar" ? "rtl" : "ltr"; store.set("docs-lang", next);
      flushSync(() => setLang(next));
    });
  };
  const onMode = (next, button) => {
    if (next === mode) return;
    themeReveal(button, next, () => { page.setAttribute("data-mode", next); store.set("docs-mode", next); flushSync(() => setMode(next)); });
  };
  return (
    <>
      <Nav lang={lang} mode={mode} onLang={onLang} onMode={onMode} />
      <main id="wrap" className="wrap">
        <Routes>
          <Route path="/" element={<Home lang={lang} />} />
          <Route path="/docs" element={<Docs lang={lang} view={view} setView={setView} />} />
          <Route path="/team" element={<Team lang={lang} />} />
          <Route path="/team/:id" element={<Team lang={lang} />} />
          <Route path="/assets" element={<Navigate to="/road-assets-tree" replace />} />
          <Route path="/tomtom" element={<Navigate to="/tomtom-travel-time" replace />} />
          <Route path="/:slug" element={<Viewer lang={lang} view={view} setView={setView} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
