'use client'

import { useState } from 'react'
import VideoPreviewClient from './client/VideoPreviewClient'
import OCRInputSectionClient from './client/OCRInputSectionClient'
import { OCROutputSectionClient } from './client/OCROutputSectionClient'
import { constructFolderPath } from './utils/helpers'
import { NarrationWorkbenchClient } from './client/NarrationWorkbenchClient'

// === Path Constants ===
const IMAGE_ROOT = process.env.NEXT_PUBLIC_IMAGE_ROOT as string
const INPUT_ROOT = process.env.NEXT_PUBLIC_INPUT_ROOT || 'inputs'

export default function MangaNarratorPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [selectedOcrJson, setSelectedOcrJson] = useState<string | null>(null)

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">📚 Manga Narrator: Load Chapter</h1>

            <OCRInputSectionClient
                onSelectImage={setSelectedImage}
            />
            <OCROutputSectionClient
            />

            <NarrationWorkbenchClient
                selectedOcrJson={selectedOcrJson}
            />

            <VideoPreviewClient
            />

            {selectedImage && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold">
                        📷 Preview: {selectedImage}
                    </h2>

                    <img
                        src={`${IMAGE_ROOT}/${constructFolderPath(INPUT_ROOT)}/${selectedImage}`}
                        alt="preview"
                        className="max-w-full border mt-2"
                        onError={(e) => {
                            e.currentTarget.style.display = "none"
                        }}
                    />
                </div>
            )}

        </div>
    )
}
