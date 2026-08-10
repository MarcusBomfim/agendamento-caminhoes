import type { Route } from "./types.ts";

function splitPath(path: string) {
  return path.split("/").filter(Boolean);
}

export function findRoute(routes: Route[], method: string, pathname: string) {
  const requestParts = splitPath(pathname);

  for (const route of routes) {
    if (route.method !== method) continue;
    const routeParts = splitPath(route.path);
    if (routeParts.length !== requestParts.length) continue;

    const params: Record<string, string> = {};
    let matches = true;

    for (let index = 0; index < routeParts.length; index += 1) {
      const routePart = routeParts[index];
      const requestPart = requestParts[index];
      if (!routePart || !requestPart) { matches = false; break; }
      if (routePart.startsWith(":")) params[routePart.slice(1)] = decodeURIComponent(requestPart);
      else if (routePart !== requestPart) { matches = false; break; }
    }

    if (matches) return { route, params };
  }

  return null;
}
