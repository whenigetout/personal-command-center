import { useDirectoryBrowser } from "./hooks/useDirectoryBrowser"
import { fetchOutputDir } from "../server/fetchOutputDir"
import { FileEntry } from "../types/manga_narrator_django_api_types"
import InputPathBreadcrumb from "../components/ocr/InputPathBreadcrumb"
import FolderBrowser from "../components/ocr/input_section/FolderBrowser"
import { constructFolderPath } from "../utils/helpers"

interface OCROutputSectionClientProps {
    onSelectJson: (path: string) => void
}
const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API as string
const INPUT_ROOT = process.env.NEXT_PUBLIC_INPUT_ROOT || 'inputs'
const OUTPUT_ROOT = process.env.NEXT_PUBLIC_OUTPUT_ROOT || 'outputs'

export const OCROutputSectionClient = ({
    onSelectJson
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

    return (
        <section>
            <InputPathBreadcrumb
                currentPath={constructFolderPath(OUTPUT_ROOT, currentPath)}
                canGoBack={pathHistory.length > 0}
                onBack={() => {
                    goBack();
                    onSelectJson('');
                }}
            />

            {/* folder browser ui */}
            <FolderBrowser
                folderBrowserTitle="Output Folder"
                imageBrowserTitle="JSON Files"
                dirData={dirData}
                currentRelativePath={currentPath}
                forbidden={INPUT_ROOT}

                onEnterFolder={goIntoFolder}
                onSelectImage={onSelectJson}
            />

        </section>
    )
}
