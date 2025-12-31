const MEDIA_ROOT_OUTPUTS = process.env.NEXT_PUBLIC_MEDIA_ROOT_OUTPUTS as string
import { constructFolderPath } from "../../utils/helpers"

interface GenerateTTSButtonProps {
    audioUrl: string | null
    loading: boolean
    isGenerating: boolean
    onGenerateTTS: () => void
}

export const GenerateTTSButton = ({
    audioUrl,
    loading,
    isGenerating,
    onGenerateTTS
}: GenerateTTSButtonProps) => {
    return (
        <div>
            {audioUrl ? (
                <>
                    <div className="text-sm text-green-400">🎧 Latest: <code>{audioUrl.split("/").pop()}</code> </div>
                    <audio src={constructFolderPath(MEDIA_ROOT_OUTPUTS, audioUrl)} controls className="my-2 w-full" />
                    <button
                        onClick={() => onGenerateTTS()}
                        className="bg-purple-700 text-white text-xs px-2 py-1 rounded hover:bg-purple-800"
                        disabled={loading || isGenerating}
                    >
                        {loading ? "🔃 Regenerating..." : "🔁 Regenerate"}
                    </button>
                </>
            ) : (
                <button
                    onClick={() => onGenerateTTS()}
                    className="bg-purple-600 text-white text-xs px-2 py-1 rounded hover:bg-purple-700 "
                    disabled={loading || isGenerating}
                >
                    {loading ? "🔃 Generating..." : "🎙️ Generate"}
                </button>
            )}
        </div>
    )
}
