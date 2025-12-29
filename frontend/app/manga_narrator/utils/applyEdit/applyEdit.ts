import { OCRRunResponse } from "../../types/manga_narrator_django_api_types"
import { EditAction, EditActionType } from "../../types/EditActionType"
import { updateDialogueLine } from "./cases/updateDialogueLine"

export function applyEdit(
    prev: OCRRunResponse,
    action: EditAction
): OCRRunResponse {

    switch (action.type) {
        case EditActionType.Dialogue_update:
            return updateDialogueLine(prev, action)

        default:
            return prev
    }
}
