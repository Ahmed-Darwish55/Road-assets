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
    teamH: "الفريق", teamP: "اضغط أي بطاقة لترى صاحبها مرتديًا إياها، ومعها سيرته المهنية.", teamRoad: "الفريق كله على الطريق. اضغط أي عضو لفتح بطاقته.", showAll: "عرض كل الفريق", showCards: "العودة إلى البطاقات", orgRoot: "فريق أنظمة الطرق", edu: "التعليم", langs: "اللغات", demoTag: "بيانات تجريبية", cv: "السيرة المهنية", about: "نبذة", exp: "الخبرات", skills: "المهارات", contact: "التواصل", pending: "لم تُضف بيانات هذا العضو بعد.", flip: "اقلب البطاقة", dragHint: "أمسك البطاقة وحرّكها لتتأرجح · اضغطها لتقلبها", close: "إغلاق", prev: "السابق", next: "التالي", org: "أنظمة الطرق · مركز التوثيق", member: "عضو الفريق", count: (n) => `${n} وثائق`,
    foot: "مرجع داخلي للفريق.", aLang: "اللغة", aLook: "المظهر", aLight: "الوضع الفاتح", aDark: "الوضع الداكن", counts: (d, p) => `${d} وثائق · ${p} أعضاء`,
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
    teamH: "The team", teamP: "Click a card to see its owner wearing it, with their professional profile.", teamRoad: "The whole team along the road. Click a member to open their card.", showAll: "Show the whole team", showCards: "Back to the cards", orgRoot: "Road Systems team", edu: "Education", langs: "Languages", demoTag: "Demo data", cv: "Professional profile", about: "Summary", exp: "Experience", skills: "Skills", contact: "Contact", pending: "Details for this member have not been added yet.", flip: "Flip the card", dragHint: "Grab the card and move it to swing it · click it to flip", close: "Close", prev: "Previous", next: "Next", org: "Road systems · Docs Hub", member: "Team member", count: (n) => `${n} documents`,
    foot: "Internal team reference.", aLang: "Language", aLook: "Appearance", aLight: "Light mode", aDark: "Dark mode", counts: (d, p) => `${d} documents · ${p} people`,
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
        <div className={"pill lang" + (lang === "ar" ? " is-ar" : "")} role="group" aria-label={t.aLang}>
          <span className="knob" />
          <button type="button" aria-pressed={lang === "en"} onClick={() => onLang("en")}>EN</button>
          <button type="button" aria-pressed={lang === "ar"} onClick={() => onLang("ar")}>ع</button>
        </div>
        <div className={"pill theme" + (mode === "dark" ? " is-dark" : "")} role="group" aria-label={t.aLook}>
          <span className="knob" />
          <button type="button" aria-label={t.aLight} data-m="light" aria-pressed={mode === "light"} onClick={(e) => onMode("light", e.currentTarget)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" /></svg>
          </button>
          <button type="button" aria-label={t.aDark} data-m="dark" aria-pressed={mode === "dark"} onClick={(e) => onMode("dark", e.currentTarget)}>
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
        <div className="crew">{TEAM.map((m) => (<Link key={m.id} to={"/team/" + m.id} className="member"><span className="mface" style={{ "--tone": m.tone }}><Photo m={m} /></span><b>{m.name[lang]}</b>{m.role[lang] && <small>{m.role[lang]}</small>}</Link>))}</div>
      </section>
      <footer className="foot"><span>{t.foot}</span><span>{t.counts(DOCS.length, TEAM.length)}</span></footer>
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
const ORG = { ar: "أنظمة الطرق", en: "Road Systems" }, HUB = { ar: "مركز التوثيق", en: "Docs Hub" };
const val = (v, lang) => (typeof v === "string" ? v : v[lang]);
const period = (x, lang) => (lang === "en" && x.periodEn ? x.periodEn : x.period);

/* An illustrated person in a suit. `crop` shows head and shoulders only, as a default portrait. */
function Person({ female, crop, collar = true, className = "" }) {
  const box = crop ? (female ? "96 22 208 260" : "88 14 224 280") : "0 0 400 620";
  return (
    <svg className={"person " + className} viewBox={box} preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <defs>
        <linearGradient id="pg-suit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a4a45" /><stop offset="1" stopColor="#222c29" /></linearGradient>
        <linearGradient id="pg-skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ecc4a3" /><stop offset="1" stopColor="#d6a580" /></linearGradient>
      </defs>
      {female ? (
        <>
          <path fill="#33241d" d="M116 152c0-76 36-120 84-120s84 44 84 120v126c0 20-12 32-26 32H142c-14 0-26-12-26-32z" />
          <path fill="url(#pg-suit)" d="M54 620V388c0-48 34-76 80-90l40-14 26 100 26-100 40 14c46 14 80 42 80 90v232z" />
          <path fill="#f6efe2" d="M172 272l28 112 28-112-8-26h-40z" />
          <path fill="url(#pg-skin)" d="M180 196h40v48c0 13-9 23-20 23s-20-10-20-23z" />
          <path fill="#000" opacity=".12" d="M180 214c12 13 28 13 40 0v-18h-40z" />
          <path fill="#1b2421" d="M168 272l32 112-50-56c-4-22 4-42 18-56zM232 272l-32 112 50-56c4-22-4-42-18-56z" />
          <path fill="url(#pg-skin)" d="M200 52c36 0 56 26 56 66v14c0 44-25 78-56 78s-56-34-56-78v-14c0-40 20-66 56-66z" />
          <path fill="#33241d" d="M142 140c-8-60 20-98 58-98s66 36 58 98c-8-32-30-54-62-60-10 24-30 46-54 60z" />
          {collar && <path fill="#fbf6ec" stroke="#d9d2c3" strokeWidth="1.2" strokeLinejoin="round" d="M181 238c4 14 10 24 19 32l-27 16c-6-12-8-26-6-40zM219 238c-4 14-10 24-19 32l27 16c6-12 8-26 6-40z" />}
          <circle cx="146" cy="340" r="6" fill="#e3c64a" />
          <path fill="none" stroke="#000" strokeWidth="2" opacity=".14" d="M92 620V440M308 620V440" />
        </>
      ) : (
        <>
          <path fill="url(#pg-suit)" d="M34 620V372c0-52 38-82 90-96l46-14 30 96 30-96 46 14c52 14 90 44 90 96v248z" />
          <path fill="#f7f8f7" d="M168 262l32 96 32-96-10-24h-44z" />
          <path fill="url(#pg-skin)" d="M176 194h48v46c0 14-11 24-24 24s-24-10-24-24z" />
          <path fill="#000" opacity=".13" d="M176 214c14 14 34 14 48 0v-20h-48z" />
          <path fill="#4D7F71" d="M190 266h20l-5 18h-10z" /><path fill="#44705f" d="M190 286h20l8 78-18 22-18-22z" /><path fill="#e3c64a" d="M187 322l26-9 1 10-27 9z" />
          <path fill="#1b2421" d="M164 262l36 96-54-46 10-20-18-10zM236 262l-36 96 54-46-10-20 18-10z" />
          {collar && <path fill="#fff" stroke="#d5d9d8" strokeWidth="1.2" strokeLinejoin="round" d="M178 238l22 30-28 18-8-36zM222 238l-22 30 28 18 8-36z" />}
          <path fill="#e3c64a" d="M258 410l10-12 8 9 9-10 9 13z" /><path fill="none" stroke="#000" strokeWidth="2" opacity=".2" d="M256 410h40" />
          <ellipse cx="137" cy="140" rx="9" ry="15" fill="#d6a580" /><ellipse cx="263" cy="140" rx="9" ry="15" fill="#d6a580" />
          <path fill="url(#pg-skin)" d="M200 44c40 0 62 28 62 70v16c0 46-28 80-62 80s-62-34-62-80v-16c0-42 22-70 62-70z" />
          <path fill="#26201e" d="M138 130c-8-60 22-96 62-96s70 36 62 96c-4-26-12-40-24-48-24 10-58 8-78-2-12 10-18 24-22 50z" />
          <path fill="none" stroke="#000" strokeWidth="2" opacity=".16" d="M74 620V430M326 620V430" />
        </>
      )}
    </svg>
  );
}

/* The member's photo, or the default illustrated portrait. */
const Photo = ({ m }) => (m.photo ? <img src={m.photo} alt="" loading="lazy" /> : <Person female={m.gender === "f"} crop />);

/* The lower part of the emblem: two road bands crossing, as on the Authority's employee card. */
const Roads = () => (
  <svg className="roads" viewBox="0 0 300 200" aria-hidden="true">
    <path className="band" d="M-24 2 L186 176" /><path className="dash" d="M-24 2 L186 176" />
    <path className="gap" d="M324 2 L114 176" /><path className="band" d="M324 2 L114 176" /><path className="dash" d="M324 2 L114 176" />
  </svg>
);

/* Card front, laid out like the Authority's employee ID: photo on the emblem, Arabic and English name, position, number. */
function CardFront({ m, i, lang }) {
  const o = other(lang);
  return (
    <>
      <span className="org" dir={lang === "ar" ? "rtl" : "ltr"}><b>{ORG[lang]}</b><span>{ORG[o]}</span></span>
      <span className="portrait" style={{ "--tone": m.tone }}><span className="arch"><Photo m={m} /></span><Roads /></span>
      <b className="nar" lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>{m.name[lang]}</b>
      <span className="nen" lang={o} dir={o === "ar" ? "rtl" : "ltr"}>{m.name[o]}</span>
      <b className="rar" lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>{m.role[lang]}</b>
      <span className="ren" lang={o} dir={o === "ar" ? "rtl" : "ltr"}>{m.role[o]}</span>
      <span className="idn mono">{code(i)}</span>
    </>
  );
}

function CardBack({ m, i, lang }) {
  const o = other(lang);
  return (
    <>
      <svg className="pat" viewBox="0 0 240 360" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-10 250 L120 150 L250 250 V290 L120 190 L-10 290Z M-10 320 L120 220 L250 320 V360 L120 260 L-10 360Z" />
        <path className="g" d="M150 -10 L250 70 V100 L120 -10Z M200 -10 L250 30 V55 L170 -10Z" />
      </svg>
      <span className="org" dir={lang === "ar" ? "rtl" : "ltr"}><b>{HUB[lang]}</b><span>{HUB[o]}</span></span>
      <span className="bk"><b lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>{m.name[lang]}</b><span lang={o} dir={o === "ar" ? "rtl" : "ltr"}>{m.name[o]}</span></span>
      <span className="bk2"><span className="mono">/team/{m.id}</span><span className="barcode" aria-hidden="true">{bars(m.id).map((w, k) => <i key={k} style={{ width: w + "px" }} />)}</span><span className="mono big">{code(i)}</span></span>
    </>
  );
}

/* The member wearing the card. The card hangs on a real pendulum: grab it and it follows the hand, let go and it swings. */
const REST = { x: 200, y: 404 }, ROPE = 152, ARM = 205;
function Wearer({ m, i, t, lang }) {
  const stage = useRef(null), hang = useRef(null), card = useRef(null), sL = useRef(null), sR = useRef(null), pL = useRef(null), pR = useRef(null);
  const sim = useRef(null);
  const female = m.gender === "f";
  const NL = female ? { x: 175, y: 262 } : { x: 172, y: 258 }, NR = female ? { x: 225, y: 262 } : { x: 228, y: 258 };
  const flip = () => { const s = sim.current; const next = Math.round(s.flip.a / 180) * 180 + 180; if (still) { s.flip.a = next; s.draw(); } else gsap.to(s.flip, { a: next, duration: 0.95, ease: "back.out(1.5)", overwrite: true }); };
  useEffect(() => {
    const A = { x: 200, y: REST.y - ROPE };
    const s = { h: { x: 96, y: 300, px: 90, py: 296 }, c: { x: -20, y: 420, px: -24, py: 418 }, drag: null, yaw: 0, pitch: 0, flip: { a: 0 } };
    if (still) { s.h = { x: REST.x, y: REST.y, px: REST.x, py: REST.y }; s.c = { x: REST.x, y: REST.y + ARM, px: REST.x, py: REST.y + ARM }; }
    const strap = (n, h) => { const d = Math.hypot(h.x - n.x, h.y - n.y), slack = Math.max(0, ROPE + 6 - d); return `M${n.x} ${n.y} Q${(n.x + h.x) / 2 + (n.x < 200 ? -1 : 1) * slack * 0.35} ${(n.y + h.y) / 2 + slack * 0.6} ${h.x} ${h.y}`; };
    s.draw = () => {
      const { h, c } = s, rot = (-Math.atan2(c.x - h.x, c.y - h.y) * 180) / Math.PI;
      hang.current.style.transform = `translate(${(h.x - REST.x).toFixed(2)}px,${(h.y - REST.y).toFixed(2)}px) rotate(${rot.toFixed(2)}deg)`;
      card.current.style.transform = `rotateX(${s.pitch.toFixed(2)}deg) rotateY(${(s.flip.a + s.yaw).toFixed(2)}deg)`;
      const dl = strap(NL, h), dr = strap(NR, h);
      sL.current.setAttribute("d", dl); pL.current.setAttribute("d", dl); sR.current.setAttribute("d", dr); pR.current.setAttribute("d", dr);
    };
    const tick = () => {
      for (const p of [s.h, s.c]) { const vx = (p.x - p.px) * 0.986, vy = (p.y - p.py) * 0.986; p.px = p.x; p.py = p.y; p.x += vx; p.y += vy + 0.62; }
      if (s.drag) { s.h.x = s.drag.x; s.h.y = s.drag.y; }
      for (let k = 0; k < 6; k++) {
        let dx = s.h.x - A.x, dy = s.h.y - A.y, d = Math.hypot(dx, dy) || 1;
        if (d > ROPE) { s.h.x = A.x + (dx / d) * ROPE; s.h.y = A.y + (dy / d) * ROPE; }
        dx = s.c.x - s.h.x; dy = s.c.y - s.h.y; d = Math.hypot(dx, dy) || 1; const f = (d - ARM) / d;
        if (s.drag) { s.c.x -= dx * f; s.c.y -= dy * f; } else { s.h.x += dx * f * 0.55; s.h.y += dy * f * 0.55; s.c.x -= dx * f * 0.45; s.c.y -= dy * f * 0.45; }
      }
      const vx = s.c.x - s.c.px, vy = s.c.y - s.c.py;
      s.yaw += (Math.max(-42, Math.min(42, vx * 3.2)) - s.yaw) * 0.14; s.pitch += (Math.max(-16, Math.min(16, -vy * 1.6)) - s.pitch) * 0.14;
      s.draw();
    };
    sim.current = s; s.draw();
    if (still) return;
    gsap.fromTo(stage.current.querySelector(".person"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", clearProps: "transform" });
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); gsap.killTweensOf(s.flip); };
  }, [m.id]);
  const pt = (e) => { const r = stage.current.getBoundingClientRect(), k = 400 / r.width; return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k }; };
  const down = (e) => { const p = pt(e), s = sim.current; s.drag = { ox: p.x - s.h.x, oy: p.y - s.h.y, x: s.h.x, y: s.h.y, sx: e.clientX, sy: e.clientY, moved: 0 }; e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e) => { const s = sim.current, d = s.drag; if (!d) return; const p = pt(e); d.x = p.x - d.ox; d.y = p.y - d.oy; d.moved = Math.max(d.moved, Math.hypot(e.clientX - d.sx, e.clientY - d.sy)); };
  const up = () => { const s = sim.current, d = s.drag; s.drag = null; if (d && d.moved < 6) flip(); };
  return (
    <div className="stage" ref={stage}>
      <Person female={female} collar={false} className="figure" />
      <svg className="straps" viewBox="0 0 400 940" aria-hidden="true">
        <defs><linearGradient id="st-g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3b6659" /><stop offset=".5" stopColor="#5a8f80" /><stop offset="1" stopColor="#3b6659" /></linearGradient></defs>
        <path ref={sL} className="ribbon" /><path ref={pL} className="print" /><path ref={sR} className="ribbon" /><path ref={pR} className="print" />
        {!female && <path fill="#fff" stroke="#d5d9d8" strokeWidth="1.2" strokeLinejoin="round" d="M178 238l22 30-28 18-8-36zM222 238l-22 30 28 18 8-36z" />}
        {female && <path fill="#fbf6ec" stroke="#d9d2c3" strokeWidth="1.2" strokeLinejoin="round" d="M181 238c4 14 10 24 19 32l-27 16c-6-12-8-26-6-40zM219 238c-4 14-10 24-19 32l27 16c6-12 8-26 6-40z" />}
      </svg>
      <div className="hang" ref={hang}>
        <svg className="hook" viewBox="0 0 36 46" aria-hidden="true">
          <rect x="6" y="0" width="24" height="14" rx="3" fill="#3b6659" /><circle cx="18" cy="20" r="7" fill="none" stroke="#B99C16" strokeWidth="4" />
          <path d="M18 27v5M11 32h14v5a7 7 0 0 1-14 0z" fill="none" stroke="#B99C16" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="card3d" ref={card} style={{ "--tone": m.tone }} role="button" tabIndex={0} aria-label={t.flip}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } }}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <div className="cside front"><i className="slot" /><CardFront m={m} i={i} lang={lang} /></div>
          <div className="cside back"><i className="slot" /><CardBack m={m} i={i} lang={lang} /></div>
        </div>
      </div>
      <div className="under">
        <button type="button" className="flipbtn" onClick={(e) => { flip(); pop(e.currentTarget); }}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9a8 8 0 0 1 14-3M20 15a8 8 0 0 1-14 3M18 2v4h-4M6 22v-4h4" /></svg>{t.flip}
        </button>
        <p className="hint">{t.dragHint}</p>
      </div>
    </div>
  );
}

/* The CV sheet beside the figure. */
function Cv({ m, i, lang, go }) {
  const t = UI[lang];
  return (
    <article className="cv" style={{ "--tone": m.tone }}>
      <header>
        <svg className="pat" viewBox="0 0 400 120" preserveAspectRatio="xMaxYMid slice" aria-hidden="true"><path d="M250 -20 L330 60 L250 140 H290 L370 60 L290 -20Z M320 -20 L400 60 L320 140 H360 L440 60 L360 -20Z" /></svg>
        <span className="cvphoto"><Photo m={m} /></span>
        <div>
          <span className="eyebrow">{t.cv} · <span className="mono">{code(i)}</span>{m.demo && <i className="demo">{t.demoTag}</i>}</span>
          <h2>{m.name[lang]}</h2>
          <span className="alt" lang={other(lang)}>{m.name[other(lang)]}</span>
          <p className="role">{m.role[lang]}</p>
        </div>
      </header>
      <div className="cvbody">
        <div className="main">
          <section><h3>{t.about}</h3><p>{m.summary[lang]}</p></section>
          <section><h3>{t.exp}</h3>
            <ol className="tl">{m.experience.map((x, k) => (<li key={k}><b>{x.title[lang]}</b><small className="mono">{period(x, lang)}</small><span>{x.place[lang]}</span><p>{x.note[lang]}</p></li>))}</ol>
          </section>
          <section><h3>{t.edu}</h3>
            <ol className="tl">{m.education.map((x, k) => (<li key={k}><b>{x.title[lang]}</b><small className="mono">{period(x, lang)}</small><span>{x.place[lang]}</span></li>))}</ol>
          </section>
        </div>
        <aside>
          <section><h3>{t.skills}</h3><div className="bars">{m.skills.map((s) => (<div key={s.name}><span>{s.name}</span><i><u style={{ width: s.level + "%" }} /></i></div>))}</div></section>
          <section><h3>{t.langs}</h3><div className="kv">{m.languages.map((l, k) => (<div key={k}><span>{l.name[lang]}</span><b>{l.level[lang]}</b></div>))}</div></section>
          <section><h3>{t.contact}</h3><div className="kv">{m.contact.map((c, k) => (<div key={k}><span>{c.label[lang]}</span><b className={typeof c.value === "string" ? "mono" : ""}>{val(c.value, lang)}</b></div>))}</div></section>
        </aside>
      </div>
      <div className="pager"><button type="button" onClick={() => go(-1)}><Arrow />{t.prev}</button><span className="mono">{i + 1} / {TEAM.length}</span><button type="button" onClick={() => go(1)}>{t.next}<Arrow /></button></div>
    </article>
  );
}

function Badge({ m, i, lang }) {
  const t = UI[lang];
  const nav = useNavigate();
  const root = useRef(null);
  const go = (d) => nav("/team/" + TEAM[(i + d + TEAM.length) % TEAM.length].id, { replace: true });
  const close = () => nav("/team");
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") close(); else if (e.key === "ArrowRight") go(lang === "ar" ? -1 : 1); else if (e.key === "ArrowLeft") go(lang === "ar" ? 1 : -1); };
    addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [m.id, lang]);
  useLayoutEffect(() => {
    const fit = () => { const st = root.current.querySelector(".stage"); st.style.zoom = innerWidth <= 900 ? "" : Math.max(0.5, Math.min(1, (innerHeight - 70) / 940)).toFixed(3); };
    fit(); addEventListener("resize", fit); return () => removeEventListener("resize", fit);
  }, [m.id]);
  useEffect(() => {
    if (still) return;
    const el = root.current;
    gsap.fromTo(el.querySelector(".cv"), { opacity: 0, x: lang === "ar" ? -46 : 46 }, { opacity: 1, x: 0, duration: 0.6, delay: 0.15, ease: "power3.out", clearProps: "transform" });
    gsap.fromTo(el.querySelectorAll(".cv section"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, delay: 0.4, stagger: 0.07, ease: "power2.out", clearProps: "transform,opacity" });
    gsap.fromTo(el.querySelectorAll(".bars u"), { scaleX: 0 }, { scaleX: 1, duration: 1.1, delay: 0.7, stagger: 0.08, ease: "power3.out" });
  }, [m.id, lang]);
  return (
    <div className="badge" ref={root} role="dialog" aria-modal="true" aria-label={m.name[lang]} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <button type="button" className="x" onClick={close} aria-label={t.close}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
      <Wearer key={m.id} m={m} i={i} t={t} lang={lang} />
      <Cv m={m} i={i} lang={lang} go={go} />
    </div>
  );
}

function Team({ lang }) {
  const t = UI[lang];
  const { id } = useParams();
  const root = useRef(null);
  const [road, setRoad] = useState(false);
  const idx = TEAM.findIndex((m) => m.id === id);
  useEffect(() => { document.title = (idx >= 0 ? TEAM[idx].name[lang] + " · " : "") + t.team + " · " + t.brand; }, [t, idx, lang]);
  useEffect(() => { rise(root.current.querySelectorAll("h1 span>span"), 0.1); }, [lang]);
  useEffect(() => {
    const el = root.current;
    if (!road) { drawIn(el.querySelectorAll(".org .wire"), { duration: 0.8 }); bloom(el.querySelectorAll(".org .root,.org .pcard"), 0.1); return; }
    if (still) return;
    const rtl = lang === "ar";
    drawIn(el.querySelectorAll(".spine path.lay,.spine path.edge"), { duration: 1.8 });
    gsap.fromTo(el.querySelectorAll(".spine .mid,.lanes .car"), { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 1.2 });
    const stops = [...el.querySelectorAll(".stop")];
    gsap.set(stops.map((x) => x.querySelector(".who")), { opacity: 0 });
    gsap.set(stops.flatMap((x) => [x.querySelector(".pin"), x.querySelector(".dot")]), { opacity: 0 });
    return onReveal(stops, (st) => {
      const a = st.classList.contains("a"), from = (a ? -1 : 1) * (rtl ? -1 : 1) * 90, k = stops.indexOf(st), tl = gsap.timeline({ delay: 0.15 + Math.min(k, 2) * 0.16 });
      tl.fromTo(st.querySelector(".pin"), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2.4)" })
        .fromTo(st.querySelector(".dot"), { opacity: 1, scaleX: 0, transformOrigin: (a ? !rtl : rtl) ? "100% 50%" : "0% 50%" }, { scaleX: 1, duration: 0.35, ease: "power2.out" }, "-=0.2")
        .fromTo(st.querySelector(".who"), { opacity: 0, x: from, rotation: from > 0 ? 3 : -3 }, { opacity: 1, x: 0, rotation: 0, duration: 0.8, ease: "back.out(1.5)", clearProps: "transform,opacity" }, "-=0.15")
        .fromTo(st.querySelector(".ph"), { scale: 0.4 }, { scale: 1, duration: 0.7, ease: "elastic.out(1,0.5)", clearProps: "transform" }, "-=0.55")
        .fromTo(st.querySelectorAll(".tx>*,.end>*"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: "power2.out", clearProps: "transform,opacity" }, "-=0.5");
    });
  }, [road, lang]);
  const lean = (e) => { if (still) return; const el = e.currentTarget, r = el.getBoundingClientRect(); el.style.setProperty("--ry", (((e.clientX - r.left) / r.width - 0.5) * 16).toFixed(1) + "deg"); el.style.setProperty("--rx", ((0.5 - (e.clientY - r.top) / r.height) * 12).toFixed(1) + "deg"); };
  const level = (e) => { e.currentTarget.style.setProperty("--ry", "0deg"); e.currentTarget.style.setProperty("--rx", "0deg"); };
  return (
    <div className="teampage" ref={root}>
      <div className="head top">
        <div><h1><span><span>{t.teamH}</span></span></h1><p>{road ? t.teamRoad : t.teamP}</p></div>
        <button type="button" className="btn solid" onClick={(e) => { setRoad(!road); pop(e.currentTarget); }}>
          <svg className="arw" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: "none" }}>{road ? <path d="M4 5h6v6H4zM14 5h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" /> : <path d="M9 21 11 3h2l2 18M12 6v2M12 11v2M12 16v2" />}</svg>
          {road ? t.showCards : t.showAll}
        </button>
      </div>
      {!road ? (
        <div className="org">
          <div className="root"><b>{t.orgRoot}</b><span className="mono">{TEAM.length}</span></div>
          <svg className="wires" viewBox="0 0 1000 70" preserveAspectRatio="none" aria-hidden="true">
            <path className="wire" d="M500 0V34" />{TEAM.map((_, k) => { const x = ((k + 0.5) / TEAM.length) * 1000; return <path key={k} className="wire" d={`M500 34H${x}V70`} />; })}
            <path className="mid" d={`M${(0.5 / TEAM.length) * 1000} 34H${((TEAM.length - 0.5) / TEAM.length) * 1000}`} />
          </svg>
          <div className="people" style={{ "--n": TEAM.length }}>
            {TEAM.map((m, i) => (
              <Link key={m.id} to={"/team/" + m.id} className="pcard" style={{ "--tone": m.tone }} onPointerMove={lean} onPointerLeave={level} aria-label={m.name[lang]}>
                <i className="slot" /><CardFront m={m} i={i} lang={lang} />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="lanes">
          <svg className="spine" viewBox="0 0 60 100" preserveAspectRatio="none" aria-hidden="true"><path className="lay" d="M30 0V100" /><path className="edge" d="M14 0V100" /><path className="edge" d="M46 0V100" /><path className="mid" d="M30 0V100" /></svg>
          <i className="car" aria-hidden="true" /><i className="car up" aria-hidden="true" />
          {TEAM.map((m, i) => (
            <Link key={m.id} to={"/team/" + m.id} className={"stop " + (i % 2 ? "b" : "a")} style={{ "--tone": m.tone }}>
              <i className="dot" /><i className="pin" />
              <span className="who">
                <span className="ph"><Photo m={m} /></span>
                <span className="tx"><b>{m.name[lang]}</b><small lang={other(lang)}>{m.name[other(lang)]}</small><em>{m.role[lang]}</em></span>
                <span className="end"><span className="mono">{code(i)}</span><span className="go"><Arrow /></span></span>
              </span>
            </Link>
          ))}
        </div>
      )}
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
