import { MediaRef } from "./manga_narrator_django_api_types"
import { MangaDirViewResponse } from "./manga_narrator_django_api_types"

export type BrowserState = {
    currentDir: MediaRef
    currentDirContents: MangaDirViewResponse | null
    history: MediaRef[]
    loading: boolean
    error: string | null
}
