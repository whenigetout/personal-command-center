import { DialogueLine } from "./DialogueLine"
import { OCRImageResponse } from "../../types/manga_narrator_django_api"
interface MangaImageProps {
    image: OCRImageResponse
}
export const MangaImage = ({
    image
}: MangaImageProps) => {
    return (
        <div className="border m-4">MangaImage: {image.image_file_name}
            {image.parsed_dialogue.map(dlgLine =>
                <DialogueLine
                    key={dlgLine.id}
                    dlgLine={dlgLine} />
            )}
        </div>
    )
}
