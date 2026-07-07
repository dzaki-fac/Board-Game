export function parseKomponen(komponen) {
    if (!komponen) return []

    const parts = []
    let current = ""
    let depth = 0

    for (const char of komponen) {
        if (char === "(") {
            depth++
            current += char
        } else if (char === ")") {
            depth--
            current += char
        } else if (char === "," && depth === 0) {
            parts.push(current.trim())
            current = ""
        } else {
            current += char
        }
    }

    if (current.trim()) {
        parts.push(current.trim())
    }

    return parts
}
