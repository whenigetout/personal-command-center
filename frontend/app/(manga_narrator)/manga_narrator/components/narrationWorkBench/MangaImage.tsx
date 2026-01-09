import { EditAction } from "../../types/EditActionType"
import { ImageDialogueLine } from "./ImageDialogueLine"
import { OCRImage, MediaRef, Emotion } from "@manganarrator/contracts"
import { useState, useEffect } from "react"
import { fileNameFromMediaRef } from "../../utils/helpers"

interface MangaImageProps {
    run_id: string
    json_file: MediaRef
    image: OCRImage
    imageIdx: number
    emotionOptions: Emotion[]
    dispatchEdit: (action: EditAction) => void
    onChangeDlg: (idx: number) => void
}
export const MangaImage = ({
    run_id,
    json_file,
    image,
    imageIdx,
    emotionOptions,
    dispatchEdit,
    onChangeDlg
}: MangaImageProps) => {

    // for expand/collapse logic
    const [expandAll, setExpandAll] = useState<boolean>(false);
    // for img pan preview



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

            <div>
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
                        onDlgClick={onChangeDlg}
                    />
                )}
            </div>
        </div>
    )
}
