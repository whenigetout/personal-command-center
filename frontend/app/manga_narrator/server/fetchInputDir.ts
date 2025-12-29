import { MangaInputDirResponse } from "../types/manga_narrator_django_api_types"

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API as string

export const fetchInputDir = async (
    relativeInputPath: string
): Promise<MangaInputDirResponse> => {
    const res = await fetch(
        `${BACKEND_API}/api/manga/dir/?path=${encodeURIComponent(relativeInputPath)}`
    )

    if (!res.ok) {
        throw new Error("Bad response")
    }

    return res.json()
}
