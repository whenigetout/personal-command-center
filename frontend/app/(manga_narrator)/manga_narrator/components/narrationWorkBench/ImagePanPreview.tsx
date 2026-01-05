import { PaddleOCRImage, PaddleBBox } from "../../types/manga_narrator_django_api_types"
import { MediaRef } from "../../types/manga_narrator_django_api_types"

const MEDIA_ROOT = process.env.NEXT_PUBLIC_MEDIA_ROOT as string

interface ImagePanPreviewProps {
    image: PaddleOCRImage
    activeDlgIdx: number
    onChangeDlg: (idx: number) => void
}

const FRAME_W = 1080
const FRAME_H = 1920

export const ImagePanPreview = ({
    image,
    activeDlgIdx,
}: ImagePanPreviewProps) => {

    const dlg = image.parsedDialogueLines[activeDlgIdx]
    const bbox: PaddleBBox | null = dlg?.paddlebbox ?? null
    const resize = image.paddleResizeInfo

    if (!bbox || !resize) {
        return (
            <div className="w-[420px] aspect-video bg-black rounded flex items-center justify-center text-zinc-500 text-xs">
                No preview
            </div>
        )
    }

    // 1️⃣ Map bbox from Paddle-resized → original image space
    const x1 = bbox.x1 / resize.ratio_w
    const y1 = bbox.y1 / resize.ratio_h
    const x2 = bbox.x2 / resize.ratio_w
    const y2 = bbox.y2 / resize.ratio_h

    // 2️⃣ Compute bbox center in original image space
    const centerX = (x1 + x2) / 2
    const centerY = (y1 + y2) / 2

    // 3️⃣ Pan original image so bbox center aligns with frame center
    const tx = FRAME_W / 2 - centerX
    const ty = FRAME_H / 2 - centerY

    const imgRef: MediaRef = image.inferImageRes.image_ref

    return (
        <div className="w-[420px]">
            <div className="aspect-video bg-black rounded overflow-hidden relative">
                <img
                    src={`${MEDIA_ROOT}/${imgRef.namespace}/${imgRef.path}`}
                    className="absolute top-0 left-0 will-change-transform transition-transform duration-300"
                    style={{
                        transform: `translate(${tx}px, ${ty}px)`
                    }}
                    draggable={false}
                />
            </div>
        </div>
    )
}
