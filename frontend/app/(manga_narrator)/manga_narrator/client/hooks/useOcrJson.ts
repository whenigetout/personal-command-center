import { useEffect, useState } from "react";
import { PaddleAugmentedOCRRunResponse } from "../../types/manga_narrator_django_api_types";
import { fetchOcrJsonContents } from "../../server/fetchOcrJsonContents";
import { applyEdit } from "../../utils/applyEdit/applyEdit";
import { EditAction } from "../../types/EditActionType";
import { MediaRef } from "../../types/manga_narrator_django_api_types";
import { fetchEmotionOptions } from "../../server/fetchEmotionOptions";
import { EmotionOptionsOutput, Emotion } from "../../types/tts_api_types";

// useOcrJson.ts
export function useOcrJson(json_file: MediaRef | null) {
    const [data, setData] = useState<PaddleAugmentedOCRRunResponse | null>(null);
    const [emotionOptions, setEmotionOptions] = useState<Emotion[]>([])
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
        if (!json_file) {
            setData(null)
            return
        }

        setLoading(true)
        setError(null)

        fetchOcrJsonContents(json_file)
            .then(setData)
            .catch(() => setError("Failed to load OCR JSON"))
            .finally(() => setLoading(false));
    }, [json_file]);

    // Load emotion options for the emotions DDL
    useEffect(() => {
        setLoading(true)
        setError(null)

        fetchEmotionOptions()
            .then((data: EmotionOptionsOutput) => {
                setEmotionOptions(data.emotionOptions)
            })
            .catch(() => setError("Failed to load Emotion Options"))
            .finally(() => setLoading(false));
    }, []);

    return {
        data,
        emotionOptions,
        dispatchEdit,
        loading,
        error
    };
}
