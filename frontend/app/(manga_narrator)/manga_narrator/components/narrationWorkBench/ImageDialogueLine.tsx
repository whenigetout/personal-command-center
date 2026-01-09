import {
    DialogueText,
    EmotionDDL,
    GenderDDL,
    Speaker,
    TTSLine
} from "./DialogueLineParts"
import { EditAction } from "../../types/EditActionType"
import { MediaRef, Emotion, DialogueLine } from "@manganarrator/contracts"
import { useState, useEffect } from "react"

interface ImageDialogueLineProps {
    run_id: string
    json_file: MediaRef
    image_ref: MediaRef
    dlgLine: DialogueLine
    imageIdx: number
    dlgIdx: number
    emotionOptions: Emotion[]
    dispatchEdit: (action: EditAction) => void
    forceExpand: boolean
    onDlgClick: (idx: number) => void
}

export const ImageDialogueLine = ({
    run_id,
    json_file,
    image_ref,
    dlgLine,
    imageIdx,
    dlgIdx,
    emotionOptions,
    dispatchEdit,
    forceExpand,
    onDlgClick
}: ImageDialogueLineProps) => {

    const [expanded, setExpanded] = useState<boolean>(false);

    useEffect(() => {
        setExpanded(forceExpand);
    }, [forceExpand])

    return (
        <div className="bg-zinc-800 rounded-md p-3 space-y-3" onClick={() => onDlgClick(dlgIdx)}>
            <div className="flex items-start justify-between gap-3">
                <p className="text-zinc-100 leading-snug flex-1">
                    {dlgLine.text}
                </p>

                <button
                    onClick={() => setExpanded(v => !v)}
                    className="text-xs px-2 py-1 rounded bg-zinc-700 hover:bg-zinc-600 shrink-0"
                >
                    {expanded ? "−" : "+"}
                </button>
            </div>


            {expanded && <>
                <p> ID: {dlgLine.id}</p>
                <div className="flex flex-wrap gap-3 text-sm">
                    <Speaker
                        speaker={dlgLine.speaker}
                        imageIdx={imageIdx}
                        dlgIdx={dlgIdx}
                        dispatchEdit={dispatchEdit}
                    />
                    <GenderDDL
                        gender={dlgLine.gender}
                        imageIdx={imageIdx}
                        dlgIdx={dlgIdx}
                        dispatchEdit={dispatchEdit}
                    />
                    <EmotionDDL
                        emotion={dlgLine.emotion}
                        imageIdx={imageIdx}
                        dlgIdx={dlgIdx}
                        emotionOptions={emotionOptions}
                        dispatchEdit={dispatchEdit}
                    />
                    <DialogueText
                        dialogueText={dlgLine.text}
                        imageIdx={imageIdx}
                        dlgIdx={dlgIdx}
                        dispatchEdit={dispatchEdit}
                    />
                </div>
                <TTSLine
                    run_id={run_id}
                    json_file={json_file}
                    image_ref={image_ref}
                    dlgLine={dlgLine}
                    emotionOptions={emotionOptions}
                />
            </>}

        </div>
    )
}
