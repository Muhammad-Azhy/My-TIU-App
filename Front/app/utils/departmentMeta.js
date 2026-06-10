import staticText from "../staticText.json";

const departmentsMeta = staticText.departments || [];

const byName = new Map();
const byId = new Map();

departmentsMeta.forEach((dept) => {
  const nameKey = (dept.name || "").toUpperCase().trim();
  if (nameKey) byName.set(nameKey, dept);
  if (dept.id != null) byId.set(String(dept.id), dept);
});

const DEFAULT_META = {
  icon: "apartment",
  "light-color": "#6C7A99",
  "dark-color": "#4A5877",
};

function normalizeName(name) {
  return (name || "").toUpperCase().trim();
}

/**
 * Merges API department rows with colors/icons/descriptions from staticText.json.
 */
export function enrichDepartment(apiDept) {
  if (!apiDept) return { ...DEFAULT_META };

  const nameKey = normalizeName(apiDept.name);
  let meta =
    byName.get(nameKey) ||
    byId.get(String(apiDept.id)) ||
    byName.get(normalizeName(apiDept.code)) ||
    null;

  if (!meta && nameKey) {
    for (const [key, value] of byName.entries()) {
      if (nameKey.includes(key) || key.includes(nameKey)) {
        meta = value;
        break;
      }
    }
  }

  return {
    ...apiDept,
    id: String(apiDept.id),
    name: apiDept.name,
    code: apiDept.code,
    icon: meta?.icon || DEFAULT_META.icon,
    "light-color": meta?.["light-color"] || DEFAULT_META["light-color"],
    "dark-color": meta?.["dark-color"] || DEFAULT_META["dark-color"],
    description: apiDept.description || meta?.description || "",
    tuition: apiDept.tuition || meta?.tuition || "",
    otherInfo: apiDept.otherInfo || meta?.otherInfo || "",
    facultyCount: meta?.facultyCount,
  };
}

export function enrichDepartments(list) {
  return (list || []).map(enrichDepartment);
}
