interface DialoguePreview {
    dialogue_id: number
    dialogue_text: string
    crop_box: [number, number, number, number]
}

interface ImagePreview {
    image_rel_path_from_root: string
    image_file_name: string
    previews: DialoguePreview[]
}

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API as string
const IMAGE_ROOT_INPUTS = process.env.NEXT_PUBLIC_IMAGE_ROOT_INPUTS as string

function PanPreview({ image, preview }: {
    image: ImagePreview
    preview: DialoguePreview
}) {

    const [x1, y1, x2, y2] = preview.crop_box
    const viewportHeight = y2 - y1

    const imgUrl = `${IMAGE_ROOT_INPUTS}/${image.image_rel_path_from_root}/${image.image_file_name}`

    return (
        <div className="border rounded mb-4 p-2 bg-black">
            <div className="text-sm text-gray-300 mb-1">
                #{preview.dialogue_id}: {preview.dialogue_text}
            </div>

            <div
                style={{
                    width: x2 - x1,
                    height: viewportHeight,
                    overflow: "hidden",
                    position: "relative",
                    border: "1px solid #444",
                }}
            >
                <img
                    src={imgUrl}
                    style={{
                        position: "absolute",
                        top: -y1,   // 👈 THIS IS THE PAN
                        left: 0,
                        width: "100%",
                        height: "auto",
                    }}
                />
            </div>
        </div>
    )
}

export default PanPreview;