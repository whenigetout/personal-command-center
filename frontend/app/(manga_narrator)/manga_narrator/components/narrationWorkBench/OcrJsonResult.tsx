import { MangaImage } from "./MangaImage"
import { PaddleAugmentedOCRRunResponse } from "../../types/manga_narrator_django_api_types"
import { EditAction } from "../../types/EditActionType"
import { Emotion } from "../../types/tts_api_types"
import { ImagePanPreview } from "./ImagePanPreview"
import { useState } from "react"

interface OcrJsonResultProps {
    jsonResponse: PaddleAugmentedOCRRunResponse
    emotionOptions: Emotion[]
    dispatchEdit: (action: EditAction) => void
    saveJson: () => void

}
export const OcrJsonResult = ({
    jsonResponse,
    emotionOptions,
    dispatchEdit,
    saveJson
}: OcrJsonResultProps) => {

    const [activeDlgIdx, setActiveDlgIdx] = useState(0)
    return (
        <div className=" px-4 space-y-6">
            <h2 className="text-sm text-zinc-400">
                OCR Result · runId: <span className="text-zinc-200">{jsonResponse.run_id}</span>
            </h2>

            {jsonResponse.imageResults.map((image, imageIdx) =>
                <div className="grid grid-cols-[1fr_1.5fr] gap-6 px-6" key={image.image_id}>
                    <div className="min-w-0">
                        <MangaImage
                            key={image.image_id}
                            run_id={jsonResponse.run_id}
                            json_file={jsonResponse.ocr_json_file}
                            image={image}
                            imageIdx={imageIdx}
                            emotionOptions={emotionOptions}
                            dispatchEdit={dispatchEdit}
                            onChangeDlg={setActiveDlgIdx}
                        />
                    </div>
                    <div className="sticky top-4 flex items-start justify-center">
                        <ImagePanPreview
                            key={image.image_id}
                            image={image}
                            imageIdx={imageIdx}
                            activeDlgIdx={activeDlgIdx}
                            onChangeDlg={setActiveDlgIdx}
                            dispatchEdit={dispatchEdit}
                            saveJson={saveJson}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
