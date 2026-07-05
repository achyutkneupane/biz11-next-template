const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost";

const BASE_URL = BASE.endsWith("/") ? BASE : BASE + "/";

export function apiUrl(path: string): URL {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return new URL(clean, BASE_URL);
}
