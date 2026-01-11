import { useTTS } from "../../../client/hooks/useTTS"
import { GENDERS, TTSInput, Gender, Emotion, EmotionParams, Speaker, OCRRun, MediaRef, DialogueLine } from "@manganarrator/contracts"
import { GenerateTTSButton } from "./TTSLineParts/GenerateTTSButton"
import { Message } from "../../common/Message"
import { CustomEmotionParams } from "./TTSLineParts/CustomEmotionParams"

interface TTSLineProps {
    run_id: string
    json_file: MediaRef
    image_ref: MediaRef
    dlgLine: DialogueLine
    emotionOptions: Emotion[]
}

export const TTSLine = ({
    run_id,
    json_file,
    image_ref,
    dlgLine,
    emotionOptions
}: TTSLineProps) => {

    const {
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
        reset
    } = useTTS(run_id, dlgLine.id, image_ref);

    function safeFloat(
        value: unknown,
        fallback: number
    ): number {
        const n = typeof value === "number"
            ? value
            : parseFloat(String(value));

        return Number.isFinite(n) ? n : fallback;
    }

    const handleGenerateTTS = () => {
        const GENDER_VALUES = Object.values(GENDERS).map(g => g.value);
        function isGenderValue(value: string): value is Gender["value"] {
            return GENDER_VALUES.includes(value as Gender["value"]);
        }

        const gender: Gender = {
            value: isGenderValue(dlgLine.gender)
                ? dlgLine.gender
                : "neutral",
        };

        const settings: EmotionParams = {
            exaggeration: safeFloat(exg, 1.0),
            cfg: safeFloat(cfg, 1.0),
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
            customSettings: useCustom ? settings : undefined,
            run_id: run_id,
            custom_filename: "",
            dialogue_id: dlgLine.id
        }
        generateTTS(req);
    }

    return (
        <div className="bg-zinc-900/60 rounded-md p-3 space-y-3 border border-zinc-700">

            <CustomEmotionParams
                cfg={cfg}
                exg={exg}
                useCustom={useCustom}
                setCfg={setCfg}
                setExg={setExg}
                setUseCustom={setUseCustom}
            />

            <div className="flex items-center gap-3">
                <GenerateTTSButton
                    audioRef={audioRef}
                    loading={loading}
                    isGenerating={false}
                    onGenerateTTS={handleGenerateTTS}
                />
            </div>

            <Message
                text={error ?? ""}
                tone="error"
            />
        </div>
    )
}
