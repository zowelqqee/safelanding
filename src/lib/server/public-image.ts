import { existsSync } from "node:fs";
import { join, normalize } from "node:path";

function isLocalPublicImagePath(src?: string): src is string {
  return Boolean(src && src.startsWith("/") && !src.startsWith("//"));
}

export function getExistingPublicImageSrc(src?: string): string | undefined {
  if (!isLocalPublicImagePath(src)) return undefined;

  const normalized = normalize(src).replace(/^(\.\.(\/|\\|$))+/, "");
  const publicPath = join(process.cwd(), "public", normalized);

  return existsSync(publicPath) ? src : undefined;
}
