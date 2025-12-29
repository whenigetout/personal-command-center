import { OCRRunResponse } from "../types/manga_narrator_django_api_types";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API as string

export const fetchOcrJsonContents = async (
    relativePath: string
): Promise<OCRRunResponse> => {
    const res = await fetch(
        `${BACKEND_API}/api/manga/json_file/?path=${encodeURIComponent(relativePath)}`
    )

    if (!res.ok) {
        throw new Error("Bad response")
    }

    return res.json()
}