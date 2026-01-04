import { useEffect, useState } from "react"
import { TTSInput, TTSOutput } from "../../types/tts_api_types"
import { fetchTTSResult } from "../../server/fetchTTSResult"
import { fetchLatestTTSAudio } from "../../server/fetchLatestTTSAudio"
import { MediaRef, MEDIA_NAMESPACES, MediaNamespace } from "../../types/manga_narrator_django_api_types"

export const useTTS = (
    run_id: string,
    dlg_id: number,
    img_file: MediaRef
) => {
    const [audioRef, setAudioRef] = useState<MediaRef>({
        namespace: MEDIA_NAMESPACES[1],
        path: ""
    })
    const [useCustom, setUseCustom] = useState<boolean>(false)
    const [cfg, setCfg] = useState<string>("")
    const [exg, setExg] = useState<string>("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateTTS = async (req: TTSInput) => {

        setLoading(true)
        setError(null)

        fetchTTSResult(req)
            .then((data: TTSOutput) => {
                setAudioRef(data.audio_ref)
            })
            .catch((err) => {
                console.error("TTS error:", err);

                if (err.status === 422) {
                    setError(`Validation error: ${err.message}`);
                } else {
                    setError(err.message || "Error generating TTS");
                }
            })
            .finally(() => setLoading(false))
    }

    // Load latest version audio file if exists, only ONCE on mount
    useEffect(() => {

        setLoading(true)
        setError(null)

        fetchLatestTTSAudio(run_id, dlg_id, img_file)
            .then(data => {
                const latestAudioRef: MediaRef = {
                    namespace: MEDIA_NAMESPACES[1],
                    path: data.audio_path ?? ""
                };
                setAudioRef(latestAudioRef);
            })
            .catch((err) => {
                console.error(err);
                setError(err?.message ?? 'Failed to load Audio File');
            })
            .finally(() => setLoading(false));

    }, [])

    return {
        generateTTS,
        audioRef,
        useCustom,
        setUseCustom,
        cfg,
        setCfg,
        exg,
        setExg,
        loading,
        error,
        reset: () => setAudioRef({
            namespace: MEDIA_NAMESPACES[1],
            path: ""
        })
    }

}
