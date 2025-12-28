import { EditAction } from "@/app/manga_narrator/types/EditActionType"
import { OCRRunResponse, OCRImageResponse, DialogueLineResponse } from "@/app/manga_narrator/types/manga_narrator_django_api"

export const updateDialogueSpeaker = (
    prev: OCRRunResponse,
    action: EditAction
) => {
    const { imageIdx, dlgIdx, speaker } = action

    return {
        ...prev, // 🔒 new ocrrun object (expected)
        images: prev.images.map((img: OCRImageResponse, i) => {
            if (i !== imageIdx) return img // 🔒 SAME reference

            return {
                ...img, // 🔒 new image object
                dialogue_lines: img.parsed_dialogue.map((dlg: DialogueLineResponse, j) =>
                    j === dlgIdx
                        ? { ...dlg, speaker } // 🔥 ONLY THIS LINE CHANGES
                        : dlg // 🔒 SAME reference
                ),
            }
        }),
    }
}