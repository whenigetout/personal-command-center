import { TTSLine } from "./TTSLine"
import { DialogueLineResponse } from "../../types/manga_narrator_django_api"

interface DialogueLineProps {
    dlgLine: DialogueLineResponse
}
export const DialogueLine = ({
    dlgLine
}: DialogueLineProps) => {
    return (
        <div className="border m-4">{dlgLine.text}
            <ul>
                <TTSLine
                />

            </ul>
        </div>
    )
}
