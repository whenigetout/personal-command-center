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
}
export const OcrJsonResult = ({
    jsonResponse,
    emotionOptions,
    dispatchEdit
}: OcrJsonResultProps) => {

    const [activeDlgIdx, setActiveDlgIdx] = useState(0)
    return (
        <div className="max-w-5xl mx-auto px-4 space-y-6">
            <h2 className="text-sm text-zinc-400">
                OCR Result · runId: <span className="text-zinc-200">{jsonResponse.run_id}</span>
            </h2>

            {jsonResponse.imageResults.map((image, imageIdx) =>
                <div key={image.image_id}>
                    <div >
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

                    <div >
                        <ImagePanPreview
                            key={image.image_id}
                            image={image}
                            activeDlgIdx={activeDlgIdx}
                            onChangeDlg={setActiveDlgIdx}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
