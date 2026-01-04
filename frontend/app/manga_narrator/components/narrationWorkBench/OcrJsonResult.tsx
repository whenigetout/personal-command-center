import { MangaImage } from "./MangaImage"
import { PaddleAugmentedOCRRunResponse } from "../../types/manga_narrator_django_api_types"
import { EditAction } from "../../types/EditActionType"
import { Emotion } from "../../types/tts_api_types"

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
    return (
        <div className="border m-4">OcrJsonResult for runId: {jsonResponse.run_id}
            {jsonResponse.imageResults.map((image, imageIdx) =>
                <MangaImage
                    key={image.image_id}
                    run_id={jsonResponse.run_id}
                    json_file={jsonResponse.ocr_json_file}
                    image={image}
                    imageIdx={imageIdx}
                    emotionOptions={emotionOptions}
                    dispatchEdit={dispatchEdit}
                />)}
        </div>
    )
}
