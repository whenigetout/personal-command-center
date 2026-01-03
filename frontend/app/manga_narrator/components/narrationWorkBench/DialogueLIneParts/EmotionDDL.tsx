import { EditAction, EditActionType } from "@/app/manga_narrator/types/EditActionType"
import { Emotion } from "@/app/manga_narrator/types/tts_api_types"

interface EmotionDDLProps {
    emotion: string
    imageIdx: number
    dlgIdx: number
    emotionOptions: Emotion[]
    dispatchEdit: (action: EditAction) => void
}

export const EmotionDDL = ({
    emotion,
    imageIdx,
    dlgIdx,
    emotionOptions,
    dispatchEdit
}: EmotionDDLProps) => {
    const knownEmotion = emotionOptions.some(emo => emo.name == emotion)
    const newEmotion = knownEmotion ? "" : `unknown_emotion: ${emotion}`

    return (
        <div>Emotion:
            <select
                className="basic-single w-56 text-black"
                value={knownEmotion ? emotion : newEmotion}
                onChange={(e) =>
                    dispatchEdit({
                        type: EditActionType.Dialogue_update,
                        imageIdx,
                        dlgIdx,
                        updates: { emotion: e.target.value }
                    })
                }
            >
                {emotionOptions.map(emo => (
                    <option key={emo.name} value={emo.name}>
                        {emo.name}
                    </option>
                ))}
                {!knownEmotion &&
                    <option key={newEmotion} value={newEmotion}>
                        {newEmotion}
                    </option>
                }
            </select>
        </div>
    )
}