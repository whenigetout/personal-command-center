import { MediaRef, mediaBasename } from "@/app/manga_narrator/types/manga_narrator_django_api_types"
import { BrowserState } from "../../types/BrowserState"
interface FolderBrowserProps {
    folderBrowserTitle: string
    imageBrowserTitle: string
    browserState: BrowserState

    onEnterFolder: (folder: MediaRef) => void
    onSelectImage: (image: MediaRef) => void
}

const FolderBrowser = ({
    folderBrowserTitle,
    imageBrowserTitle,
    browserState,

    onEnterFolder,
    onSelectImage

}: FolderBrowserProps
) => {

    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <h2 className="text-lg font-semibold">📁 {folderBrowserTitle}</h2>
                <ul className="border p-2 h-64 overflow-y-auto">
                    {(browserState.currentDirContents?.folders ?? []).map(folder => {

                        return (
                            <li key={folder.path}>
                                <button
                                    onClick={() => onEnterFolder(folder)}
                                    className="text-blue-500 hover:underline"
                                >
                                    {mediaBasename(folder)}
                                </button>
                            </li>
                        )
                    })}

                </ul>
            </div>

            <div>
                <h2 className="text-lg font-semibold">🖼️ {imageBrowserTitle}</h2>
                <ul className="border p-2 h-64 overflow-y-auto">
                    {(browserState.currentDirContents?.files ?? []).map(file => (
                        <li key={file.path}>
                            <button onClick={() => onSelectImage(file)}>
                                {mediaBasename(file)}
                            </button>
                        </li>
                    ))}

                </ul>
            </div>
        </div>
    )
}

export default FolderBrowser