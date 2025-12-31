import { useTTS } from "@/app/manga_narrator/client/hooks/useTTS"
import { TTSDialogueRequest } from "@/app/manga_narrator/types/tts_api_types"
import { GenerateTTSButton } from "../../TTSLineParts/GenerateTTSButton"
import { DialogueLineResponse } from "@/app/manga_narrator/types/manga_narrator_django_api_types"
import { useEffect, useState } from "react"

interface TTSLineProps {
    audioFolder: string
    run_id: string
    image_file_name: string
    image_rel_path_from_root: string
    dlgLine: DialogueLineResponse
}

export const TTSLine = ({
    audioFolder,
    run_id,
    image_file_name,
    image_rel_path_from_root,
    dlgLine
}: TTSLineProps) => {

    const {
        generateTTS,
        audioPath,
        useCustom,
        SetUseCustom,
        cfg,
        setCfg,
        exg,
        setExg,
        loading,
        error,
        reset
    } = useTTS(audioFolder);

    const handleGenerateTTS = () => {
        const req: TTSDialogueRequest = {
            text: dlgLine.text,
            gender: dlgLine.gender,
            emotion: dlgLine.emotion,
            speaker_id: dlgLine.speaker,
            dialogue_id: dlgLine.id,

            run_id: run_id,
            image_rel_path_from_root: image_rel_path_from_root,
            image_file_name: image_file_name,

            // UI-owned fields
            use_custom_params: useCustom,
            cfg: useCustom ? parseFloat(cfg) : undefined,
            exaggeration: useCustom ? parseFloat(exg) : undefined,
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
