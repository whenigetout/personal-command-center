import { useEffect, useState } from "react"
import { TTSDialogueRequest, TTSDialogueResponse } from "../../types/tts_api_types"
import { fetchTTSResult } from "../../server/fetchTTSResult"
import { fetchLatestTTSAudio } from "../../server/fetchLatestTTSAudio"

export const useTTS = (audioFolder: string) => {
    const [audioPath, setAudioPath] = useState<string | null>(null)
    const [useCustom, SetUseCustom] = useState<boolean>(false)
    const [cfg, setCfg] = useState<string>("")
    const [exg, setExg] = useState<string>("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateTTS = async (req: TTSDialogueRequest) => {
        try {
            setLoading(true)
            setError(null)

            const res = await fetchTTSResult(req)
            setAudioPath(res.audio_path)
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error")
        } finally {
            setLoading(false)
        }
    }

    // Load latest version audio file if exists, only ONCE on mount
    useEffect(() => {
        if (!audioFolder) {
            setAudioPath(null)
            return
        }

        setLoading(true)
        setError(null)

        fetchLatestTTSAudio(audioFolder)
            .then(data => {
                setAudioPath(data.audio_path);
                console.log('logging audio data', data);
            })
            .catch(() => setError("Failed to load Audio File"))
            .finally(() => setLoading(false));

    }, [])

    return {
        generateTTS,
        audioPath,
        useCustom,
        SetUseCustom,
        cfg,
        setCfg,
        exg,
        setExg,
        loading,
        error,
        reset: () => setAudioPath(null)
    }

} 