// The team. The team page, the ID card and the CV sheet all read from here.
//
//   gender      "m" or "f": picks the figure and the default portrait
//   photo       portrait under public/, e.g. "/team/menna.jpg" (square or 4:5). Empty shows the default portrait.
//   role        position, in Arabic and English (both are printed on the card)
//   demo        true while the CV below is placeholder content; shows a "Demo data" tag on the sheet
//   summary, experience, education, skills, languages, contact: the CV
const L = (ar, en) => ({ ar, en });
const DEMO_CONTACT = (id) => [
  { label: L("البريد", "Email"), value: id + "@example.com" },
  { label: L("المكتب", "Office"), value: "+966 11 000 0000" },
  { label: L("المدينة", "City"), value: "Riyadh" },
];
const LANGS = [{ name: L("العربية", "Arabic"), level: L("اللغة الأم", "Native") }, { name: L("الإنجليزية", "English"), level: L("مهني", "Professional") }];

export const TEAM = [
  {
    id: "mohamed-sami", name: L("محمد سامي", "Mohamed Sami"), mark: "MS", tone: "#4D7F71", gender: "m", photo: "", demo: true,
    role: L("مهندس برمجيات خلفية", "Back-end Engineer"),
    summary: L("مهندس خلفيات يبني خدمات التكامل وواجهات البيانات لأنظمة الطرق، مع تركيز على الأداء وموثوقية التشغيل.", "Back-end engineer building integration services and data APIs for road systems, focused on performance and operational reliability."),
    experience: [
      { title: L("مهندس برمجيات خلفية", "Back-end Engineer"), place: L("فريق أنظمة الطرق", "Road Systems team"), period: "2024 – الآن", periodEn: "2024 – now", note: L("خدمات Node.js لزمن الرحلة والعدّ المروري.", "Node.js services for travel time and traffic counting.") },
      { title: L("مطوّر تكاملات", "Integration Developer"), place: L("شركة حلول رقمية", "Digital solutions firm"), period: "2021 – 2024", periodEn: "2021 – 2024", note: L("ربط أنظمة GIS بقواعد البيانات التشغيلية.", "Connected GIS systems to operational databases.") },
      { title: L("مطوّر برمجيات", "Software Developer"), place: L("شركة ناشئة", "Start-up"), period: "2019 – 2021", periodEn: "2019 – 2021", note: L("واجهات REST وخدمات مصغّرة.", "REST APIs and microservices.") },
    ],
    education: [{ title: L("بكالوريوس هندسة الحاسبات", "BSc Computer Engineering"), place: L("جامعة", "University"), period: "2019" }],
    skills: [{ name: "Node.js", level: 92 }, { name: "PostgreSQL / PostGIS", level: 84 }, { name: "REST & Integration", level: 88 }, { name: "Docker", level: 74 }],
    languages: LANGS, contact: DEMO_CONTACT("mohamed.sami"),
  },
  {
    id: "menna", name: L("منة", "Menna"), mark: "MN", tone: "#B99C16", gender: "f", photo: "", demo: true,
    role: L("محللة نظم المعلومات الجغرافية", "GIS Analyst"),
    summary: L("محللة GIS تعمل على طبقات الأصول والحدود الإدارية، وتحوّل البيانات المكانية إلى خرائط ولوحات تدعم القرار.", "GIS analyst working on asset layers and administrative boundaries, turning spatial data into maps and dashboards that support decisions."),
    experience: [
      { title: L("محللة GIS", "GIS Analyst"), place: L("فريق أنظمة الطرق", "Road Systems team"), period: "2023 – الآن", periodEn: "2023 – now", note: L("نموذج بيانات أصول الطرق وطبقات الخريطة.", "Road asset data model and map layers.") },
      { title: L("أخصائية بيانات مكانية", "Spatial Data Specialist"), place: L("جهة استشارية", "Consultancy"), period: "2020 – 2023", periodEn: "2020 – 2023", note: L("تدقيق جودة البيانات المكانية وتوحيدها.", "Spatial data quality checks and harmonisation.") },
    ],
    education: [{ title: L("بكالوريوس نظم معلومات جغرافية", "BSc Geographic Information Systems"), place: L("جامعة", "University"), period: "2020" }],
    skills: [{ name: "ArcGIS Pro / Enterprise", level: 90 }, { name: "Spatial analysis", level: 86 }, { name: "Python (ArcPy)", level: 72 }, { name: "Cartography", level: 82 }],
    languages: LANGS, contact: DEMO_CONTACT("menna"),
  },
  {
    id: "moamen", name: L("مؤمن", "Moamen"), mark: "MO", tone: "#76777A", gender: "m", photo: "", demo: true,
    role: L("مهندس واجهات أمامية", "Front-end Engineer"),
    summary: L("مهندس واجهات يبني لوحات المتابعة والخرائط التفاعلية بـ React، مع عناية بالأداء وسهولة الاستخدام بالعربية والإنجليزية.", "Front-end engineer building dashboards and interactive maps in React, with care for performance and usability in Arabic and English."),
    experience: [
      { title: L("مهندس واجهات أمامية", "Front-end Engineer"), place: L("فريق أنظمة الطرق", "Road Systems team"), period: "2024 – الآن", periodEn: "2024 – now", note: L("لوحة الصورة التشغيلية ومكوّن الخريطة الموحد.", "Operations dashboard and the unified map component.") },
      { title: L("مطوّر واجهات", "UI Developer"), place: L("وكالة رقمية", "Digital agency"), period: "2021 – 2024", periodEn: "2021 – 2024", note: L("منصات حكومية متوافقة مع كود المنصات.", "Government platforms aligned with the Platforms Code.") },
    ],
    education: [{ title: L("بكالوريوس علوم الحاسب", "BSc Computer Science"), place: L("جامعة", "University"), period: "2021" }],
    skills: [{ name: "React / TypeScript", level: 91 }, { name: "MapLibre / ArcGIS JS", level: 80 }, { name: "GSAP / Three.js", level: 76 }, { name: "Accessibility", level: 78 }],
    languages: LANGS, contact: DEMO_CONTACT("moamen"),
  },
  {
    id: "wed", name: L("ود", "Wed"), mark: "WD", tone: "#4D7F71", gender: "m", photo: "", demo: true,
    role: L("محلل أعمال", "Business Analyst"),
    summary: L("محلل أعمال يوثّق المتطلبات وحالات الاستخدام، ويربط بين أصحاب المصلحة وفريق التنفيذ لضمان وضوح النطاق.", "Business analyst documenting requirements and use cases, linking stakeholders and the delivery team to keep scope clear."),
    experience: [
      { title: L("محلل أعمال", "Business Analyst"), place: L("فريق أنظمة الطرق", "Road Systems team"), period: "2024 – الآن", periodEn: "2024 – now", note: L("وثائق المتطلبات ومؤشرات الأداء.", "Requirements documents and KPIs.") },
      { title: L("محلل نظم", "Systems Analyst"), place: L("شركة تقنية", "Technology company"), period: "2020 – 2024", periodEn: "2020 – 2024", note: L("تحليل الإجراءات ونمذجتها.", "Process analysis and modelling.") },
    ],
    education: [{ title: L("بكالوريوس نظم المعلومات الإدارية", "BSc Management Information Systems"), place: L("جامعة", "University"), period: "2020" }],
    skills: [{ name: "Requirements & BRDs", level: 90 }, { name: "Process modelling", level: 84 }, { name: "KPI design", level: 80 }, { name: "Jira / Confluence", level: 86 }],
    languages: LANGS, contact: DEMO_CONTACT("wed"),
  },
  {
    id: "ahmed-darwish", name: L("أحمد درويش", "Ahmed Darwish"), mark: "AD", tone: "#B99C16", gender: "m", photo: "/team/ahmed-darwish.jpg", demo: true,
    role: L("مسؤول تجربة المنتج", "Product Experience Owner"),
    summary: L("مسؤول تجربة المنتج، يجمع بين تصميم تجربة المستخدم والبرمجة لتحويل المتطلبات إلى واجهات واضحة ومتّسقة مع الهوية.", "Product experience owner combining UX design and engineering to turn requirements into clear interfaces that stay true to the identity."),
    experience: [
      { title: L("مسؤول تجربة المنتج", "Product Experience Owner"), place: L("فريق أنظمة الطرق", "Road Systems team"), period: "2026 – الآن", periodEn: "2026 – now", note: L("تجربة المنتج ونظام التصميم ومركز التوثيق.", "Product experience, the design system and this docs hub.") },
      { title: L("مصمم تجربة ومطوّر واجهات", "UX Designer & Front-end Developer"), place: L("منصات حكومية", "Government platforms"), period: "2022 – 2026", periodEn: "2022 – 2026", note: L("منصات خدمات ولوحات معلومات جغرافية.", "Service platforms and GIS dashboards.") },
    ],
    education: [{ title: L("بكالوريوس", "Bachelor's degree"), place: L("جامعة", "University"), period: "—" }],
    skills: [{ name: "UX / UI design", level: 93 }, { name: "React / Three.js / GSAP", level: 88 }, { name: "Design systems", level: 90 }, { name: "Figma", level: 92 }],
    languages: LANGS, contact: DEMO_CONTACT("ahmed.darwish"),
  },
];
