import { OcrJsonResult } from "../components/narrationWorkBench/OcrJsonResult"
import { OCRRunResponse } from "../types/manga_narrator_django_api"

interface NarrationWorkbenchClientProps {
    ocrJsonData: OCRRunResponse
}

export const NarrationWorkbenchClient = ({
    ocrJsonData
}: NarrationWorkbenchClientProps) => {

    return (
        <div className="mt-12 border-t pt-6">
            NarrationWorkbenchClient
            {/* use OcrPreview here somehow */}
            <OcrJsonResult
                jsonResponse={ocrJsonData}
            />
        </div>
    )
}
