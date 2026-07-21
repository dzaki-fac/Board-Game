export function asset(path) {
  const base = window.__assetBase || '/'
  const clean = path.startsWith('/') ? path.slice(1) : path
  return base + clean
}
