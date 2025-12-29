import { EditAction, EditActionType } from "@/app/manga_narrator/types/EditActionType"
import { genderOptions, Gender, normalizeGender } from "@/app/manga_narrator/types/gender"

interface GenderDDLProps {
    gender: Gender
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
    const safeGender = normalizeGender(gender);

    return (
        <div>Gender:
            <select
                className="basic-single w-56 text-black"
                value={safeGender}
                onChange={(e) =>
                    dispatchEdit({
                        type: EditActionType.Dialogue_update,
                        imageIdx,
                        dlgIdx,
                        updates: { gender: e.target.value }
                    })
                }
            >
                {genderOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}