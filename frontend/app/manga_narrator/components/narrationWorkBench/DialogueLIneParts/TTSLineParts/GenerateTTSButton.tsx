const MEDIA_ROOT = process.env.NEXT_PUBLIC_MEDIA_ROOT as string
import { constructFolderPath } from "../../utils/helpers"
import { MediaRef } from "../../types/manga_narrator_django_api_types"

interface GenerateTTSButtonProps {
    audioRef: MediaRef
    loading: boolean
    isGenerating: boolean
    onGenerateTTS: () => void
}

export const GenerateTTSButton = ({
    audioRef,
    loading,
    isGenerating,
    onGenerateTTS
}: GenerateTTSButtonProps) => {
    const audioUrl = audioRef.path
        ? `${MEDIA_ROOT}/${audioRef.namespace}/${audioRef.path}`
        : "";
    return (
        <div>
            {audioUrl ? (
                <>
                    <div className="text-sm text-green-400">🎧 Latest: <code>{audioUrl.split("/").pop()}</code> </div>
                    <audio src={audioUrl} controls className="my-2 w-full" />
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
