export function baseUrl(path) {
    if (!path) return path;
    if (/^(https?:|data:)/i.test(path)) return path;
    const base = import.meta.env.VITE_BASE_PATH || '';
    if (!base) return path;
    return `${base}${path}`;
}
