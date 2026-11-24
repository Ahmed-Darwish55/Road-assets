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
  { label: L("المدينة", "City"), value: L("الرياض", "Riyadh") },
];
const LANGS = [{ name: L("العربية", "Arabic"), level: L("اللغة الأم", "Native") }, { name: L("الإنجليزية", "English"), level: L("مهني", "Professional") }];

export const TEAM = [
  {
    id: "mohamed-sami", name: L("محمد سامي", "Mohamed Sami"), mark: "MS", tone: "#4D7F71", gender: "m", photo: "", demo: true,
    role: L("مطوّر Full-Stack", "Full-Stack Developer"),
    summary: L("مطوّر Full-Stack يبني الخدمات من قاعدة البيانات حتى الواجهة: واجهات REST بـ Node.js، خدمات التكامل مع الأنظمة الخارجية، وشاشات React التي تستهلكها. يهتم بالأداء، وبالمراقبة والتشغيل الموثوق في الإنتاج.", "Full-stack developer building services from the database to the screen: REST APIs in Node.js, integrations with external systems, and the React views that consume them. Cares about performance, monitoring and reliable operation in production."),
    experience: [
      { title: L("مطوّر Full-Stack", "Full-Stack Developer"), place: L("فريق أنظمة الطرق", "Road Systems team"), period: "2024 – الآن", periodEn: "2024 – now", note: L("خدمة زمن الرحلة بين العدادات مع TomTom، وبوابة التكامل مع أنظمة العدّ والكاميرات، ولوحات المتابعة المرتبطة بها.", "Travel-time service between counters with TomTom, the integration gateway for counting and camera systems, and the dashboards on top of them.") },
      { title: L("مطوّر خلفيات وتكاملات", "Back-end & Integration Developer"), place: L("شركة حلول رقمية", "Digital solutions firm"), period: "2021 – 2024", periodEn: "2021 – 2024", note: L("خدمات مصغّرة وواجهات برمجية لمنصات حكومية، وربط أنظمة GIS بقواعد البيانات التشغيلية.", "Microservices and APIs for government platforms, connecting GIS systems to operational databases.") },
      { title: L("مطوّر ويب", "Web Developer"), place: L("شركة ناشئة", "Start-up"), period: "2019 – 2021", periodEn: "2019 – 2021", note: L("تطبيقات ويب كاملة بـ React و Node.js من التصميم حتى النشر.", "Complete web applications in React and Node.js, from design to deployment.") },
    ],
    education: [{ title: L("بكالوريوس هندسة الحاسبات", "BSc Computer Engineering"), place: L("جامعة", "University"), period: "2019" }],
    skills: [{ name: "Node.js / Express / NestJS", level: 92 }, { name: "React / TypeScript", level: 86 }, { name: "PostgreSQL / PostGIS", level: 84 }, { name: "REST, queues & integration", level: 88 }, { name: "Docker / CI-CD", level: 78 }],
    languages: LANGS, contact: DEMO_CONTACT("mohamed.sami"),
  },  {
    id: "ahmed-darwish", name: L("أحمد درويش", "Ahmed Darwish"), mark: "AD", tone: "#B99C16", gender: "m", photo: "/team/ahmed-darwish.jpg", demo: true,
    role: L("مطوّر GIS وواجهات أمامية", "GIS & Front-end Developer"),
    summary: L("مطوّر GIS وواجهات أمامية يبني الخرائط التفاعلية ولوحات المعلومات الجغرافية على الويب. يجمع بين ArcGIS و MapLibre من جهة، و React و Three.js و GSAP من جهة أخرى، مع خلفية في تصميم تجربة المستخدم تجعل الواجهة واضحة ومتّسقة مع الهوية.", "GIS and front-end developer building interactive maps and geospatial dashboards for the web. Combines ArcGIS and MapLibre with React, Three.js and GSAP, with a UX design background that keeps interfaces clear and true to the identity."),
    experience: [
      { title: L("مطوّر GIS وواجهات أمامية", "GIS & Front-end Developer"), place: L("فريق أنظمة الطرق", "Road Systems team"), period: "2026 – الآن", periodEn: "2026 – now", note: L("مركز التوثيق، شجرة أصول الطرق التفاعلية، خريطة التقسيمات الإدارية، ومرجع زمن الرحلة بين العدادات.", "This docs hub, the interactive road assets tree, the administrative boundaries map, and the travel-time reference.") },
      { title: L("مطوّر واجهات وخرائط ويب", "Front-end & Web Mapping Developer"), place: L("منصات حكومية", "Government platforms"), period: "2022 – 2026", periodEn: "2022 – 2026", note: L("منصات خدمات ولوحات معلومات جغرافية، ومكوّن خريطة موحّد يعمل عبر الخدمات.", "Service platforms and GIS dashboards, and a unified map component shared across services.") },
      { title: L("مصمم ومطوّر واجهات", "UI Designer & Developer"), place: L("مشاريع مستقلة", "Independent projects"), period: "2020 – 2022", periodEn: "2020 – 2022", note: L("مواقع وتطبيقات تفاعلية من التصميم حتى النشر.", "Interactive sites and applications from design to deployment.") },
    ],
    education: [{ title: L("بكالوريوس", "Bachelor's degree"), place: L("جامعة", "University"), period: "—" }],
    skills: [{ name: "React / TypeScript", level: 92 }, { name: "ArcGIS JS / Experience Builder", level: 88 }, { name: "MapLibre / web mapping", level: 86 }, { name: "Three.js / GSAP", level: 88 }, { name: "UI/UX & design systems", level: 90 }],
    languages: LANGS, contact: DEMO_CONTACT("ahmed.darwish"),
  },  {
    id: "menna", name: L("منة", "Menna"), mark: "MN", tone: "#B99C16", gender: "f", photo: "", demo: true,
    role: L("مصممة تجربة وواجهات المستخدم", "UI/UX Designer"),
    summary: L("مصممة UI/UX تحوّل المتطلبات إلى رحلات استخدام واضحة وواجهات متّسقة مع هوية الهيئة وكود المنصات. تعمل من البحث وخرائط الرحلة حتى النماذج التفاعلية وتسليم المواصفات للمطوّرين.", "UI/UX designer turning requirements into clear user journeys and interfaces consistent with the Authority identity and the Platforms Code. Works from research and journey maps through to interactive prototypes and developer handoff."),
    experience: [
      { title: L("مصممة UI/UX", "UI/UX Designer"), place: L("فريق أنظمة الطرق", "Road Systems team"), period: "2023 – الآن", periodEn: "2023 – now", note: L("تصميم لوحة الصورة التشغيلية وشاشات إدارة الأصول، وبناء مكتبة المكوّنات في Figma.", "Designed the operations dashboard and asset management screens, and built the component library in Figma.") },
      { title: L("مصممة منتجات رقمية", "Digital Product Designer"), place: L("وكالة رقمية", "Digital agency"), period: "2020 – 2023", periodEn: "2020 – 2023", note: L("منصات خدمات حكومية بالعربية والإنجليزية، واختبارات قابلية الاستخدام مع المستفيدين.", "Government service platforms in Arabic and English, with usability testing with end users.") },
    ],
    education: [{ title: L("بكالوريوس التصميم الجرافيكي والوسائط الرقمية", "BA Graphic Design & Digital Media"), place: L("جامعة", "University"), period: "2020" }],
    skills: [{ name: "Figma & prototyping", level: 94 }, { name: "UX research & testing", level: 84 }, { name: "Design systems", level: 88 }, { name: "Arabic / RTL interfaces", level: 90 }, { name: "Accessibility (WCAG)", level: 78 }],
    languages: LANGS, contact: DEMO_CONTACT("menna"),
  },  {
    id: "moamen", name: L("مؤمن", "Moamen"), mark: "MO", tone: "#76777A", gender: "m", photo: "", demo: true,
    role: L("أخصائي بيانات نظم المعلومات الجغرافية", "GIS Data Specialist"),
    summary: L("أخصائي بيانات GIS مسؤول عن جودة البيانات المكانية وبنيتها: نموذج بيانات أصول الطرق، طبقات الحدود الإدارية، وتجهيز البيانات للنشر على الخرائط والخدمات. يعمل على التدقيق والتوحيد وأتمتة التحديث.", "GIS data specialist responsible for the quality and structure of spatial data: the road asset data model, administrative boundary layers, and preparing data for maps and services. Works on validation, harmonisation and automated updates."),
    experience: [
      { title: L("أخصائي بيانات GIS", "GIS Data Specialist"), place: L("فريق أنظمة الطرق", "Road Systems team"), period: "2024 – الآن", periodEn: "2024 – now", note: L("نموذج بيانات أصول الطرق (279 أصلًا ومكوّنًا)، وطبقات التقسيمات الإدارية بالدقة الكاملة.", "Road asset data model (279 assets and components) and the full-precision administrative boundary layers.") },
      { title: L("محلل بيانات مكانية", "Spatial Data Analyst"), place: L("جهة استشارية", "Consultancy"), period: "2021 – 2024", periodEn: "2021 – 2024", note: L("تدقيق جودة البيانات، توحيد المساقط والترميز، وبناء قواعد البيانات الجغرافية.", "Data quality checks, projection and coding harmonisation, and building geodatabases.") },
    ],
    education: [{ title: L("بكالوريوس نظم المعلومات الجغرافية", "BSc Geographic Information Systems"), place: L("جامعة", "University"), period: "2021" }],
    skills: [{ name: "ArcGIS Pro / Enterprise", level: 92 }, { name: "Geodatabase design", level: 88 }, { name: "Data QA & topology", level: 90 }, { name: "Python (ArcPy) / FME", level: 80 }, { name: "PostGIS / SQL", level: 76 }],
    languages: LANGS, contact: DEMO_CONTACT("moamen"),
  },
];
