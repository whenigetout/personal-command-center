import { EmotionOptionsOutput } from "../types/tts_api_types";

const TTS_API_ROOT = process.env.NEXT_PUBLIC_TTS_API as string

export const fetchEmotionOptions = async (
): Promise<EmotionOptionsOutput> => {
    const res = await fetch(
        `${TTS_API_ROOT}/tts/emotions`
    )
    if (!res.ok) {
        throw new Error("Bad response")
    }

    return res.json()
}