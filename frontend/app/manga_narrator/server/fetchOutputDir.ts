import { MangaOutputDirResponse } from "../types/manga_narrator_django_api"

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API as string

export const fetchOutputDir = async (
    relativeInputPath: string
): Promise<MangaOutputDirResponse> => {
    const res = await fetch(
        `${BACKEND_API}/api/manga/output_dir/?path=${encodeURIComponent(relativeInputPath)}`
    )

    if (!res.ok) {
        throw new Error("Bad response")
    }

    return res.json()
}
