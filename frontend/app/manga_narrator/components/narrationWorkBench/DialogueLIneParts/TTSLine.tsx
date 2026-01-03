import { useTTS } from "@/app/manga_narrator/client/hooks/useTTS"
import { GENDER_OPTIONS, TTSInput, Gender, Emotion, EmotionParams, Speaker } from "@/app/manga_narrator/types/tts_api_types"
import { GenerateTTSButton } from "../../TTSLineParts/GenerateTTSButton"
import { PaddleDialogueLineResponse } from "@/app/manga_narrator/types/manga_narrator_django_api_types"
import { MediaRef } from "@/app/manga_narrator/types/manga_narrator_django_api_types"

interface TTSLineProps {
    run_id: string
    image_ref: MediaRef
    dlgLine: PaddleDialogueLineResponse
    emotionOptions: Emotion[]
}

export const TTSLine = ({
    run_id,
    image_ref,
    dlgLine,
    emotionOptions
}: TTSLineProps) => {

    const {
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
        reset
    } = useTTS();

    const handleGenerateTTS = () => {
        const gender: Gender = {
            value: GENDER_OPTIONS.includes(dlgLine.gender as Gender["value"])
                ? (dlgLine.gender as Gender["value"])
                : "neutral"
        }
        const settings: EmotionParams = {
            exaggeration: parseFloat(exg),
            cfg: parseFloat(cfg)
        }

        const emotion: Emotion = {
            name: emotionOptions.some(emo => emo.name === dlgLine.emotion)
                ? dlgLine.emotion
                : "neutral",
            params: settings
        }
        const speaker: Speaker = {
            name: dlgLine.speaker,
            wav_file: "",
            gender: gender
        }

        const req: TTSInput = {
            text: dlgLine.text,
            gender: gender,
            emotion: emotion,
            speaker: speaker,
            image_ref: image_ref,
            customSettings: useCustom ? settings : null,
            run_id: run_id,
            custom_filename: "",
            dialogue_id: dlgLine.id
        }
        generateTTS(req);
    }

    return (
        <div className="border rounded p-2 mt-2 bg-zinc-900 text-zinc-100">
            <GenerateTTSButton
                audioUrl={audioPath}
                loading={loading}
                isGenerating={false}
                onGenerateTTS={handleGenerateTTS}
            />

            {error && (
                <div className="text-red-400 text-sm mt-1">
                    {error}
                </div>
            )}

        </div>
    )
}
