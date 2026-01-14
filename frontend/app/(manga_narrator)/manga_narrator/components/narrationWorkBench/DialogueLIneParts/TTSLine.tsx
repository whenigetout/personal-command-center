import { useTTSLine } from "../../../client/hooks/useTTSLine"
import { useTTSEngine } from "../../../client/hooks/useTTSEngine"
import { GENDERS, TTSInput, Gender, Emotion, EmotionParams, Speaker, OCRRun, MediaRef, DialogueLine } from "@manganarrator/contracts"
import { GenerateTTSButton } from "./TTSLineParts/GenerateTTSButton"
import { Message } from "../../common/Message"
import { CustomEmotionParams } from "./TTSLineParts/CustomEmotionParams"
import { getTTSLineState, updateTTSLineState } from "../../../shared/ttsLineStateStore"
import { useState, useEffect } from "react"
import { buildTTSInput } from "../../../utils/buildTTSInput"
import { safeFloat } from "../../../utils/helpers"

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

    const persisted = getTTSLineState(dlgLine.id)

    const [persistedCfg, setPersistedCfg] = useState(persisted.cfg)
    const [persistedExg, setPersistedExg] = useState(persisted.exg)
    const [persistedUseCustom, setPersistedUseCustom] = useState(persisted.useCustom)

    useEffect(() => {
        updateTTSLineState(dlgLine.id, {
            cfg: persistedCfg,
            exg: persistedExg,
            useCustom: persistedUseCustom,
        })
    }, [persistedCfg, persistedExg, persistedUseCustom, dlgLine.id])


    const {
        generateOne
    } = useTTSEngine();

    const {
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
    } = useTTSLine(run_id, dlgLine.id, image_ref);



    const handleGenerateTTS = async () => {

        const req = buildTTSInput(
            dlgLine,
            safeFloat,
            persistedExg,
            persistedCfg,
            emotionOptions,
            image_ref,
            persistedUseCustom,
            run_id
        )
        generateOne(req);
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
