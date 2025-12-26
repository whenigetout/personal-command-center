import { MangaDirResponse, ImageEntry } from "@/app/manga_narrator/types/manga_narrator_django_api"

interface FolderBrowserProps {
    dirData: MangaDirResponse | null
    currentRelativePath: string
    OUTPUT_ROOT: string

    onEnterFolder: (folder: string) => void
    onSelectImage: (image: string) => void
}

const FolderBrowser = ({
    dirData,
    currentRelativePath,
    OUTPUT_ROOT,

    onEnterFolder,
    onSelectImage

}: FolderBrowserProps
) => {

    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <h2 className="text-lg font-semibold">📁 Folders Component</h2>
                <ul className="border p-2 h-64 overflow-y-auto">
                    {(dirData?.folders || []).map(folder => {
                        if (currentRelativePath === '' && folder === OUTPUT_ROOT) return null  // 👈 hide outputs at root
                        return (
                            <li key={folder}>
                                <button
                                    onClick={() => onEnterFolder(folder)}
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
                        <li key={image.name}>
                            <button onClick={() => onSelectImage(
                                image.relative_path
                            )}>
                                {image.name}
                            </button>
                        </li>
                    ))}

                </ul>
            </div>
        </div>
    )
}

export default FolderBrowser