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

interface DialogueLineProps {
    dlgLine: DialogueLineResponse
    imageIdx: number
    dlgIdx: number
    dispatchEdit: (action: EditAction) => void
}

export const DialogueLine = ({
    dlgLine,
    imageIdx,
    dlgIdx,
    dispatchEdit
}: DialogueLineProps) => {
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
            />

        </div>
    )
}
