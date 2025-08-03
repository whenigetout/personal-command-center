import React, { useState } from 'react'

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
    const [expandedImageIds, setExpandedImageIds] = useState<Set<string>>(new Set())
    const [expandedDialogues, setExpandedDialogues] = useState<Set<string>>(new Set())

    function toggleImage(id: string) {
        const newSet = new Set(expandedImageIds)
        newSet.has(id) ? newSet.delete(id) : newSet.add(id)
        setExpandedImageIds(newSet)
    }

    function toggleDialogue(imageId: string, dialogueId: number) {
        const key = `${imageId}__${dialogueId}`
        const newSet = new Set(expandedDialogues)
        newSet.has(key) ? newSet.delete(key) : newSet.add(key)
        setExpandedDialogues(newSet)
    }

    return (
        <div className="space-y-6">
            {data.map(group => (
                <div key={group.image_id} className="border border-gray-600 rounded">
                    <div className="bg-gray-700 px-4 py-2 flex justify-between items-center">
                        <span className="font-semibold text-white">📷 {group.image_file_name}</span>
                        <button
                            onClick={() => toggleImage(group.image_id)}
                            className="text-sm bg-gray-600 px-2 py-1 rounded hover:bg-gray-500 text-white"
                        >
                            {expandedImageIds.has(group.image_id) ? 'Collapse' : 'Expand'}
                        </button>
                    </div>

                    <div className="p-4 space-y-2">
                        {group.parsed_dialogue.map(dialogue => {
                            const dialogueKey = `${group.image_id}__${dialogue.id}`
                            const expanded = expandedDialogues.has(dialogueKey)
                            return (
                                <div key={dialogue.id} className="border border-gray-500 p-3 rounded bg-gray-800">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-green-300">
                                            <strong>{dialogue.speaker}:</strong> {dialogue.text}
                                        </p>
                                        <button
                                            onClick={() => toggleDialogue(group.image_id, dialogue.id)}
                                            className="text-xs px-2 py-1 bg-blue-600 rounded hover:bg-blue-700 text-white"
                                        >
                                            {expanded ? 'Hide Info' : 'Show Info'}
                                        </button>
                                    </div>
                                    {expanded && (
                                        <div className="mt-2 text-sm text-gray-300 space-y-1">
                                            <div><strong>ID:</strong> {dialogue.id}</div>
                                            <div><strong>Gender:</strong> {dialogue.gender}</div>
                                            <div><strong>Emotion:</strong> {dialogue.emotion}</div>
                                            <div><strong>Image ID:</strong> {dialogue.image_id}</div>
                                            <div><strong>Rel Path:</strong> {dialogue.image_rel_path_from_root}</div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        {expandedImageIds.has(group.image_id) && (
                            <div className="mt-4 text-sm bg-gray-900 p-3 rounded text-gray-400">
                                <strong>Raw OCR Result:</strong>
                                <pre className="whitespace-pre-wrap overflow-x-auto mt-2 text-xs">
                                    {JSON.stringify(group.result, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
