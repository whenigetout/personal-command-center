import { EditAction, EditActionType } from "../../types/EditActionType"
import { ImageDialogueLine } from "./ImageDialogueLine"
import { OCRImage, MediaRef, Emotion } from "@manganarrator/contracts"
import { useState, useEffect } from "react"
import { fileNameFromMediaRef } from "../../utils/helpers"
import { ImagePanPreview } from "./ImagePanPreview"

interface MangaImageProps {
    run_id: string
    json_file: MediaRef
    image: OCRImage
    imageIdx: number
    emotionOptions: Emotion[]
    dispatchEdit: (action: EditAction) => void
    saveJson: () => void
}
export const MangaImage = ({
    run_id,
    json_file,
    image,
    imageIdx,
    emotionOptions,
    dispatchEdit,
    saveJson
}: MangaImageProps) => {

    // for expand/collapse logic
    const [expandAll, setExpandAll] = useState<boolean>(false);
    // for img pan preview
    const [activeDlgIdx, setActiveDlgIdx] = useState(0)

    function nextActiveDlgIdx(
        deletedIdx: number,
        newLength: number
    ): number {
        if (newLength <= 0) return 0;

        // If deleted last item, move left
        if (deletedIdx >= newLength) {
            return newLength - 1;
        }

        // Otherwise, same index now points to next item
        return deletedIdx;
    }


    const handleDeleteDialogue = (dlgIdx: number) => {
        const prevLength = image.dialogue_lines.length;

        dispatchEdit({
            type: EditActionType.Dialogue_delete,
            imageIdx,
            dlgIdx,
            updates: null
        })

        const newLength = prevLength - 1;

        setActiveDlgIdx(
            nextActiveDlgIdx(dlgIdx, newLength)
        );
    }


    return (

        <div className="bg-zinc-900 rounded-lg p-4 shadow space-y-4">
            <div className="text-sm text-zinc-400">
                Image · <span className="text-zinc-200">{fileNameFromMediaRef(image.image_info.image_ref)}</span>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => setExpandAll(v => !v)}
                    className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700"
                >
                    {expandAll ? "Collapse All" : "Expand All"}
                </button>
            </div>

            <div className="grid grid-cols-[1fr_1.5fr] gap-6 px-6" >
                {/* LEFT: scrolls */}
                <div className="max-h-[calc(100vh-6rem)] overflow-y-auto min-w-0">
                    {image.dialogue_lines.map((dlgLine, dlgIdx) =>

                        <ImageDialogueLine
                            key={dlgLine.id}
                            run_id={run_id}
                            json_file={json_file}
                            image_ref={image.image_info.image_ref}
                            dlgLine={dlgLine}
                            imageIdx={imageIdx}
                            dlgIdx={dlgIdx}
                            emotionOptions={emotionOptions}
                            dispatchEdit={dispatchEdit}
                            forceExpand={expandAll}
                            onDlgClick={setActiveDlgIdx}
                            onDelete={handleDeleteDialogue}
                            activeDlgIdx={activeDlgIdx}
                        />

                    )}
                </div>
                {/* RIGHT: sticks */}
                <div className="flex justify-center">
                    <div className="sticky top-4">
                        <ImagePanPreview
                            key={image.image_id}
                            image={image}
                            imageIdx={imageIdx}
                            activeDlgIdx={activeDlgIdx}
                            dispatchEdit={dispatchEdit}
                            saveJson={saveJson}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
