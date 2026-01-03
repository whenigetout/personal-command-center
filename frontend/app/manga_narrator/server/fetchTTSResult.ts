import { TTSInput, TTSOutput } from "../types/tts_api_types";

const TTS_API_ROOT = process.env.NEXT_PUBLIC_TTS_API as string

export const fetchTTSResult = async (
    req: TTSInput
): Promise<TTSOutput> => {
    const res = await fetch(
        `${TTS_API_ROOT}/tts/dialogue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req)
    }
    )
    if (!res.ok) {
        throw new Error("Bad response")
    }

    return res.json()
}