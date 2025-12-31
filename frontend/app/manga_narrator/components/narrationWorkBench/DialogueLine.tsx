import {
    DialogueText,
    EmotionDDL,
    GenderDDL,
    Speaker,
    TTSLine
} from "./DialogueLIneParts"
import { DialogueLineResponse } from "../../types/manga_narrator_django_api_types"
import { EditAction } from "../../types/EditActionType"
import { normalizeGender } from "../../types/gender"
import { normalizeEmotion } from "../../types/emotion"
import { run } from "node:test"

interface DialogueLineProps {
    run_id: string
    image_file_name: string
    image_rel_path_from_root: string
    dlgLine: DialogueLineResponse
    imageIdx: number
    dlgIdx: number
    dispatchEdit: (action: EditAction) => void
}

export const DialogueLine = ({
    run_id,
    image_file_name,
    image_rel_path_from_root,
    dlgLine,
    imageIdx,
    dlgIdx,
    dispatchEdit
}: DialogueLineProps) => {

    function joinPath(...parts: string[]) {
        return parts
            .filter(Boolean)
            .map(p => p.replace(/\\/g, "/").replace(/^\/+|\/+$/g, ""))
            .join("/")
    }
    const imageNameBase =
        image_file_name.split("/").pop()?.replace(/\./g, "_") ??
        "unknown_image"

    const audioFolder = joinPath(
        run_id,
        image_rel_path_from_root,
        imageNameBase,
        `dialogue__${dlgLine.id}`
    )

    return (
        <div className="border m-4">{dlgLine.text}
            <p> ID: {dlgLine.id}</p>
            <Speaker
                speaker={dlgLine.speaker}
                imageIdx={imageIdx}
                dlgIdx={dlgIdx}
                dispatchEdit={dispatchEdit}
            />
            <GenderDDL
                gender={normalizeGender(dlgLine.gender)}
                imageIdx={imageIdx}
                dlgIdx={dlgIdx}
                dispatchEdit={dispatchEdit}
            />
            <EmotionDDL
                emotion={normalizeEmotion(dlgLine.emotion)}
                imageIdx={imageIdx}
                dlgIdx={dlgIdx}
                dispatchEdit={dispatchEdit}
            />
            <DialogueText
                dialogueText={dlgLine.text}
                imageIdx={imageIdx}
                dlgIdx={dlgIdx}
                dispatchEdit={dispatchEdit}
            />

            <TTSLine
                audioFolder={audioFolder}
                run_id={run_id}
                image_file_name={image_file_name}
                image_rel_path_from_root={image_rel_path_from_root}
                dlgLine={dlgLine}
            />

        </div>
    )
}
