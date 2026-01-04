import { PaddleOCRImage, PaddleDialogueLineResponse } from "../../types/manga_narrator_django_api_types"
import { EditAction } from "../../types/EditActionType"
import { mediaBasename } from "../../types/manga_narrator_django_api_types"
import { DialogueLine } from "./DialogueLine"
import { Emotion } from "../../types/tts_api_types"
import { MediaRef } from "../../types/manga_narrator_django_api_types"

interface MangaImageProps {
    run_id: string
    json_file: MediaRef
    image: PaddleOCRImage
    imageIdx: number
    emotionOptions: Emotion[]
    dispatchEdit: (action: EditAction) => void
}
export const MangaImage = ({
    run_id,
    json_file,
    image,
    imageIdx,
    emotionOptions,
    dispatchEdit
}: MangaImageProps) => {
    return (
        <div className="border m-4">MangaImage: {mediaBasename(image.inferImageRes.image_ref)}
            {image.parsedDialogueLines.map((dlgLine, dlgIdx) =>
                <DialogueLine
                    key={dlgLine.id}
                    run_id={run_id}
                    json_file={json_file}
                    image_ref={image.inferImageRes.image_ref}
                    dlgLine={dlgLine}
                    imageIdx={imageIdx}
                    dlgIdx={dlgIdx}
                    emotionOptions={emotionOptions}
                    dispatchEdit={dispatchEdit}
                />
            )}
        </div>
    )
}
