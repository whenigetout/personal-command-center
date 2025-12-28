import {
    DialogueText,
    Emotion,
    Gender,
    Speaker,
    TTSLine
} from "./DialogueLIneParts"
import { DialogueLineResponse } from "../../types/manga_narrator_django_api"
import { EditAction } from "../../types/EditActionType"

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
            <Speaker
                speaker={dlgLine.speaker}
                imageIdx={imageIdx}
                dlgIdx={dlgIdx}
                dispatchEdit={dispatchEdit}
            />
            <Gender
            />
            <Emotion
            />
            <DialogueText
            />

            <TTSLine
            />

        </div>
    )
}
