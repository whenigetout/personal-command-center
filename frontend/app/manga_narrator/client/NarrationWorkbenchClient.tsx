import { OcrJsonResult } from "../components/narrationWorkBench/OcrJsonResult"
import { OCRRunResponse } from "../types/manga_narrator_django_api"
import { EditAction } from "../types/EditActionType"

interface NarrationWorkbenchClientProps {
    ocrJsonData: OCRRunResponse,
    dispatchEdit: (action: EditAction) => void
}

export const NarrationWorkbenchClient = ({
    ocrJsonData,
    dispatchEdit
}: NarrationWorkbenchClientProps) => {

    return (
        <div className="mt-12 border-t pt-6">
            NarrationWorkbenchClient
            {/* use OcrPreview here somehow */}
            <OcrJsonResult
                jsonResponse={ocrJsonData}
                dispatchEdit={dispatchEdit}
            />
        </div>
    )
}
