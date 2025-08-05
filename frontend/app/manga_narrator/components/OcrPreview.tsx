import React, { useState, useRef } from 'react'
import ImagePanel, { ImagePanelRef } from './ImagePanel'

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

    // GLOBAL: Is *anything* generating?
    const [isGenerating, setIsGenerating] = useState(false);
    const imagePanelRefs = useRef<(ImagePanelRef | null)[]>([]);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Helper: batch trigger all TTS
    const generateAllTtsAllImages = async () => {
        setIsGenerating(true)
        // await sleep(1000); // Wait 2 seconds before starting batch
        try {
            for (let i = 0; i < imagePanelRefs.current.length; i++) {
                await imagePanelRefs.current[i]?.triggerAllTtsForImage?.();
            }
            alert("Batch TTS for all images DONE!")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={generateAllTtsAllImages}
                    className="bg-purple-700 text-white px-4 py-2 rounded mb-3 disabled={isGenerating}"
                >
                    {isGenerating ? "🔃 Generating... Please Wait" : "🎙️ Generate All TTS (All Images)"}
                </button>
            </div>
            {data.map((group, idx) => (
                <ImagePanel
                    key={group.image_id}
                    ref={el => imagePanelRefs.current[idx] = el as any}
                    group={group}
                    isGenerating={isGenerating}
                    setIsGenerating={setIsGenerating}
                />
            ))}

        </div>
    )
}

