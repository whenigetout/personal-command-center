'use client'

import { useState } from 'react'
import VideoPreviewClient from './client/VideoPreviewClient'
import OCRInputSectionClient from './client/OCRInputSectionClient'
import { OCROutputSectionClient } from './client/OCROutputSectionClient'
import { constructFolderPath } from './utils/helpers'
import { NarrationWorkbenchClient } from './client/NarrationWorkbenchClient'
import { TestPageLink } from './dev/components/TestPageLink'
import { useOcrJson } from './client/hooks/useOcrJson'

// === Path Constants ===
const IMAGE_ROOT = process.env.NEXT_PUBLIC_IMAGE_ROOT as string
const INPUT_ROOT = process.env.NEXT_PUBLIC_INPUT_ROOT || 'inputs'

export default function MangaNarratorPage() {
    const [selectedImagePath, setSelectedImagePath] = useState<string | null>(null)
    const [selectedOcrJsonPath, setSelectedOcrJsonPath] = useState<string | null>(null)

    const {
        data: ocrJsonData,
        dispatchEdit,
        loading,
        error
    } = useOcrJson(selectedOcrJsonPath)

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">📚 Manga Narrator: Load Chapter</h1>
            <TestPageLink />

            <OCRInputSectionClient
                onSelectImage={setSelectedImagePath}
            />
            <OCROutputSectionClient
                onSelectJson={setSelectedOcrJsonPath}
            />

            {ocrJsonData && <NarrationWorkbenchClient
                ocrJsonData={ocrJsonData}
                dispatchEdit={dispatchEdit}
            />}

            <VideoPreviewClient
            />

            {selectedImagePath && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold">
                        📷 Preview: {selectedImagePath}
                    </h2>

                    <img
                        src={`${IMAGE_ROOT}/${constructFolderPath(INPUT_ROOT)}/${selectedImagePath}`}
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
