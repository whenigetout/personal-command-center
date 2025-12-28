import { DialogueLineResponse } from "./manga_narrator_django_api"

export const EditActionType = {
    Dialogue_speaker: "dialogue_speaker",
    DialogueText: "dialogueText",
    TTS: "tts",
} as const

export type EditActionType =
    typeof EditActionType[keyof typeof EditActionType]


export type EditAction =
    | {
        type: typeof EditActionType.Dialogue_speaker
        imageIdx: number
        dlgIdx: number
        speaker: string
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
