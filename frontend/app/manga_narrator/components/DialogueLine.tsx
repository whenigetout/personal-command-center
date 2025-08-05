import React, { forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import TtsLine from './TtsLine';

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
    dialogueIdx: number
    imageIdx: number
    handleDialogueEdit: (
        imageIdx: number,
        dialogueIdx: number,
        updates: Partial<DialogueEntry>
    ) => void
    handleDialogueDelete: (
        imageIdx: number,
        dialogueIdx: number
    ) => void
    expanded: boolean
    toggleExpanded: () => void
    run_id: string
    isGenerating: boolean
    setIsGenerating: (val: boolean) => void
}


export interface DialogueLineRef {
    triggerTTS: () => Promise<void>
}

const DialogueLine = forwardRef<DialogueLineRef, Props>(function DialogueLine(
    { dialogue, dialogueIdx, imageIdx, expanded, handleDialogueEdit, handleDialogueDelete, toggleExpanded, run_id, isGenerating, setIsGenerating },
    ref
) {
    // Make a ref to TtsLine
    const ttsLineRef = useRef<any>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [dialogue.text]);

    // Expose triggerTTS from TtsLine
    useImperativeHandle(ref, () => ({
        triggerTTS: async () => {
            if (ttsLineRef.current?.triggerTTS) {
                await ttsLineRef.current.triggerTTS();
            }
        }
    }), []);

    return (
        <div className="border border-gray-500 p-3 rounded bg-gray-800">
            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <p className="text-sm text-green-300">
                        <input
                            className="bg-gray-900 border border-gray-700 text-blue-300 px-2 py-1 rounded mr-2"
                            value={dialogue.speaker}
                            onChange={e => handleDialogueEdit(imageIdx, dialogueIdx, { speaker: e.target.value })}
                            disabled={isGenerating}
                        />
                        <textarea
                            ref={textareaRef}

                            className="bg-gray-900 border border-gray-700 text-green-300 px-2 py-1 rounded mr-2 w-72 overflow-hidden"
                            value={dialogue.text}
                            onChange={e => {
                                if (textareaRef.current) {
                                    textareaRef.current.style.height = "auto";
                                    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
                                }
                                handleDialogueEdit(imageIdx, dialogueIdx, { text: e.target.value });
                            }}
                            disabled={isGenerating}
                        />

                    </p>
                    {expanded && (
                        <div className="mt-2 text-sm text-gray-300 space-y-1">
                            <div><strong>ID:</strong> {dialogue.id}</div>
                            <div><strong>Gender:</strong>
                                <input
                                    className="bg-gray-900 border border-gray-700 text-blue-300 px-2 py-1 rounded mr-2"
                                    value={dialogue.gender}
                                    onChange={e => handleDialogueEdit(imageIdx, dialogueIdx, { gender: e.target.value })}
                                    disabled={isGenerating}
                                />
                            </div>
                            <div><strong>Emotion:</strong>
                                <input
                                    className="bg-gray-900 border border-gray-700 text-blue-300 px-2 py-1 rounded mr-2"
                                    value={dialogue.emotion}
                                    onChange={e => handleDialogueEdit(imageIdx, dialogueIdx, { emotion: e.target.value })}
                                    disabled={isGenerating}
                                />
                            </div>
                            <div><strong>Rel Path:</strong> {dialogue.image_rel_path_from_root}</div>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => handleDialogueDelete(imageIdx, dialogueIdx)}
                    className="ml-2 px-2 py-1 bg-gray-400 text-white rounded hover:bg-red-800 transition"
                    disabled={isGenerating}
                >
                    🗑️
                </button>

                <button
                    onClick={toggleExpanded}
                    className="text-xs px-2 py-1 bg-blue-600 rounded hover:bg-blue-700 text-white ml-2"
                >
                    {expanded ? 'Hide Info' : 'Show Info'}
                </button>
                <div className="ml-6 w-96">
                    <TtsLine
                        ref={ttsLineRef}
                        run_id={run_id}
                        dialogue={dialogue}
                        speakerId={dialogue.speaker}
                        isGenerating={isGenerating}
                        setIsGenerating={setIsGenerating}
                    />
                </div>
            </div>
        </div>
    );
});

export default DialogueLine;
