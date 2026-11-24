// The team. Everything on the team page and on each badge comes from here.
//   photo   path to a portrait under public/, e.g. "/team/menna.jpg" (4:5 works best). Empty shows the initials.
//   role    position shown on the card and the badge
//   bio     a few lines for the details panel
//   focus   short tags: what this person works on
//   links   [{ label, href }] shown at the bottom of the details panel
const M = (id, ar, en, mark, tone, extra = {}) => ({
  id, name: { ar, en }, mark, tone, photo: "", role: { ar: "", en: "" }, bio: { ar: "", en: "" }, focus: { ar: [], en: [] }, links: [], ...extra,
});

export const TEAM = [
  M("mohamed-sami", "محمد سامي", "Mohamed Sami", "MS", "#4E738A"),
  M("menna", "منة", "Menna", "MN", "#A8483D"),
  M("moamen", "مؤمن", "Moamen", "MO", "#B99C16"),
  M("wed", "ود", "Wed", "WD", "#4D7F71"),
  M("ahmed-darwish", "أحمد درويش", "Ahmed Darwish", "AD", "#76777A", {
    role: { ar: "Product Experience Owner", en: "Product Experience Owner" },
  }),
];
