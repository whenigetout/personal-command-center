'use client'

import { useState, useEffect } from 'react'
import InputPathBreadcrumb from '../components/ocr/InputPathBreadcrumb'
import RunOCRButton from '../components/ocr/RunOCRButton'
import FolderBrowser from '../components/ocr/input_section/FolderBrowser'
import { OCR_STATUS, OcrStatus } from '../shared/status_enums'
import { callOCRapi } from '../server/callOCRapi'
import { useDirectoryBrowser } from './hooks/useDirectoryBrowser'
import { ImageEntry } from '../types/manga_narrator_django_api'
import { fetchInputDir } from '../server/fetchInputDir'
import { constructFolderPath } from '../utils/helpers'

const WSL_BASE = process.env.NEXT_PUBLIC_WSL_BASE as string
const INPUT_ROOT = process.env.NEXT_PUBLIC_INPUT_ROOT || 'inputs'
const OUTPUT_ROOT = process.env.NEXT_PUBLIC_OUTPUT_ROOT || 'outputs'

interface OCRInputSectionClientProps {
    onSelectImage: (image: string) => void
}

const OCRInputSectionClient = ({
    onSelectImage
}: OCRInputSectionClientProps) => {
    const {
        currentPath,
        pathHistory,
        dirData,
        loading,
        error,
        goIntoFolder,
        goBack
    } = useDirectoryBrowser<ImageEntry>(fetchInputDir);

    const [ocrStatus, setOcrStatus] = useState<OcrStatus>(OCR_STATUS.IDLE);

    const triggerOcr = async () => {
        setOcrStatus(OCR_STATUS.PROCESSING)

        try {
            const formData = new FormData()
            formData.append(
                'input_path',
                `${WSL_BASE}/${constructFolderPath(INPUT_ROOT, currentPath)}`
            )

            const data = await callOCRapi(formData);
            setOcrStatus(OCR_STATUS.DONE)
        } catch (err) {
            console.error(err)
            setOcrStatus(OCR_STATUS.ERROR)
        }
    }

    return (
        <section>
            <InputPathBreadcrumb
                currentPath={constructFolderPath(INPUT_ROOT, currentPath)}
                canGoBack={pathHistory.length > 0}
                onBack={() => {
                    goBack();
                    onSelectImage('');
                }}

            />

            <RunOCRButton status={ocrStatus} onRun={triggerOcr} />

            {ocrStatus === 'done' && (
                <span className="text-green-600 ml-2">✔ OCR completed</span>
            )}
            {ocrStatus === 'error' && (
                <span className="text-red-600 ml-2">✖ OCR failed</span>
            )}

            {/* folder browser ui */}
            <FolderBrowser
                folderBrowserTitle="Input Folders"
                imageBrowserTitle="Images"
                dirData={dirData}
                currentRelativePath={currentPath}
                forbidden={OUTPUT_ROOT}

                onEnterFolder={goIntoFolder}
                onSelectImage={onSelectImage}
            />

        </section>

    )
}

export default OCRInputSectionClient
