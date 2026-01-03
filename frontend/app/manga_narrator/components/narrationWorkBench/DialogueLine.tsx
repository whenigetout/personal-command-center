import {
    DialogueText,
    EmotionDDL,
    GenderDDL,
    Speaker,
    TTSLine
} from "./DialogueLIneParts"
import { PaddleDialogueLineResponse } from "../../types/manga_narrator_django_api_types"
import { EditAction } from "../../types/EditActionType"
import { MediaRef } from "../../types/manga_narrator_django_api_types"
import { Gender, Emotion } from "../../types/tts_api_types"

interface DialogueLineProps {
    run_id: string
    image_ref: MediaRef
    dlgLine: PaddleDialogueLineResponse
    imageIdx: number
    dlgIdx: number
    emotionOptions: Emotion[]
    dispatchEdit: (action: EditAction) => void
}

export const DialogueLine = ({
    run_id,
    image_ref,
    dlgLine,
    imageIdx,
    dlgIdx,
    emotionOptions,
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

            <TTSLine
                run_id={run_id}
                image_ref={image_ref}
                dlgLine={dlgLine}
                emotionOptions={emotionOptions}
            />

        </div>
    )
}
