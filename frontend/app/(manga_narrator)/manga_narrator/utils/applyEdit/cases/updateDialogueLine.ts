import { EditAction } from "../../../types/EditActionType"
import { PaddleAugmentedOCRRunResponse, PaddleOCRImage, PaddleDialogueLineResponse } from "../../../types/manga_narrator_django_api_types"

export const updateDialogueLine = (
    prev: PaddleAugmentedOCRRunResponse,
    action: EditAction
): PaddleAugmentedOCRRunResponse => {
    const { imageIdx, dlgIdx, updates } = action

    return {
        ...prev,
        imageResults: prev.imageResults.map((img: PaddleOCRImage, i) => {
            if (i !== imageIdx) return img

            const updatedImg: PaddleOCRImage = {
                ...img,
                parsedDialogueLines: img.parsedDialogueLines.map((dlg: PaddleDialogueLineResponse, j) =>
                    j === dlgIdx
                        ? { ...dlg, ...updates }
                        : dlg
                )
            }

            return updatedImg
        })
    }
}
