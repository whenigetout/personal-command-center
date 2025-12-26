'use client'

import { useState, useEffect } from 'react'
import InputPathBreadcrumb from '../components/ocr/InputPathBreadcrumb'
import RunOCRButton from '../components/ocr/RunOCRButton'
import FolderBrowser from '../components/ocr/input_section/FolderBrowser'
import { OCR_STATUS, OcrStatus } from '../shared/status_enums'
import { MangaDirResponse } from '../types/manga_narrator_django_api'
import { callOCRapi } from '../server/callOCRapi'
import { fetchDir } from '../server/fetchDir'

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API as string
const OCR_API = process.env.NEXT_PUBLIC_OCR_API as string
const WSL_BASE = process.env.NEXT_PUBLIC_WSL_BASE as string
const INPUT_ROOT = process.env.NEXT_PUBLIC_INPUT_ROOT || 'inputs'
const OUTPUT_ROOT = process.env.NEXT_PUBLIC_OUTPUT_ROOT || 'outputs'

interface OCRInputSectionClientProps {
    onOcrComplete: (runId: string) => void
    onSelectImage: (image: string) => void
}

const OCRInputSectionClient = ({
    onOcrComplete,
    onSelectImage
}: OCRInputSectionClientProps) => {
    const [relativeInputPath, setRelativeInputPath] = useState<string>('')
    const [pathHistory, setPathHistory] = useState<string[]>([])
    const [ocrStatus, setOcrStatus] =
        useState<OcrStatus>(OCR_STATUS.IDLE)
    const [dirData, setDirData] = useState<MangaDirResponse | null>(null)

    const getInputPath = (sub = '') =>
        `${INPUT_ROOT}${sub ? '/' + sub : ''}`

    const goBack = () => {
        if (pathHistory.length === 0) return
        const next = pathHistory.slice(0, -1)
        setPathHistory(next)
        setRelativeInputPath(next.join('/'))
        //clear image selection
        onSelectImage('');
    }

    const triggerOcr = async () => {
        setOcrStatus(OCR_STATUS.PROCESSING)

        try {
            const formData = new FormData()
            formData.append(
                'input_path',
                `${WSL_BASE}/${getInputPath(relativeInputPath)}`
            )

            const data = await callOCRapi(formData);
            onOcrComplete(data.run_id)
            setOcrStatus(OCR_STATUS.DONE)
        } catch (err) {
            console.error(err)
            setOcrStatus(OCR_STATUS.ERROR)
        }
    }

    const goIntoFolder = (folder: string) => {
        const newHistory = [...pathHistory, folder]
        const newPath = newHistory.join('/')

        setPathHistory(newHistory);
        setRelativeInputPath(newPath);
        //clear image selection 
        onSelectImage("");
    }

    useEffect(() => {
        fetchDir(relativeInputPath)
            .then(data => setDirData(data))
            .catch(err => {
                console.error("Failed to load dir:", err)
                setDirData(null) // fallback
            })
    }, [relativeInputPath])

    return (
        <section>
            <InputPathBreadcrumb
                currentPath={getInputPath(relativeInputPath)}
                canGoBack={pathHistory.length > 0}
                onBack={goBack}
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
                dirData={dirData}
                currentRelativePath={relativeInputPath}
                OUTPUT_ROOT={OUTPUT_ROOT}

                onEnterFolder={goIntoFolder}
                onSelectImage={onSelectImage}
            />

        </section>

    )
}

export default OCRInputSectionClient
