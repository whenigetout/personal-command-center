'use client'

import { useState } from 'react'
import VideoPreviewClient from './client/VideoPreviewClient'
import OCRInputSectionClient from './client/OCRInputSectionClient'
import { OCROutputSectionClient } from './client/OCROutputSectionClient'
import { constructFolderPath } from './utils/helpers'
import { NarrationWorkbenchClient } from './client/NarrationWorkbenchClient'
import { TestPageLink } from './dev/components/TestPageLink'
import { useOcrJson } from './client/hooks/useOcrJson'
import { MediaRef, mediaBasename } from './types/manga_narrator_django_api_types'
import { Emotion } from './types/tts_api_types'

// === Path Constants ===
const MEDIA_ROOT = process.env.NEXT_PUBLIC_MEDIA_ROOT as string

export default function MangaNarratorPage() {
    const [selectedImage, setSelectedImage] = useState<MediaRef | null>(null)
    const [selectedOcrJson, setSelectedOcrJson] = useState<MediaRef | null>(null)

    const {
        data: ocrJsonData,
        emotionOptions,
        dispatchEdit,
        loading,
        error
    } = useOcrJson(selectedOcrJson)

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">📚 Manga Narrator: Load Chapter</h1>
            <TestPageLink />

            <OCRInputSectionClient
                onSelectImage={setSelectedImage}
            />
            <OCROutputSectionClient
                onSelectJson={setSelectedOcrJson}
            />

            {ocrJsonData && <NarrationWorkbenchClient
                ocrJsonData={ocrJsonData}
                emotionOptions={emotionOptions}
                dispatchEdit={dispatchEdit}
            />}

            {/* 
            <VideoPreviewClient
            /> */}

            {selectedImage && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold">
                        📷 Preview: {mediaBasename(selectedImage)}
                    </h2>

                    <img
                        src={`${MEDIA_ROOT}/${selectedImage.namespace}/${selectedImage.path}`}
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
