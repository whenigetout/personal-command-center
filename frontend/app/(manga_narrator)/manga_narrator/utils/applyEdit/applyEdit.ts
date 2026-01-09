import { OCRRun } from "@manganarrator/contracts"
import { EditAction, EditActionType } from "../../types/EditActionType"
import { updateDialogueLine } from "./cases/updateDialogueLine"

export function applyEdit(
    prev: OCRRun,
    action: EditAction
): OCRRun {

    switch (action.type) {
        case EditActionType.Dialogue_update:
            return updateDialogueLine(prev, action)

        default:
            return prev
    }
}
