import { OcrJsonResult } from "../components/narrationWorkBench/OcrJsonResult"
import { MangaImage } from "../components/narrationWorkBench/MangaImage"
import { DialogueLine } from "../components/narrationWorkBench/DialogueLine"
import { TTSLine } from "../components/narrationWorkBench/TTSLine"

interface NarrationWorkbenchClientProps {
    selectedOcrJson: string | null
}

export const NarrationWorkbenchClient = ({
    selectedOcrJson
}: NarrationWorkbenchClientProps) => {
    return (
        <div className="mt-12 border-t pt-6">
            NarrationWorkbenchClient
            {/* use OcrPreview here somehow */}
            <OcrJsonResult
            />
        </div>
    )
}
