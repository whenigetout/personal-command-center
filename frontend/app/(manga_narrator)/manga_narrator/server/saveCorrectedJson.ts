import { error } from "console";
import { PaddleAugmentedOCRRunResponse } from "../types/manga_narrator_django_api_types";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API as string

export const saveCorrectedJson = async (ocrrun: PaddleAugmentedOCRRunResponse): Promise<any> => {
    const res = await fetch(
        `${BACKEND_API}/manga/save_json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ocrrun)
    })

    if (!res.ok) {
        throw new Error("Failed to save json")
    }

    return res.json()
}