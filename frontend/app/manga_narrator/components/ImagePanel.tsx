import React, { useState, useRef } from 'react'
import DialogueLine from './DialogueLine'

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
    group: ImageGroup
}

export default function ImagePanel({ group }: Props) {
    const [expandedImage, setExpandedImage] = useState(false)
    const [expandedDialogues, setExpandedDialogues] = useState<Set<number>>(new Set())
    const dialogueRefs = useRef<Array<any>>([]) // Store refs for all DialogueLine

    const toggleDialogue = (id: number) => {
        const next = new Set(expandedDialogues)
        next.has(id) ? next.delete(id) : next.add(id)
        setExpandedDialogues(next)
    }

    const generateAllTtsForImage = async () => {
        for (let i = 0; i < group.parsed_dialogue.length; i++) {
            await dialogueRefs.current[i]?.triggerTTS?.()
            // Optionally: await new Promise(res => setTimeout(res, 50));
        }
        alert("Batch TTS for this image DONE!")
    }

    return (
        <div className="border border-gray-600 rounded">
            <div className="bg-gray-700 px-4 py-2 flex justify-between items-center">
                <span className="font-semibold text-white">📷 {group.image_file_name}</span>
                <button
                    onClick={() => setExpandedImage(prev => !prev)}
                    className="text-sm bg-gray-600 px-2 py-1 rounded hover:bg-gray-500 text-white"
                >
                    {expandedImage ? 'Collapse' : 'Expand'}
                </button>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={generateAllTtsForImage}
                    className="bg-purple-600 text-white px-3 py-1 rounded mb-2"
                >
                    🗣️ Generate All TTS (This Image)
                </button>
            </div>


            <div className="p-4 space-y-2">
                {group.parsed_dialogue.map((dialogue, idx) => (
                    <DialogueLine
                        key={dialogue.id}
                        ref={el => dialogueRefs.current[idx] = el}
                        dialogue={dialogue}
                        expanded={expandedDialogues.has(dialogue.id)}
                        toggleExpanded={() => toggleDialogue(dialogue.id)}
                        run_id={group.run_id}
                    />
                ))}

                {expandedImage && (
                    <div className="mt-4 text-sm bg-gray-900 p-3 rounded text-gray-400">
                        <strong>Raw OCR Result:</strong>
                        <pre className="whitespace-pre-wrap overflow-x-auto mt-2 text-xs">
                            {JSON.stringify(group.result, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    )
}
