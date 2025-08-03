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
    return (
        <div className="space-y-6">
            {data.map(group => (
                <ImagePanel key={group.image_id} group={group} />
            ))}
        </div>
    )
}
