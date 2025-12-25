interface InputPathBreadcrumbProps {
    currentPath: string
    canGoBack: boolean
    onBack: () => void
}

const InputPathBreadcrumb = ({
    currentPath,
    canGoBack,
    onBack,
}: InputPathBreadcrumbProps) => {
    return (
        <div className="mb-3">
            <p className="text-sm text-gray-400">
                📂 Current folder: <code>{currentPath}</code>
            </p>

            {canGoBack && (
                <button
                    onClick={onBack}
                    className="text-blue-600 underline mt-1"
                >
                    ← Back
                </button>
            )}
        </div>
    )
}

export default InputPathBreadcrumb
