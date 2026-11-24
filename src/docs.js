// The registry of everything published on this site.
// To add a page: see "Adding a page" in README.md.
//
//   slug      URL path: /<slug>
//   src       a standalone HTML page under public/pages/  (OR)
//   load      a lazy React page: () => import("./pages/MyPage.jsx")
//   sync      storage keys the standalone page reads, so it opens in the
//             same language and theme as the hub
export const CATEGORIES = {
  assets: { ar: "الأصول", en: "Assets", color: "var(--b-net)" },
  integrations: { ar: "التكاملات", en: "Integrations", color: "var(--b-pav)" },
  design: { ar: "التصميم", en: "Design", color: "var(--b-oth)" },
  maps: { ar: "الخرائط", en: "Maps", color: "var(--b-str)" },
  guides: { ar: "أدلة", en: "Guides", color: "var(--b-all)" },
};

export const DOCS = [
  {
    slug: "road-assets-tree",
    category: "assets",
    icon: "tree",
    title: { ar: "شجرة أصول الطرق", en: "Road Assets Tree" },
    summary: {
      ar: "تصنيف أصول الطرق من الجذر إلى آخر مكوّن: تصنيفان، 12 قسمًا، و279 أصلًا ومكوّنًا.",
      en: "The road asset classification from the root to the last component: 2 classes, 12 families, 279 assets and components.",
    },
    updated: "2026-11-24",
    src: "/pages/road-assets-tree/index.html",
    sync: { modeKey: "assets-tree-mode", langHash: true },
  },
  {
    slug: "tomtom-travel-time",
    category: "integrations",
    icon: "route",
    title: { ar: "زمن الرحلة بين العدادات", en: "Travel Time Between Counters" },
    summary: {
      ar: "مرجع التكامل مع TomTom Routing API: بناء الطلب، بنية الرد، المؤشرات، وتنفيذ Node.js.",
      en: "Integration reference for the TomTom Routing API: request, response, indicators and a Node.js implementation.",
    },
    updated: "2026-11-24",
    src: "/pages/tomtom-travel-time/index.html",
    sync: { modeKey: "tt-docs-mode", langKey: "tt-docs-lang" },
  },
  {
    slug: "admin-boundaries-map",
    category: "maps",
    icon: "map",
    title: { ar: "خريطة التقسيمات الإدارية", en: "Administrative Boundaries Map" },
    summary: {
      ar: "مناطق المملكة الـ13، ثم المنطقة الشرقية بالتفصيل: المحافظات، المدن، الأمانات، البلديات، والأحياء.",
      en: "The Kingdom's 13 regions, then the Eastern Province in detail: governorates, cities, amanas, municipalities and districts.",
    },
    updated: "2026-11-24",
    src: "/pages/admin-boundaries-map/index.html",
    sync: { modeKey: "ab-mode", langKey: "ab-lang" },
  },
];

export const REPO_URL = "https://github.com/Ahmed-Darwish55/Road-assets";
