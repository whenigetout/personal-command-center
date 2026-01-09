import { EditAction, EditActionType } from "../../../types/EditActionType"
// import { genderOptions, Gender, normalizeGender } from "@/app/manga_narrator/types/gender"
import { GENDERS } from "@manganarrator/contracts"

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
                {Object.values(GENDERS).map((opt, idx) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.value}
                    </option>
                ))}
            </select>
        </div>
    )
}