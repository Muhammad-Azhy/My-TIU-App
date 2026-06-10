import staticText from "../staticText.json";

const PLACEHOLDER = require("../../assets/placeholder.jpg");

const palette = (staticText.departments || [])
  .map((d) => d["light-color"])
  .filter(Boolean);

const FALLBACK_OVERLAYS = [
  "rgba(76, 106, 145, 0.42)",
  "rgba(124, 106, 142, 0.42)",
  "rgba(108, 142, 114, 0.42)",
  "rgba(140, 126, 108, 0.42)",
  "rgba(108, 122, 142, 0.42)",
  "rgba(142, 108, 130, 0.42)",
];

const OVERLAYS =
  palette.length >= 4
    ? palette.map((hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, 0.42)`;
      })
    : FALLBACK_OVERLAYS;

function hashIndex(id) {
  const s = String(id ?? "0");
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h + s.charCodeAt(i)) % OVERLAYS.length;
  }
  return h;
}

/** Local placeholder image + tint overlay for consistent news thumbnails. */
export function getNewsThumbnail(id) {
  const index = hashIndex(id);
  return {
    source: PLACEHOLDER,
    overlay: OVERLAYS[index % OVERLAYS.length],
    accent: palette[index % palette.length] || "#6C7A99",
  };
}

/** Image source array for Announcement / carousel consumers. */
export function getNewsImageSources(id) {
  const { source } = getNewsThumbnail(id);
  return [source];
}
