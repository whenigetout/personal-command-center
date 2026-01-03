import { EditAction, EditActionType } from "@/app/manga_narrator/types/EditActionType"
// import { genderOptions, Gender, normalizeGender } from "@/app/manga_narrator/types/gender"
import { Gender, GENDER_OPTIONS } from "@/app/manga_narrator/types/tts_api_types"

interface GenderDDLProps {
    gender: string
    imageIdx: number
    dlgIdx: number
    dispatchEdit: (action: EditAction) => void
}

export const GenderDDL = ({
    gender,
    imageIdx,
    dlgIdx,
    dispatchEdit
}: GenderDDLProps) => {

    return (
        <div>Gender:
            <select
                className="basic-single w-56 text-black"
                value={gender}
                onChange={(e) =>
                    dispatchEdit({
                        type: EditActionType.Dialogue_update,
                        imageIdx,
                        dlgIdx,
                        updates: { gender: e.target.value }
                    })
                }
            >
                {GENDER_OPTIONS.map((opt, idx) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    )
}