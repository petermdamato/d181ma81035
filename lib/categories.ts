/**
 * Category and subcategory taxonomy for data vendors.
 * Values are used in the DB and URL params — keep in sync.
 */
export const CATEGORIES = {
  "Real Estate": [
    "Residential",
    "Commercial",
    "Industrial",
    "Land",
    "Property Management",
  ],
  Healthcare: [
    "Hospitals & Clinics",
    "Pharmaceuticals",
    "Health Insurance",
    "Medical Devices",
    "Home Health Care",
  ],
  Technology: [
    "Software",
    "Hardware",
    "Semiconductors",
    "Telecommunications",
  ],
  Infrastructure: [
    "Transport",
    "Utilities",
    "Urban Development",
  ],
  People: [
    "Demographics",
    "Education & Skills",
    "Income & Wealth Distribution",
    "Migration & Population Movement",
    "Public Health",
  ],
  Business: [
    "Small & Medium Enterprises",
    "Corporations",
    "Startups",
    "Retail & E-commerce",
    "Manufacturing",
  ],
  Econometrics: [
    "Indicators",
    "Forecasts",
    "Government & Policy",
  ],
} as const;

export type CategoryName = keyof typeof CATEGORIES;
export type SubcategoryName<T extends CategoryName = CategoryName> =
  (typeof CATEGORIES)[T][number];

export const CATEGORY_LIST = Object.keys(CATEGORIES) as CategoryName[];

export function getSubcategories(category: CategoryName): readonly string[] {
  return CATEGORIES[category];
}

export function isCategory(value: string): value is CategoryName {
  return value in CATEGORIES;
}

export function isSubcategoryOf(
  category: CategoryName,
  subcategory: string
): boolean {
  return (CATEGORIES[category] as readonly string[]).includes(subcategory);
}
