import { useEffect, useState } from "react";
import { OCRRunResponse } from "../../types/manga_narrator_django_api_types";
import { fetchOcrJsonContents } from "../../server/fetchOcrJsonContents";
import { applyEdit } from "../../utils/applyEdit/applyEdit";
import { EditAction } from "../../types/EditActionType";

// useOcrJson.ts
export function useOcrJson(path: string | null) {
    const [data, setData] = useState<OCRRunResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // for updates
    const dispatchEdit = (action: EditAction) => {
        setData(prev => {
            if (!prev) return prev;
            const updated = applyEdit(prev, action)
            return updated
        })
    };

    // runs once on load and on every render
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
        dispatchEdit,
        loading,
        error
    };
}
