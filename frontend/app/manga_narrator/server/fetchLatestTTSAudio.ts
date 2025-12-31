import { LatestTTSResponse, LatestTTSResponseSchema } from "../types/manga_narrator_django_api_types"
const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API as string

export const fetchLatestTTSAudio = async (
    path: string
): Promise<LatestTTSResponse> => {
    const res = await fetch(
        `${BACKEND_API}/api/manga/latest_audio/?path=${encodeURIComponent(path)}`
    )

    const json = await res.json()
    return LatestTTSResponseSchema.parse(json)

}