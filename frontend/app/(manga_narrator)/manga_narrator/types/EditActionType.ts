import { PaddleDialogueLineResponse } from "./manga_narrator_django_api_types"

export const EditActionType = {
    Dialogue_update: "dialogue_update",
} as const

export type EditActionType =
    typeof EditActionType[keyof typeof EditActionType]


export type EditAction =
    | {
        type: typeof EditActionType.Dialogue_update
        imageIdx: number
        dlgIdx: number
        updates: Partial<PaddleDialogueLineResponse>
    }
//   | {
//       type: typeof EditActionType.DialogueText
//       imageIdx: number
//       updates: Partial<ImageResponse>
//     }
//   | {
//       type: typeof EditActionType.TTS
//       imageIdx: number
//       dlgIdx: number
//       updates: Partial<TtsLineConfig>
//     }
