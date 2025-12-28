import { MangaImage } from "./MangaImage"
import { OCRRunResponse } from "../../types/manga_narrator_django_api"

interface OcrJsonResultProps {
    jsonResponse: OCRRunResponse
}
export const OcrJsonResult = ({
    jsonResponse
}: OcrJsonResultProps) => {
    return (
        <div className="border m-4">OcrJsonResult for runId: {jsonResponse.run_id}
            {jsonResponse.images.map(image =>
                <MangaImage
                    key={image.image_id}
                    image={image}
                />)}
        </div>
    )
}
