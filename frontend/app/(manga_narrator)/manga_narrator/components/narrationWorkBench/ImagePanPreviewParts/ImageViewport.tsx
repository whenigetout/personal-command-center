import { Point, Size, Frame } from "../../../types/geometry"

export interface ImageViewportProps {
    framSize: Size
    imgUrl: string
    imgSize: Size
    imgScale: number
    frame: Frame
    sideMargin?: number
}

export const ImageViewport = ({
    framSize,
    imgUrl,
    imgSize,
    imgScale = 1,
    frame,
    sideMargin = 0
}: ImageViewportProps) => {

    const bgImg = `url(${imgUrl})`
    const bgRepeat = "no-repeat"
    const bgSize = `${imgSize.w * imgScale}px ${imgSize.h * imgScale}px`
    const bgPos = `${frame.p1.x}px -${frame.p1.y}px`

    return (
        <div
            style={{ width: framSize.w + 2 * sideMargin, height: framSize.h }}
            className="rounded-lg overflow-hidden border-red-400"
        >
            <div
                className="w-full h-full"
                style={{
                    backgroundImage: bgImg,
                    backgroundRepeat: bgRepeat,
                    backgroundSize: bgSize,
                    backgroundPosition: bgPos,
                }}
            />
        </div>
    )
}
