# Road Docs

The team's documentation hub: classifications, integration references and guides, each on its own stable link.

| Link | Page |
| --- | --- |
| `/` | Home |
| `/docs` | Every document, as cards or as a sidebar list |
| `/team` | The team along the road, or as a structure of ID cards; `/team/<id>` opens the member wearing their card, with a CV sheet (edit `src/team.js`, photos go in `public/team/`) |
| `/road-assets-tree` | Road Assets Tree: 2 classifications, 12 families, 279 assets and components |
| `/tomtom-travel-time` | Travel time between traffic counters with the TomTom Routing API |
| `/admin-boundaries-map` | Administrative boundaries map: the 13 regions and the Eastern Province in detail |

Arabic and English, light and dark. The hub passes its language and theme to each page.

## Run locally

```bash
npm install
npm run dev
```

`npm run build` writes the site to `dist/`. Vercel builds it on every push using `vercel.json`.

## Adding a page

Every page is one entry in `src/docs.js`. There are two kinds.

**A standalone HTML page** (a single self-contained file):

1. Put it at `public/pages/<slug>/index.html`.
2. Add an entry to `DOCS` in `src/docs.js`:

```js
{
  slug: "my-page",
  category: "guides",            // a key of CATEGORIES
  icon: "doc",                    // tree | route | doc
  title: { ar: "…", en: "…" },
  summary: { ar: "…", en: "…" },
  updated: "2026-11-24",
  src: "/pages/my-page/index.html",
}
```

**A React page**:

1. Create `src/pages/MyPage.jsx` with a default export. It receives a `lang` prop (`"ar"` or `"en"`).
2. Add the same entry, with `load` instead of `src`:

```js
load: () => import("./pages/MyPage.jsx"),
```

The page is then live at `/<slug>` and appears on the hub. To add a category, add a key to `CATEGORIES` in the same file.

---

# مركز التوثيق

مرجع الفريق: التصنيفات، مراجع التكامل، والأدلة، ولكل صفحة رابط ثابت.

- `/` الرئيسية، `/docs` كل الوثائق (بطاقات أو قائمة جانبية)، `/team` الفريق (يُعدَّل من `src/team.js`).
- `/road-assets-tree` شجرة أصول الطرق.
- `/tomtom-travel-time` زمن الرحلة بين العدادات عبر TomTom.

لإضافة صفحة: ضع الملف في `public/pages/<slug>/index.html` (أو مكوّن React في `src/pages/`) ثم أضف سطرًا في `src/docs.js` كما في القسم الإنجليزي أعلاه.
