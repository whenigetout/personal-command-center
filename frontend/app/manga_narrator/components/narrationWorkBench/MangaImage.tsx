import { DialogueLine } from "./DialogueLine"
import { OCRImageResponse } from "../../types/manga_narrator_django_api"
import { EditAction } from "../../types/EditActionType"

interface MangaImageProps {
    image: OCRImageResponse,
    imageIdx: number,
    dispatchEdit: (action: EditAction) => void
}
export const MangaImage = ({
    image,
    imageIdx,
    dispatchEdit
}: MangaImageProps) => {
    return (
        <div className="border m-4">MangaImage: {image.image_file_name}
            {image.parsed_dialogue.map((dlgLine, dlgIdx) =>
                <DialogueLine
                    key={dlgLine.id}
                    dlgLine={dlgLine}
                    imageIdx={imageIdx}
                    dlgIdx={dlgIdx}
                    dispatchEdit={dispatchEdit}
                />
            )}
        </div>
    )
}
