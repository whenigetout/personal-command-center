import { useDirectoryBrowser } from "./hooks/useDirectoryBrowser"
import { fetchOutputDir } from "../server/fetchOutputDir"
import { FileEntry, MangaOutputDirResponse } from "../types/manga_narrator_django_api"
import InputPathBreadcrumb from "../components/ocr/InputPathBreadcrumb"
import FolderBrowser from "../components/ocr/input_section/FolderBrowser"

interface OCROutputSectionClientProps {
    onSelectJSONFile: (image: string) => void
}
const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API as string
const INPUT_ROOT = process.env.NEXT_PUBLIC_INPUT_ROOT || 'inputs'
const OUTPUT_ROOT = process.env.NEXT_PUBLIC_OUTPUT_ROOT || 'outputs'

export const OCROutputSectionClient = ({
    onSelectJSONFile
}: OCROutputSectionClientProps) => {

    const {
        currentPath,
        pathHistory,
        dirData,
        loading,
        error,
        goIntoFolder,
        goBack
    } = useDirectoryBrowser<FileEntry>(fetchOutputDir);

    const getInputPath = (sub = '') =>
        `${OUTPUT_ROOT}${sub ? '/' + sub : ''}`;


    // async function loadOcrJsonData(source: 'api' | 'upload', payload: string | File): Promise<void> {
    //     try {
    //         let validData: any[] = []
    //         let label = ''

    //         if (source === 'api') {
    //             const response = await fetch(`${BACKEND_API}/api/manga/json_file/?path=${encodeURIComponent(payload as string)}`)
    //             if (!response.ok) throw new Error('Failed to fetch OCR JSON from API')
    //             const json = await response.json()
    //             validData = Array.isArray(json) ? json : json?.results || []
    //             label = payload as string
    //         } else if (source === 'upload') {
    //             const file = payload as File
    //             const text = await file.text()
    //             const parsed = JSON.parse(text)
    //             validData = Array.isArray(parsed) ? parsed : parsed?.results || []
    //             label = file.name
    //             console.log("file")
    //             console.log(file)
    //         }

    //         setSelectedOcrPath(label)
    //         setSelectedOcrData(validData)
    //         console.log("-------data 'validData' from loadocrjsondata-----");
    //         console.log(validData);

    //     } catch (error) {
    //         console.error('Error loading OCR JSON:', error)
    //         alert('Failed to load or parse OCR JSON.')
    //         setSelectedOcrData([{ error: 'Failed to load result' }])
    //     }
    // }

    // async function loadOcrFile(path: string) {
    //     await loadOcrJsonData('api', path)
    // }

    return (
        <section>
            <InputPathBreadcrumb
                currentPath={getInputPath(currentPath)}
                canGoBack={pathHistory.length > 0}
                onBack={goBack}
            />

            {/* folder browser ui */}
            <FolderBrowser
                folderBrowserTitle="Output Folder"
                imageBrowserTitle="JSON Files"
                dirData={dirData}
                currentRelativePath={currentPath}
                forbidden={INPUT_ROOT}

                onEnterFolder={goIntoFolder}
                onSelectImage={onSelectJSONFile}
            />

        </section>
    )
}
