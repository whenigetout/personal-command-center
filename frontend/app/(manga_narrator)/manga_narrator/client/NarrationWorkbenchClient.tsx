import { OcrJsonResult } from "../components/narrationWorkBench/OcrJsonResult"
import { PaddleAugmentedOCRRunResponse } from "../types/manga_narrator_django_api_types"
import { EditAction } from "../types/EditActionType"
import { Emotion } from "../types/tts_api_types"

interface NarrationWorkbenchClientProps {
    ocrJsonData: PaddleAugmentedOCRRunResponse
    emotionOptions: Emotion[]
    dispatchEdit: (action: EditAction) => void
}

export const NarrationWorkbenchClient = ({
    ocrJsonData,
    emotionOptions,
    dispatchEdit
}: NarrationWorkbenchClientProps) => {

    return (
        <div className="mt-12 border-t pt-6">
            NarrationWorkbenchClient
            <OcrJsonResult
                jsonResponse={ocrJsonData}
                emotionOptions={emotionOptions}
                dispatchEdit={dispatchEdit}
            />
        </div>
    )
}
