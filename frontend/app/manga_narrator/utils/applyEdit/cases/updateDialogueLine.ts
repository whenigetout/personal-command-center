import { EditAction } from "@/app/manga_narrator/types/EditActionType"
import { OCRRunResponse, OCRImageResponse, DialogueLineResponse } from "@/app/manga_narrator/types/manga_narrator_django_api_types"

export const updateDialogueLine = (
    prev: OCRRunResponse,
    action: EditAction
) => {
    const { imageIdx, dlgIdx, updates } = action

    return {
        ...prev, // 🔒 new ocrrun object (expected)
        images: prev.images.map((img: OCRImageResponse, i) => {
            if (i !== imageIdx) return img // 🔒 SAME reference

            const updatedImg = {
                ...img, // 🔒 new image object
                parsed_dialogue: img.parsed_dialogue.map((dlg: DialogueLineResponse, j) =>
                    j === dlgIdx
                        ? { ...dlg, ...updates } // 🔥 ONLY THIS LINE CHANGES
                        : dlg // 🔒 SAME reference
                ),
            }
            return updatedImg
        }),
    }
}