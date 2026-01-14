// useTTSEngine.ts
import { fetchTTSResult } from "../../server/fetchTTSResult"
import { TTSInput } from "@manganarrator/contracts"

export function useTTSEngine() {
    const generateOne = async (input: TTSInput) => {
        await fetchTTSResult(input)
    }

    const generateMany = async (inputs: TTSInput[]) => {
        for (const input of inputs) {
            await fetchTTSResult(input)
        }
    }

    return { generateOne, generateMany }
}

// const generateTTS = async (req: TTSInput) => {

//     setLoading(true)
//     setError(null)

//     fetchTTSResult(req)
//         .then((data: TTSOutput) => {
//             setAudioRef(data.audio_ref)
//         })
//         .catch((err) => {
//             console.error("TTS error:", err);

//             if (err.status === 422) {
//                 setError(`Validation error: ${err.message}`);
//             } else {
//                 setError(err.message || "Error generating TTS");
//             }
//         })
//         .finally(() => setLoading(false))
// }