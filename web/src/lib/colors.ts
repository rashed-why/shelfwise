/** Selfwise brand colors — keep in sync with globals.css */
export const colors = {
  teal: "#20A181",
  navy: "#123669",
  blue: "#166AD8",
} as const;

export type BrandColor = keyof typeof colors;
