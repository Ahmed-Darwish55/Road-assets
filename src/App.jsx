import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import { CATEGORIES, DOCS } from "./docs.js";
import { bloom, pageTurn, pop, themeReveal } from "./motion.js";

const page = document.documentElement;
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
};

const UI = {
  ar: {
    brand: "مركز التوثيق", eyebrow: "أنظمة الطرق · مرجع الفريق",
    lead: "كل ما يخص المشروع في مكان واحد: التصنيفات، مراجع التكامل، والأدلة. كل صفحة لها رابط ثابت.",
    search: "ابحث في الصفحات…", all: "الكل", open: "فتح", updated: "آخر تحديث", pages: "صفحة",
    none: "لا توجد صفحة مطابقة.",
    back: "المركز", standalone: "فتح في تبويب مستقل", missing: "الصفحة غير موجودة", home: "العودة إلى المركز",
  },
  en: {
    brand: "Docs Hub", eyebrow: "Road systems · team reference",
    lead: "Everything about the project in one place: classifications, integration references and guides. Every page has a stable link.",
    search: "Search pages…", all: "All", open: "Open", updated: "Updated", pages: "pages",
    none: "No matching page.",
    back: "Hub", standalone: "Open in its own tab", missing: "Page not found", home: "Back to the hub",
  },
};

const ICONS = {
  tree: <path d="M12 3v6M6 21v-6h12v6M12 9v6M4 21h4M16 21h4M10 3h4" />,
  route: <path d="M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 17h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6" />,
  doc: <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5" />,
};
const Icon = ({ name }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name] || ICONS.doc}
  </svg>
);

// Keep standalone pages in step with the hub's language and theme.
function syncChild(lang, mode) {
  DOCS.forEach((d) => {
    if (d.sync?.modeKey) store.set(d.sync.modeKey, mode);
    if (d.sync?.langKey) store.set(d.sync.langKey, lang);
  });
}

function Toggles({ lang, mode, onLang, onMode }) {
  return (
    <div className="tools">
      <div className={"pill lang" + (lang === "ar" ? " is-ar" : "")} role="group" aria-label="Language">
        <span className="knob" />
        <button type="button" aria-pressed={lang === "en"} onClick={() => onLang("en")}>English</button>
        <button type="button" aria-pressed={lang === "ar"} onClick={() => onLang("ar")}>العربية</button>
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
  );
}

function Home({ lang, mode, onLang, onMode }) {
  const t = UI[lang];
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const grid = useRef(null);
  const cats = useMemo(() => [...new Set(DOCS.map((d) => d.category))], []);
  const list = DOCS.filter((d) => {
    const hay = (d.title.ar + " " + d.title.en + " " + d.summary.ar + " " + d.summary.en + " " + d.slug).toLowerCase();
    return (cat === "all" || d.category === cat) && hay.includes(q.trim().toLowerCase());
  });
  useEffect(() => { document.title = t.brand; }, [t]);
  useEffect(() => { if (grid.current) bloom(grid.current.children); }, [lang, cat]);

  return (
    <div className="wrap" id="wrap">
      <header className="top">
        <div>
          <div className="eyebrow">{t.eyebrow}</div>
          <h1>{t.brand}</h1>
          <p>{t.lead}</p>
        </div>
        <Toggles lang={lang} mode={mode} onLang={onLang} onMode={onMode} />
      </header>

      <div className="bar">
        <div className="seg" role="group">
          <button type="button" aria-pressed={cat === "all"} onClick={(e) => { setCat("all"); pop(e.currentTarget); }}>
            {t.all} <span className="mono">{DOCS.length}</span>
          </button>
          {cats.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={(e) => { setCat(c); pop(e.currentTarget); }}>
              {CATEGORIES[c][lang]} <span className="mono">{DOCS.filter((d) => d.category === c).length}</span>
            </button>
          ))}
        </div>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} aria-label={t.search} />
      </div>

      <div className="grid" ref={grid}>
        {list.map((d) => (
          <Link key={d.slug} to={"/" + d.slug} className="card" style={{ "--k": CATEGORIES[d.category].color }}>
            <span className="ic"><Icon name={d.icon} /></span>
            <span className="tx">
              <b>{d.title[lang]}</b>
              <small>{d.title[lang === "ar" ? "en" : "ar"]}</small>
            </span>
            <p>{d.summary[lang]}</p>
            <span className="meta">
              <i className="tag">{CATEGORIES[d.category][lang]}</i>
              <span>{t.updated} <span className="mono">{d.updated}</span></span>
              <span className="path mono">/{d.slug}</span>
            </span>
          </Link>
        ))}
      </div>
      {!list.length && <p className="none">{t.none}</p>}
    </div>
  );
}

function DocView({ lang }) {
  const t = UI[lang];
  const { slug } = useParams();
  const doc = DOCS.find((d) => d.slug === slug);
  const Page = useMemo(() => (doc?.load ? lazy(doc.load) : null), [doc]);
  useEffect(() => { if (doc) document.title = doc.title[lang]; }, [doc, lang]);
  if (!doc) {
    return (
      <div className="wrap missing">
        <h1>{t.missing}</h1>
        <p className="mono">/{slug}</p>
        <Link className="btn" to="/">{t.home}</Link>
      </div>
    );
  }
  const src = doc.src ? doc.src + (doc.sync?.langHash ? "#" + lang : "") : null;
  return (
    <div className="viewer">
      <div className="vbar">
        <Link to="/" className="back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          {t.back}
        </Link>
        <b>{doc.title[lang]}</b>
        {src && <a href={src} target="_blank" rel="noopener">{t.standalone}</a>}
      </div>
      {src ? (
        <iframe key={src} src={src} title={doc.title[lang]} allow="fullscreen; clipboard-write" />
      ) : (
        <Suspense fallback={null}><Page lang={lang} /></Suspense>
      )}
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState(page.lang === "en" ? "en" : "ar");
  const [mode, setMode] = useState(page.getAttribute("data-mode") || "light");

  useEffect(() => { syncChild(lang, mode); }, [lang, mode]);

  const onLang = (next) => {
    if (next === lang) return;
    pageTurn(document.getElementById("wrap"), next === "ar", () => {
      page.lang = next;
      page.dir = next === "ar" ? "rtl" : "ltr";
      store.set("docs-lang", next);
      flushSync(() => setLang(next));
    });
  };
  const onMode = (next, button) => {
    if (next === mode) return;
    themeReveal(button, next, () => {
      page.setAttribute("data-mode", next);
      store.set("docs-mode", next);
      flushSync(() => setMode(next));
    });
  };

  return (
    <Routes>
      <Route path="/" element={<Home lang={lang} mode={mode} onLang={onLang} onMode={onMode} />} />
      <Route path="/assets" element={<Navigate to="/road-assets-tree" replace />} />
      <Route path="/tomtom" element={<Navigate to="/tomtom-travel-time" replace />} />
      <Route path="/:slug" element={<DocView lang={lang} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
