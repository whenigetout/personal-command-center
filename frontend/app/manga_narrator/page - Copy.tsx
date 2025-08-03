'use client'

import React, { useEffect, useState } from 'react'
import OcrPreview from './components/OcrPreview'

interface DirResult {
    folders: string[]
    images: string[]
}

interface OcrFileMeta {
    path: string;
    count: number;
}

interface OutputDirResult {
    folders: string[];
    files: string[];
}

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API as string
const OCR_API = process.env.NEXT_PUBLIC_OCR_API as string
console.log('OCR_API is', OCR_API)

const IMAGE_ROOT = process.env.NEXT_PUBLIC_IMAGE_ROOT as string
const WSL_BASE = process.env.NEXT_PUBLIC_WSL_BASE as string

// === Path Constants ===
const INPUT_ROOT = process.env.NEXT_PUBLIC_INPUT_ROOT || 'inputs'
const OUTPUT_ROOT = process.env.NEXT_PUBLIC_OUTPUT_ROOT || 'outputs'

export default function MangaNarratorPage() {
    const [pathHistory, setPathHistory] = useState<string[]>([])
    const [relativeInputPath, setCurrentPath] = useState<string>('')  // ← root = '', not 'inputs'


    const [dirData, setDirData] = useState<DirResult>({ folders: [], images: [] })
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [ocrStatus, setOcrStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle')
    const [ocrOutput, setOcrOutput] = useState<any[] | null>(null)
    const [fullOcrData, setFullOcrData] = useState<any[] | null>(null)
    const [ocrFiles, setOcrFiles] = useState<OcrFileMeta[]>([])
    const [selectedOcrPath, setSelectedOcrPath] = useState<string | null>(null)
    const [selectedOcrData, setSelectedOcrData] = useState<any[] | null>(null)
    const [outputPath, setOutputPath] = useState<string>('')  // relative path under outputs
    const [outputTree, setOutputTree] = useState<OutputDirResult>({ folders: [], files: [] })
    const [outputPathHistory, setOutputPathHistory] = useState<string[]>([])

    function getInputPath(subpath: string = ''): string {
        return `${INPUT_ROOT}${subpath ? '/' + subpath : ''}`
    }

    function currentInputPath(): string {
        return getInputPath(relativeInputPath)
    }

    function currentOutputPath(): string {
        return outputPath  // already relative to OUTPUT_ROOT
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

    useEffect(() => {
        if (outputPath !== '') {
            fetch(`${BACKEND_API}/api/manga/output_dir/?path=${outputPath}`)
                .then(res => res.json())
                .then((data: OutputDirResult) => setOutputTree(data))
                .catch(err => console.error('Failed to fetch output dir:', err))
        }
    }, [outputPath])

    function goIntoFolder(folder: string) {
        const newHistory = [...pathHistory, folder]
        const newPath = newHistory.join('/')

        setPathHistory(newHistory)
        setCurrentPath(newPath)
    }

    function goBack() {
        if (pathHistory.length === 0) return
        const newHistory = [...pathHistory]
        newHistory.pop()
        setPathHistory(newHistory)
        const newPath = newHistory.length > 0 ? newHistory.join('/') : ''
        setCurrentPath(newPath)
    }

    async function triggerOcr() {
        setOcrStatus('processing')
        setOcrOutput(null)

        try {
            const formData = new FormData()
            formData.append('input_path', `${WSL_BASE}/${getInputPath(relativeInputPath)}`)

            const response = await fetch(`${OCR_API}/ocr/folder`, {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) throw new Error('HTTP Error')

            const data = await response.json()
            if (data.status === 'success') {
                console.log('OCR result:', data)
                setOcrOutput([{ run_id: data.run_id }])  // assuming it's a list of OCR lines
                setOcrStatus('done')
            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            console.error('OCR failed:', err)
            setOcrStatus('error')
        }
    }
    async function loadFullOcrResult() {
        const runId = ocrOutput?.[0]?.run_id
        if (!runId) return

        try {
            const response = await fetch(`${BACKEND_API}/api/manga/output_dir/?path=${runId}`)
            if (!response.ok) throw new Error("Failed to load OCR output folder tree")

            const data: OutputDirResult = await response.json()

            setOutputPath(runId)
            setOutputPathHistory([runId])
            setOutputTree(data)  // ✅ this populates folders/files
        } catch (err) {
            console.error("Error loading OCR output tree:", err)
        }
    }


    async function loadOcrFile(path: string) {
        try {
            console.log("inside loadocr----------------")

            const response = await fetch(`${BACKEND_API}/api/manga/json_file/?path=${encodeURIComponent(path)}`)

            if (!response.ok) throw new Error("Failed to load selected OCR JSON")

            const data = await response.json()
            setSelectedOcrPath(path)
            const validData = Array.isArray(data) ? data : data?.results || []
            setSelectedOcrData(validData)

            console.log("loadocr log----------------")
            console.log(data)
        } catch (err) {
            console.error("Error loading OCR file from Django API:", err)
            setSelectedOcrData([{ error: "Failed to load result" }])
        }
    }

    const handleManualOcrJsonLoad = async () => {
        const relPath = prompt("Enter OCR JSON path (relative to outputs/):");
        if (!relPath) return;

        try {
            const response = await fetch(
                `${BACKEND_API}/api/manga/json_file/?path=${encodeURIComponent(relPath)}`
            );

            if (!response.ok) throw new Error("Failed to load JSON file");
            const json = await response.json();
            console.log("OCR JSON fetched manually:", json);

            // FIX: pull results if they exist
            const validData = Array.isArray(json) ? json : json?.results || [];

            setSelectedOcrPath(relPath);
            setSelectedOcrData(validData);
        } catch (error) {
            console.error("Error loading OCR file:", error);
            alert("Failed to load OCR file");
        }
    }

    const handleOcrFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const parsed = JSON.parse(text);
            const validData = Array.isArray(parsed) ? parsed : parsed?.results || [];

            setSelectedOcrPath(file.name);
            setSelectedOcrData(validData);
        } catch (err) {
            console.error("Failed to parse uploaded OCR JSON:", err);
            alert("Invalid or unreadable OCR file.");
        }
    };


    function goIntoOutputFolder(folder: string) {
        const newHistory = [...outputPathHistory, folder]
        setOutputPathHistory(newHistory)
        setOutputPath(newHistory.join('/'))
    }

    function goBackOutputFolder() {
        const newHistory = [...outputPathHistory]
        newHistory.pop()
        setOutputPathHistory(newHistory)
        setOutputPath(newHistory.join('/'))
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">📚 Manga Narrator: Load Chapter</h1>
            <p className="mb-2 text-sm text-gray-400">📂 Current folder: <code>{getInputPath(relativeInputPath)}</code></p>

            {pathHistory.length > 0 && (
                <button
                    onClick={goBack}
                    className="mb-4 text-blue-600 underline"
                >
                    ← Back to {pathHistory[pathHistory.length - 2] || 'root'}
                </button>
            )}


            <div className="mb-4">
                <button
                    onClick={triggerOcr}
                    className="bg-purple-600 text-white px-4 py-2 rounded mr-4"
                >
                    {ocrStatus === 'processing' ? 'Running OCR...' : '🔍 Run OCR on this folder'}
                </button>
                {ocrStatus === 'done' && <span className="text-green-600">✔ OCR completed</span>}
                <button
                    onClick={loadFullOcrResult}
                    className="bg-blue-600 text-white px-3 py-1 rounded ml-2"
                >
                    📥 Load OCR result
                </button>
                <button
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={handleManualOcrJsonLoad}
                >
                    📂 Load OCR JSON file
                </button>
                <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    id="ocr-upload"
                    onChange={handleOcrFileUpload}
                />

                <label
                    htmlFor="ocr-upload"
                    className="cursor-pointer bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-2 px-4 rounded ml-2"
                >
                    🗂 Upload Local OCR JSON
                </label>


                {ocrStatus === 'error' && <span className="text-red-600">✖ OCR failed</span>}
            </div>


            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h2 className="text-lg font-semibold">📁 Folders</h2>
                    <ul className="border p-2 h-64 overflow-y-auto">
                        {(dirData?.folders || []).map(folder => {
                            if (relativeInputPath === '' && folder === OUTPUT_ROOT) return null  // 👈 hide outputs at root
                            return (
                                <li key={folder}>
                                    <button
                                        onClick={() => goIntoFolder(folder)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {folder}
                                    </button>
                                </li>
                            )
                        })}

                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-semibold">🖼️ Images</h2>
                    <ul className="border p-2 h-64 overflow-y-auto">
                        {(dirData?.images || []).map(image => (
                            <li key={image}>
                                <button onClick={() => setSelectedImage(image)}>
                                    {image}
                                </button>
                            </li>
                        ))}

                    </ul>
                </div>
            </div>

            <div className="mt-10 border-t pt-6">
                <h2 className="text-xl font-semibold">🗂 OCR Output Tree</h2>

                {outputPathHistory.length > 0 && (
                    <button
                        onClick={goBackOutputFolder}
                        className="mb-2 text-blue-600 underline"
                    >
                        ← Back to {outputPathHistory[outputPathHistory.length - 2] || 'root'}
                    </button>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-md font-semibold">📁 Folders</h3>
                        <ul className="border p-2 h-64 overflow-y-auto text-sm">
                            {outputTree.folders.map(folder => (
                                <li key={folder}>
                                    <button
                                        onClick={() => goIntoOutputFolder(folder)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {folder}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-md font-semibold">📄 JSON Files</h3>
                        <ul className="border p-2 h-64 overflow-y-auto text-sm">
                            {outputTree.files.map(file => {
                                const fullPath = [...outputPathHistory, file].join('/')
                                return (
                                    <li key={file}>
                                        <button
                                            onClick={() => loadOcrFile(fullPath)}
                                            className="text-green-400 hover:underline"
                                        >
                                            {file}
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>


            {selectedImage && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold">📷 Preview: {selectedImage}</h2>
                    <img
                        src={`${IMAGE_ROOT}/${getInputPath(relativeInputPath)}/${selectedImage}`}
                        alt="preview"
                        className="max-w-full border mt-2"
                    />
                </div>
            )}

            {ocrOutput && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold">📄 OCR Output</h2>
                    <div className="bg-gray-800 text-gray-200 p-4 rounded text-sm">
                        <pre>{JSON.stringify(ocrOutput, null, 2)}</pre>
                    </div>
                </div>
            )}

            {ocrFiles.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold">📂 OCR Files</h2>
                    <ul className="border p-3 bg-gray-950 text-sm text-gray-200 rounded max-h-64 overflow-y-auto">
                        {ocrFiles.map(file => (
                            <li key={file.path} className="mb-1">
                                <button
                                    onClick={() => loadOcrFile(file.path)}
                                    className="hover:underline text-blue-400"
                                >
                                    {file.path} ({file.count})
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            {selectedOcrData && (
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-2">🧾 OCR Line Mapping Preview</h2>
                    <OcrPreview data={selectedOcrData} />
                </div>
            )}



            {fullOcrData && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold">🧾 Full OCR Parsed Result</h2>
                    <div className="bg-gray-900 text-gray-200 p-4 rounded text-sm max-h-96 overflow-y-scroll">
                        <pre>{JSON.stringify(fullOcrData, null, 2)}</pre>
                    </div>
                </div>
            )}


        </div>
    )
}
