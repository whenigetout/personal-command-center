import { EditAction, EditActionType } from "../../../types/EditActionType"

interface SpeakerProps {
    speaker: string
    imageIdx: number
    dlgIdx: number
    dispatchEdit: (action: EditAction) => void
}
export const Speaker = ({
    speaker,
    imageIdx,
    dlgIdx,
    dispatchEdit
}: SpeakerProps) => {
    return (
        <div>Speaker
            <input
                className="bg-gray-900 border border-gray-700 text-blue-300 px-2 py-1 rounded mr-2"
                value={speaker}
                onChange={(e) => {
                    dispatchEdit({
                        type: EditActionType.Dialogue_update,
                        imageIdx: imageIdx,
                        dlgIdx: dlgIdx,
                        updates: { speaker: e.target.value }
                    })
                }}
            />
        </div>
    )
}
