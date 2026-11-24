import { Suspense, lazy, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Link, NavLink, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
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
    teamH: "الفريق", teamP: "الأشخاص وراء المشروع، وكلٌّ في مساره.", count: (n) => `${n} وثائق`,
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
    teamH: "The team", teamP: "The people behind the project, each in their lane.", count: (n) => `${n} documents`,
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

function Shield({ m, size = 76 }) {
  return (
    <svg className="shield" viewBox="0 0 80 88" width={size} aria-hidden="true" style={{ "--tone": m.tone }}>
      <path d="M8 6h64a4 4 0 0 1 4 4v34c0 20-16 32-36 40C20 76 4 64 4 44V10a4 4 0 0 1 4-4z" />
      <path className="in" d="M12 11h56v33c0 16-13 26-28 33-15-7-28-17-28-33z" />
      <text x="40" y="47" textAnchor="middle">{m.mark}</text>
    </svg>
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
        <div className="crew">{TEAM.map((m) => (<Link key={m.id} to="/team" className="member"><Shield m={m} size={64} /><b>{m.name[lang]}</b>{m.role[lang] && <small>{m.role[lang]}</small>}</Link>))}</div>
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

function Team({ lang }) {
  const t = UI[lang];
  const root = useRef(null);
  useEffect(() => { document.title = t.team + " · " + t.brand; }, [t]);
  useEffect(() => {
    const el = root.current;
    rise(el.querySelectorAll("h1 span>span"), 0.1);
    drawIn(el.querySelectorAll(".spine path.lay"), { duration: 1.8, delay: 0.2 });
    bloom(el.querySelectorAll(".stop"), 0.16);
  }, [lang]);
  return (
    <div className="teampage" ref={root}>
      <div className="head top"><div><h1><span><span>{t.teamH}</span></span></h1><p>{t.teamP}</p></div></div>
      <div className="lanes">
        <svg className="spine" viewBox="0 0 60 100" preserveAspectRatio="none" aria-hidden="true"><path className="lay" d="M30 0V100" /><path className="mid" d="M30 0V100" /></svg>
        {TEAM.map((m, i) => (
          <article key={m.id} className={"stop " + (i % 2 ? "b" : "a")} style={{ "--tone": m.tone }}>
            <i className="dot" />
            <div className="who">
              <Shield m={m} />
              <div><h2>{m.name[lang]}</h2><span className="alt" lang={other(lang)}>{m.name[other(lang)]}</span>{m.role[lang] && <p className="role">{m.role[lang]}</p>}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState(page.lang === "en" ? "en" : "ar");
  const [mode, setMode] = useState(page.getAttribute("data-mode") || "light");
  const [view, setViewState] = useState(store.get("docs-view") === "sidebar" ? "sidebar" : "cards");
  const loc = useLocation();
  useEffect(() => { syncChild(lang, mode); }, [lang, mode]);
  useEffect(() => { scrollTo(0, 0); }, [loc.pathname]);
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
          <Route path="/assets" element={<Navigate to="/road-assets-tree" replace />} />
          <Route path="/tomtom" element={<Navigate to="/tomtom-travel-time" replace />} />
          <Route path="/:slug" element={<Viewer lang={lang} view={view} setView={setView} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
