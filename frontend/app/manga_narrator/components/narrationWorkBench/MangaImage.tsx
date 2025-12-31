import { DialogueLine } from "./DialogueLine"
import { OCRImageResponse } from "../../types/manga_narrator_django_api_types"
import { EditAction } from "../../types/EditActionType"

interface MangaImageProps {
    run_id: string
    image: OCRImageResponse,
    imageIdx: number,
    dispatchEdit: (action: EditAction) => void
}
export const MangaImage = ({
    run_id,
    image,
    imageIdx,
    dispatchEdit
}: MangaImageProps) => {
    return (
        <div className="border m-4">MangaImage: {image.image_file_name}
            {image.parsed_dialogue.map((dlgLine, dlgIdx) =>
                <DialogueLine
                    key={dlgLine.id}
                    run_id={run_id}
                    image_file_name={image.image_file_name}
                    image_rel_path_from_root={image.image_rel_path_from_root}
                    dlgLine={dlgLine}
                    imageIdx={imageIdx}
                    dlgIdx={dlgIdx}
                    dispatchEdit={dispatchEdit}
                />
            )}
        </div>
    )
}
