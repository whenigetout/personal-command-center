import { useEffect, useState } from 'react'

export interface DirListing<TFile> {
    folders: string[]
    files: TFile[]
}

export function useDirectoryBrowser<TFile>(
    fetchDir: (path: string) => Promise<DirListing<TFile>>
) {
    const [pathHistory, setPathHistory] = useState<string[]>([])
    const [currentPath, setCurrentPath] = useState<string>('')
    const [dirData, setDirData] = useState<DirListing<TFile> | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    function goIntoFolder(folder: string) {
        const next = [...pathHistory, folder]
        setPathHistory(next)
        setCurrentPath(next.join('/'))
    }

    function goBack() {
        if (pathHistory.length === 0) return
        const next = pathHistory.slice(0, -1)
        setPathHistory(next)
        setCurrentPath(next.join('/'))
    }

    useEffect(() => {
        setLoading(true)
        setError(null)

        fetchDir(currentPath)
            .then(setDirData)
            .catch(err => {
                console.error(err)
                setError('Failed to load directory')
                setDirData(null)
            })
            .finally(() => setLoading(false))
    }, [currentPath])

    return {
        currentPath,
        pathHistory,
        dirData,
        loading,
        error,
        goIntoFolder,
        goBack
    }
}
