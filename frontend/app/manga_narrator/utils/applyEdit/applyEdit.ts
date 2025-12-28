import { OCRRunResponse } from "../../types/manga_narrator_django_api"
import { EditAction, EditActionType } from "../../types/EditActionType"
import { updateDialogueSpeaker } from "./cases/updateDialogueSpeaker"

export function applyEdit(
    prev: OCRRunResponse,
    action: EditAction
): OCRRunResponse {

    switch (action.type) {
        case EditActionType.Dialogue_speaker:
            return updateDialogueSpeaker(prev, action)

        default:
            return prev
    }
}
