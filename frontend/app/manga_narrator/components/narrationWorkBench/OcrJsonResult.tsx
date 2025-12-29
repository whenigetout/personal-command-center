import { MangaImage } from "./MangaImage"
import { OCRRunResponse } from "../../types/manga_narrator_django_api_types"
import { EditAction } from "../../types/EditActionType"

interface OcrJsonResultProps {
    jsonResponse: OCRRunResponse,
    dispatchEdit: (action: EditAction) => void
}
export const OcrJsonResult = ({
    jsonResponse,
    dispatchEdit
}: OcrJsonResultProps) => {
    return (
        <div className="border m-4">OcrJsonResult for runId: {jsonResponse.run_id}
            {jsonResponse.images.map((image, imageIdx) =>
                <MangaImage
                    key={image.image_id}
                    image={image}
                    imageIdx={imageIdx}
                    dispatchEdit={dispatchEdit}
                />)}
        </div>
    )
}
