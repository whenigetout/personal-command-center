import { OcrJsonResult } from "../components/narrationWorkBench/OcrJsonResult"
import { OCRRun, Emotion } from "@manganarrator/contracts"
import { EditAction } from "../types/EditActionType"

interface NarrationWorkbenchClientProps {
    ocrJsonData: OCRRun
    emotionOptions: Emotion[]
    dispatchEdit: (action: EditAction) => void
    saveJson: () => void

}

export const NarrationWorkbenchClient = ({
    ocrJsonData,
    emotionOptions,
    dispatchEdit,
    saveJson
}: NarrationWorkbenchClientProps) => {

    return (
        <div className="mt-12 border-t pt-6">
            NarrationWorkbenchClient
            <OcrJsonResult
                jsonResponse={ocrJsonData}
                emotionOptions={emotionOptions}
                dispatchEdit={dispatchEdit}
                saveJson={saveJson}
            />
        </div>
    )
}
