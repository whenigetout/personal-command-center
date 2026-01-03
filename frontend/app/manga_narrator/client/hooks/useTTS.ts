import { useEffect, useState } from "react"
import { TTSInput, TTSOutput } from "../../types/tts_api_types"
import { fetchTTSResult } from "../../server/fetchTTSResult"
import { fetchLatestTTSAudio } from "../../server/fetchLatestTTSAudio"

export const useTTS = () => {
    const [audioPath, setAudioPath] = useState<string | null>(null)
    const [useCustom, setUseCustom] = useState<boolean>(false)
    const [cfg, setCfg] = useState<string>("")
    const [exg, setExg] = useState<string>("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateTTS = async (req: TTSInput) => {
        try {
            setLoading(true)
            setError(null)

            fetchTTSResult(req)
                .then((data: TTSOutput) => {
                    setAudioPath(data.audio_posix_path)
                })
                .catch(() => setError("Error generating TTS"))
                .finally(() => setLoading(false))
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
            setUseCustom,
            cfg,
            setCfg,
            exg,
            setExg,
            loading,
            error,
            reset: () => setAudioPath(null)
        }

    } 