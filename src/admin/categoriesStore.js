import { useEffect, useState, useCallback } from "react";

const LS_KEY = "nh_categories";

const DEFAULTS = [
    { id: 1, name: "Skincare", description: "Herbal creams, facewash, wellness" },
    { id: 2, name: "Hair Care", description: "Shampoos, oils, conditioners" },
    { id: 3, name: "Wellness", description: "Teas, supplements, daily health" },
];

function load() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : DEFAULTS;
    } catch {
        return DEFAULTS;
    }
}
function save(cats) {
    localStorage.setItem(LS_KEY, JSON.stringify(cats));
}

export function useCategories() {
    const [categories, setCategories] = useState(load);

    useEffect(() => {
        // keep in sync if other tabs modify
        const onStorage = (e) => {
            if (e.key === LS_KEY) setCategories(load());
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const addCategory = useCallback((cat) => {
        setCategories((prev) => {
            const next = [...prev, { ...cat, id: Date.now() }];
            save(next);
            return next;
        });
    }, []);

    const updateCategory = useCallback((cat) => {
        setCategories((prev) => {
            const next = prev.map((c) => (c.id === cat.id ? cat : c));
            save(next);
            return next;
        });
    }, []);

    const deleteCategory = useCallback((id) => {
        setCategories((prev) => {
            const next = prev.filter((c) => c.id !== id);
            save(next);
            return next;
        });
    }, []);

    return { categories, addCategory, updateCategory, deleteCategory };
}
