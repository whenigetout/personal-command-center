'use client'

import { useState, useEffect } from 'react'
import InputPathBreadcrumb from './InputPathBreadcrumb'
import RunOCRButton from './RunOCRButton'
import FolderBrowser from './input_section/FolderBrowser'
import { OCR_STATUS, OcrStatus } from '../../shared/status_enums'
import { DirResult } from '../../shared/shared_interfaces'

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API as string
const OCR_API = process.env.NEXT_PUBLIC_OCR_API as string
const WSL_BASE = process.env.NEXT_PUBLIC_WSL_BASE as string
const INPUT_ROOT = process.env.NEXT_PUBLIC_INPUT_ROOT || 'inputs'
const OUTPUT_ROOT = process.env.NEXT_PUBLIC_OUTPUT_ROOT || 'outputs'

interface OCRInputSectionProps {
    onOcrComplete: (runId: string) => void
    onSelectImage: (image: string) => void
}

const OCRInputSection = ({
    onOcrComplete,
    onSelectImage
}: OCRInputSectionProps) => {
    const [relativeInputPath, setRelativeInputPath] = useState<string>('')
    const [pathHistory, setPathHistory] = useState<string[]>([])
    const [ocrStatus, setOcrStatus] =
        useState<OcrStatus>(OCR_STATUS.IDLE)
    const [dirData, setDirData] = useState<DirResult>({ folders: [], images: [] })

    const getInputPath = (sub = '') =>
        `${INPUT_ROOT}${sub ? '/' + sub : ''}`

    const goBack = () => {
        if (pathHistory.length === 0) return
        const next = pathHistory.slice(0, -1)
        setPathHistory(next)
        setRelativeInputPath(next.join('/'))
    }

    const triggerOcr = async () => {
        setOcrStatus(OCR_STATUS.PROCESSING)

        try {
            const formData = new FormData()
            formData.append(
                'input_path',
                `${WSL_BASE}/${getInputPath(relativeInputPath)}`
            )

            const res = await fetch(`${OCR_API}/ocr/folder`, {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('OCR failed')

            const data = await res.json()
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

        setPathHistory(newHistory)
        setRelativeInputPath(newPath)
    }

    useEffect(() => {
        fetch(`${BACKEND_API}/api/manga/dir/?path=${relativeInputPath}`)
            .then(res => {
                if (!res.ok) throw new Error('Bad response')
                return res.json()
            })
            .then((data: DirResult) => setDirData(data))
            .catch(err => {
                console.error('Failed to fetch dir:', err)
                setDirData({ folders: [], images: [] })  // fallback
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

export default OCRInputSection
