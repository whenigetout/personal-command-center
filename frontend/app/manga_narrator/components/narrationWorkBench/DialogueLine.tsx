import {
    DialogueText,
    Emotion,
    Gender,
    Speaker,
    TTSLine
} from "./DialogueLIneParts"
import { DialogueLineResponse } from "../../types/manga_narrator_django_api"

interface DialogueLineProps {
    dlgLine: DialogueLineResponse
    onEdit: (updates: Partial<DialogueLineResponse>) => void
}
export const DialogueLine = ({
    dlgLine,
    onEdit
}: DialogueLineProps) => {
    return (
        <div className="border m-4">{dlgLine.text}
            <Speaker
                speaker={dlgLine.speaker}
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
