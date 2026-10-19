import fs from "node:fs";
import path from "node:path";

const LOGO_PATH = path.join(process.cwd(), "public", "logo.png");

/** Bust browser / Next image cache when logo.png is replaced on disk. */
export function getLogoAsset() {
  const stat = fs.statSync(LOGO_PATH);
  return {
    src: `/logo.png?v=${stat.mtimeMs}`,
    width: 1951,
    height: 480,
  };
}
