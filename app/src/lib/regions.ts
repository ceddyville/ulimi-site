/** Region → member countries mapping for the "Countries & Regions" browse page. */
export const REGIONS: Record<string, string[]> = {
  "East Africa": ["Kenya", "Tanzania", "Uganda", "DRC", "Ethiopia", "Somalia", "Djibouti"],
  "West Africa": ["Nigeria", "Ghana", "Benin", "Togo", "Niger", "Ivory Coast", "Chad"],
  "Southern Africa": ["South Africa", "Zimbabwe", "Botswana", "Namibia", "Mozambique", "Eswatini", "Lesotho"],
};

/** Set of region names (not actual countries) to exclude from country counts. */
export const REGION_NAMES = new Set(Object.keys(REGIONS));
