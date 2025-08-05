import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import DialogueLine, { DialogueLineRef } from './DialogueLine'

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
    imageIdx: number
    isGenerating: boolean
    setIsGenerating: (x: boolean) => void
    handleDialogueEdit: (
        imageIdx: number,
        dialogueIdx: number,
        updates: Partial<DialogueEntry>
    ) => void
    handleDialogueDelete: (
        imageIdx: number,
        dialogueIdx: number
    ) => void
}

export interface ImagePanelRef {
    triggerAllTtsForImage: () => Promise<void>
}


const ImagePanel = forwardRef<ImagePanelRef, Props>(function ImagePanel({ group, imageIdx, isGenerating, setIsGenerating, handleDialogueEdit, handleDialogueDelete }, ref) {
    const [expandedImage, setExpandedImage] = useState(false)
    const [expandedDialogues, setExpandedDialogues] = useState<Set<number>>(new Set())
    const [batchLoading, setBatchLoading] = useState(false)
    // const dialogueRefs = useRef<Array<DialogueLineRef | null>>([]);
    // const dialogueRefs = useRef<any[]>([]);
    const dialogueRefs = useRef<Array<DialogueLineRef | null>>([]);


    const setDialogueRef = (idx: number) => (el: DialogueLineRef | null) => {
        dialogueRefs.current[idx] = el;
    };


    const toggleDialogue = (id: number) => {
        const next = new Set(expandedDialogues)
        next.has(id) ? next.delete(id) : next.add(id)
        setExpandedDialogues(next)
    }

    const generateAllTtsForImage = async () => {
        setBatchLoading(true)
        setIsGenerating(true)
        try {
            for (let i = 0; i < group.parsed_dialogue.length; i++) {
                await dialogueRefs.current[i]?.triggerTTS?.()
            }
            // alert is optional
            // alert("Batch TTS for this image DONE!")
        } catch (err) {
            // alert("Batch TTS failed! See console.")
            console.error(err)
        } finally {
            setBatchLoading(false)
            setIsGenerating(false)
        }
    }

    // This exposes the function to the parent!
    useImperativeHandle(ref, () => ({
        triggerAllTtsForImage: generateAllTtsForImage
    }));


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

            <button
                onClick={generateAllTtsForImage}
                disabled={batchLoading || isGenerating}
                className="bg-purple-600 text-white px-3 py-1 rounded mb-2
        disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
                {batchLoading ? "🔃 Generating..." : "🎙️ Generate All TTS (This Image)"}
            </button>

            <div className="p-4 space-y-2">
                {group.parsed_dialogue.map((dialogue, idx) => (
                    <DialogueLine
                        key={dialogue.id}
                        ref={setDialogueRef(idx)}
                        dialogue={dialogue}
                        dialogueIdx={idx}                      // NEW
                        imageIdx={imageIdx}                    // NEW
                        handleDialogueEdit={handleDialogueEdit} // NEW
                        handleDialogueDelete={handleDialogueDelete}
                        expanded={expandedDialogues.has(dialogue.id)}
                        toggleExpanded={() => toggleDialogue(dialogue.id)}
                        run_id={group.run_id}
                        isGenerating={isGenerating}
                        setIsGenerating={setIsGenerating}
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
});
export default ImagePanel