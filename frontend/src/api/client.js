const BASE = "http://localhost:3000/api";

export async function api(path, options = {}) {
    const res = await fetch(BASE + path, {
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return res.json();
}
