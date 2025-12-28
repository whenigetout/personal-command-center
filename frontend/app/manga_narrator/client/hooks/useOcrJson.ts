import { useEffect, useState } from "react";
import { OCRRunResponse } from "../../types/manga_narrator_django_api";
import { fetchOcrJsonContents } from "../../server/fetchOcrJsonContents";

// useOcrJson.ts
export function useOcrJson(path: string | null) {
    const [data, setData] = useState<OCRRunResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!path) {
            setData(null);
            return;
        }

        setLoading(true);
        setError(null);

        fetchOcrJsonContents(path)
            .then(setData)
            .catch(() => setError("Failed to load OCR JSON"))
            .finally(() => setLoading(false));
    }, [path]);

    return {
        data,
        loading,
        error
    };
}
