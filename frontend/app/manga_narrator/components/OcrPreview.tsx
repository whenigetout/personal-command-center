import React, { useState } from 'react'
import ImagePanel from './ImagePanel'

interface DialogueEntry {
    id: number
    image_id: string
    image_file_name: string
    image_rel_path_from_root: string
    speaker: string
    gender: string
    emotion: string
    text: string
}

interface ImageGroup {
    image_file_name: string
    image_rel_path_from_root: string
    image_id: string
    run_id: string
    parsed_dialogue: DialogueEntry[]
    result: any
}

interface Props {
    data: ImageGroup[]
}

export default function OcrPreview({ data }: Props) {
    // Helper: batch trigger all TTS
    const generateAllTtsAllImages = async () => {
        for (const group of data) {
            for (const dialogue of group.parsed_dialogue) {
                // Call your TTS API here. If you want to reuse TtsLine logic, extract triggerTTS into a util.
                // Or emit an event/callback down to TtsLine to trigger it.
            }
        }
        alert("Batch TTS for all images DONE!")
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={generateAllTtsAllImages}
                    className="bg-purple-700 text-white px-4 py-2 rounded mb-3"
                >
                    🗣️ Generate All TTS (All Images)
                </button>
            </div>
            {data.map(group => (
                <ImagePanel key={group.image_id} group={group} />
            ))}
        </div>
    )
}

