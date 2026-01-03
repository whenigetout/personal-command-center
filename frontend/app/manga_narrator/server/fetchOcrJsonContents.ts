import { PaddleAugmentedOCRRunResponse } from "../types/manga_narrator_django_api_types";
import { MediaRef } from "../types/manga_narrator_django_api_types";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API as string

export const fetchOcrJsonContents = async (
    mediaRef: MediaRef
): Promise<PaddleAugmentedOCRRunResponse> => {
    const res = await fetch(
        `${BACKEND_API}/api/manga/json_file/?namespace=${mediaRef.namespace}&path=${encodeURIComponent(mediaRef.path)}`
    )

    if (!res.ok) {
        throw new Error("Bad response")
    }

    return res.json()
}