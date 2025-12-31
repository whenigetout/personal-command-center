import { TTSDialogueRequest, TTSDialogueResponse, TTSDialogueResponseSchema } from "../types/tts_api_types";

const TTS_API_ROOT = process.env.NEXT_PUBLIC_TTS_API as string

export const fetchTTSResult = async (
    req: TTSDialogueRequest
): Promise<TTSDialogueResponse> => {
    const res = await fetch(
        `${TTS_API_ROOT}/tts/dialogue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req)
    }
    )

    const json = await res.json()
    return TTSDialogueResponseSchema.parse(json)

}