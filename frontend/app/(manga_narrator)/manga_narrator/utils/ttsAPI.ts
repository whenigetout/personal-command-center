// utils/ttsApi.ts

const TTS_API_ROOT = process.env.NEXT_PUBLIC_TTS_API as string;

export interface TtsPayload {
    text: string;
    gender: string;
    emotion: string;
    speaker_id: string;
    run_id: string;
    image_rel_path_from_root: string;
    image_file_name: string;
    dialogue_id: number;
    use_custom_params?: boolean;
    exaggeration?: number;
    cfg?: number;
}

export async function triggerTtsApi(payload: TtsPayload) {
    try {
        const res = await fetch(`${TTS_API_ROOT}/tts/dialogue`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const result = await res.json();
        return result;
    } catch (err) {
        console.error("TTS API call failed:", err);
        throw err;
    }
}
