import React from 'react'
import TtsLine from './TtsLine'

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

interface Props {
    dialogue: DialogueEntry
    expanded: boolean
    toggleExpanded: () => void
    run_id: string
}

export default function DialogueLine({ dialogue, expanded, toggleExpanded, run_id }: Props) {
    return (
        <div className="border border-gray-500 p-3 rounded bg-gray-800">
            <div className="flex justify-between items-center">
                <p className="text-sm text-green-300">
                    <strong>{dialogue.speaker}:</strong> {dialogue.text}
                </p>
                <button
                    onClick={toggleExpanded}
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

                    {/* 🎙️ TTS placeholder — fill later */}
                    <div className="mt-3">
                        <button className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-white">
                            🎙️ Generate TTS
                        </button>

                        <TtsLine run_id={run_id} dialogue={dialogue} speakerId={dialogue.speaker} />

                    </div>
                </div>
            )}
        </div>
    )
}
