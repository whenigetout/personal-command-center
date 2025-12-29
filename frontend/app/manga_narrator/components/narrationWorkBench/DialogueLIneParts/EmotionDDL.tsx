import { EditAction, EditActionType } from "@/app/manga_narrator/types/EditActionType"
import { emotionOptions, Emotion, normalizeEmotion } from "@/app/manga_narrator/types/emotion"

interface EmotionDDLProps {
    emotion: Emotion
    imageIdx: number
    dlgIdx: number
    dispatchEdit: (action: EditAction) => void
}

export const EmotionDDL = ({
    emotion,
    imageIdx,
    dlgIdx,
    dispatchEdit
}: EmotionDDLProps) => {
    const safeEmotion = normalizeEmotion(emotion);

    return (
        <div>Emotion:
            <select
                className="basic-single w-56 text-black"
                value={safeEmotion}
                onChange={(e) =>
                    dispatchEdit({
                        type: EditActionType.Dialogue_update,
                        imageIdx,
                        dlgIdx,
                        updates: { emotion: e.target.value }
                    })
                }
            >
                {emotionOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}