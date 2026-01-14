import { MangaImage } from "./MangaImage"
import { EditAction } from "../../types/EditActionType"
import { ImagePanPreview } from "./ImagePanPreview"
import { OCRRun, Emotion } from "@manganarrator/contracts"
import { useState } from "react"

interface OcrJsonResultProps {
    jsonResponse: OCRRun
    emotionOptions: Emotion[]
    dispatchEdit: (action: EditAction) => void
    saveJson: () => void
    savePreview: () => void
}
export const OcrJsonResult = ({
    jsonResponse,
    emotionOptions,
    dispatchEdit,
    saveJson,
    savePreview
}: OcrJsonResultProps) => {


    return (
        <div className=" px-4 space-y-6">
            <h2 className="text-sm text-zinc-400">
                OCR Result · runId: <span className="text-zinc-200">{jsonResponse.run_id}</span>
            </h2>

            {jsonResponse.images.map((image, imageIdx) =>
                <MangaImage
                    key={image.image_id}
                    run_id={jsonResponse.run_id}
                    json_file={jsonResponse.ocr_json_file}
                    image={image}
                    imageIdx={imageIdx}
                    emotionOptions={emotionOptions}
                    dispatchEdit={dispatchEdit}
                    saveJson={saveJson}
                    savePreview={savePreview}
                />
            )}
        </div>
    )
}
