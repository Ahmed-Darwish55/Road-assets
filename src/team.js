// The team. Everything on the team page, the ID card and the CV panel comes from here.
//   photo       portrait under public/, e.g. "/team/menna.jpg" (4:5, plain background). Empty shows the initials.
//   role        position, in Arabic and English (both are printed on the card)
//   summary     two or three lines for the top of the CV
//   experience  [{ title: {ar,en}, place: {ar,en}, period: "2024 – now" }]
//   skills      { ar: [...], en: [...] }
//   contact     [{ label: {ar,en}, value: "name@org.sa", href: "mailto:name@org.sa" }]
const M = (id, ar, en, mark, tone, extra = {}) => ({
  id, name: { ar, en }, mark, tone, photo: "", role: { ar: "", en: "" }, summary: { ar: "", en: "" },
  experience: [], skills: { ar: [], en: [] }, contact: [], ...extra,
});

export const TEAM = [
  M("mohamed-sami", "محمد سامي", "Mohamed Sami", "MS", "#4D7F71"),
  M("menna", "منة", "Menna", "MN", "#B99C16"),
  M("moamen", "مؤمن", "Moamen", "MO", "#76777A"),
  M("wed", "ود", "Wed", "WD", "#4D7F71"),
  M("ahmed-darwish", "أحمد درويش", "Ahmed Darwish", "AD", "#B99C16", {
    role: { ar: "مسؤول تجربة المنتج", en: "Product Experience Owner" },
  }),
];
