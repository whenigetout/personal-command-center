import { PaddleOCRImage, PaddleBBox, PaddleResizeInfo } from "../../types/manga_narrator_django_api_types"
import { MediaRef } from "../../types/manga_narrator_django_api_types"
import { useState, useEffect } from "react"
import { ImageViewport, ImageViewportProps } from "./ImagePanPreviewParts/ImageViewport"
import { Point, Size, Frame, BBox } from "../../types/geometry"
import { DebugControls } from "./ImagePanPreviewParts/DebugControls"
import { EditAction } from "../../types/EditActionType"

const MEDIA_ROOT = process.env.NEXT_PUBLIC_MEDIA_ROOT as string

interface ImagePanPreviewProps {
    image: PaddleOCRImage
    imageIdx: number
    activeDlgIdx: number
    onChangeDlg: (idx: number) => void
    dispatchEdit: (action: EditAction) => void
    saveJson: () => void
}

export function ImagePanPreview({ image, imageIdx, activeDlgIdx, onChangeDlg, dispatchEdit, saveJson }: ImagePanPreviewProps) {

    const dlg = image.parsedDialogueLines[activeDlgIdx]
    const bbox = dlg?.paddlebbox
    const resize = image.paddleResizeInfo
    const scaleToOriginal: Size = {
        w: resize.resized_w / resize.original_w,
        h: resize.resized_h / resize.original_h
    }
    const bboxScaledToOriginal: BBox = {
        x1: bbox.x1 * scaleToOriginal.w,
        y1: bbox.y1 * scaleToOriginal.h,
        x2: bbox.x2 * scaleToOriginal.w,
        y2: bbox.y2 * scaleToOriginal.h
    }
    const imgOriginalSize: Size = {
        w: resize.original_w,
        h: resize.original_h
    }

    const imgRef = image.inferImageRes.image_ref
    const imgUrl = `${MEDIA_ROOT}/${imgRef.namespace}/${imgRef.path}`

    const ASPECT_RATIO = (1080 / 1920)

    // check if the bbox fits 
    // const doesBBoxFit = () => {
    //     // no need to check if it horizontally fits cause everything is calculated assuming it the image is scaled to horizontally fit
    //     return (
    //         bboxOriginalSize.y1 * imgScaleFactorOriginalToFrame >= currFrameY1Offset
    //         &&
    //         bboxOriginalSize.y2 * imgScaleFactorOriginalToFrame <= currFrameY1Offset + frameSize.h
    //     )
    // }

    const calcFrame_size = (width: number, sideMargin: number, aspectRatio: number) => ({
        w: width - 2 * sideMargin,
        h: width / aspectRatio,
    })

    // 1️⃣ Source state
    const [frameWidth, setFrameWidth] = useState(480);
    const [frameSideMargin, setFrameSideMargin] = useState(0);
    const [frameTopPadding, setFrameTopPadding] = useState(10);
    const [frameY1Offset, setFrameY1Offset] = useState(0);
    const [original, setOriginal] = useState<boolean>(false);

    // 2️⃣ Derived values (NO state, NO effect)
    const FRAME_SIZE = calcFrame_size(frameWidth, frameSideMargin, ASPECT_RATIO);
    const imgScale = FRAME_SIZE.w / resize.original_w;

    // 3️⃣ Derived frame position
    const baseOffsetY =
        bboxScaledToOriginal.y1 * imgScale - frameTopPadding;

    const finalOffsetY = baseOffsetY + frameY1Offset;

    const frame: Frame = {
        p1: { x: 0, y: finalOffsetY },
        p2: { x: FRAME_SIZE.w, y: finalOffsetY + FRAME_SIZE.h },
    };

    // for debugging
    const imgViewPortProps: ImageViewportProps = {
        imgUrl: imgUrl,
        imgSize: imgOriginalSize,
        framSize: FRAME_SIZE,
        imgScale: imgScale,
        frame: frame,
        sideMargin: frameSideMargin
    }

    useEffect(() => {
        if (original) {
            setFrameWidth(imgOriginalSize.w);
        }
    }, [original]);


    return (
        <>
            <div>
                <label className="text-xs uppercase tracking-wide text-zinc-400">
                    <input
                        type="checkbox"
                        checked={original}
                        onChange={(e) => setOriginal(e.target.checked)}
                        className="accent-blue-500"
                    />
                    <span>See original, with no scaling</span>
                </label>
            </div>
            <div className="grid grid-cols-[1fr_1fr] gap-6 px-6">
                <DebugControls
                    frameWidth={frameWidth}
                    setFrameWidth={setFrameWidth}
                    frameTopPadding={frameTopPadding}
                    setFrameTopPadding={setFrameTopPadding}
                    frameSideMargin={frameSideMargin}
                    setFrameSideMargin={setFrameSideMargin}
                    frameOffset={frameY1Offset}
                    setFrameOffest={setFrameY1Offset}

                    dispatchEdit={dispatchEdit}
                    saveJson={saveJson}

                    imgViewPortProps={imgViewPortProps}
                    bboxY1={bboxScaledToOriginal.y1 * imgScale}
                    imageIdx={imageIdx}
                    activeDlgIdx={activeDlgIdx}
                    dlgText={dlg.text}
                />

                <ImageViewport
                    imgUrl={imgUrl}
                    imgSize={imgOriginalSize}
                    framSize={FRAME_SIZE}
                    imgScale={imgScale}
                    frame={frame}
                    sideMargin={frameSideMargin}
                />
            </div>
        </>
    );

}
