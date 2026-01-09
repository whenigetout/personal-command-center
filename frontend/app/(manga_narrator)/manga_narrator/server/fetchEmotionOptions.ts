import { EmotionOptionsOutput, EMOTIONS } from "@manganarrator/contracts"

const TTS_API_ROOT = process.env.NEXT_PUBLIC_TTS_API as string

export const fetchEmotionOptions = async (
): Promise<EmotionOptionsOutput> => {
    const res = await fetch(
        `${TTS_API_ROOT}/tts/emotions`
    )
    if (!res.ok) {
        const defaultOptions: EmotionOptionsOutput = {
            emotionOptions: Object.values(EMOTIONS)
        }
        return defaultOptions
    }

    return res.json()
}