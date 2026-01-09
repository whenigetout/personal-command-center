import { MediaRef, OCRImage } from "@manganarrator/contracts"
import { useState, useEffect } from "react"
import { ImageViewport, ImageViewportProps } from "./ImagePanPreviewParts/ImageViewport"
import { Point, Size, Frame, BBox } from "../../types/geometry"
import { DebugControls } from "./ImagePanPreviewParts/DebugControls"
import { EditAction } from "../../types/EditActionType"
import { resolveMediaRef } from "../../utils/helpers"

interface ImagePanPreviewProps {
    image: OCRImage
    imageIdx: number
    activeDlgIdx: number
    onChangeDlg: (idx: number) => void
    dispatchEdit: (action: EditAction) => void
    saveJson: () => void
}

export function ImagePanPreview({ image, imageIdx, activeDlgIdx, onChangeDlg, dispatchEdit, saveJson }: ImagePanPreviewProps) {

    const dlg = image.dialogue_lines[activeDlgIdx]
    const bbox = dlg?.original_bbox

    const imgOriginalSize: Size = {
        w: image.image_info.image_width,
        h: image.image_info.image_height
    }

    const imgRef = image.image_info.image_ref
    const imgUrl = resolveMediaRef(imgRef)

    const ASPECT_RATIO = (1080 / 1920)

    const calcFrame_size = (width: number, sideMargin: number, aspectRatio: number) => ({
        w: width - 2 * sideMargin,
        h: width / aspectRatio,
    })

    // 1️⃣ Source state
    const [frameWidth, setFrameWidth] = useState(480);
    const [frameSideMargin, setFrameSideMargin] = useState(0);
    const [frameTopPadding, setFrameTopPadding] = useState(10);
    const [originalBBox, setOriginalBBox] = useState({ ...bbox });
    const [original, setOriginal] = useState<boolean>(false);

    // 2️⃣ Derived values (NO state, NO effect)
    const FRAME_SIZE = calcFrame_size(frameWidth, frameSideMargin, ASPECT_RATIO);
    const imgScale = FRAME_SIZE.w / imgOriginalSize.w;

    // 3️⃣ Derived frame position
    const finalOffsetY =
        originalBBox.y1 * imgScale - frameTopPadding;

    const frame: Frame = {
        p1: { x: 0, y: finalOffsetY },
        p2: { x: FRAME_SIZE.w, y: finalOffsetY + FRAME_SIZE.h },
    };

    const frameHeightInOriginal =
        FRAME_SIZE.h / imgScale

    const maxFrameY1 =
        imgOriginalSize.h - frameHeightInOriginal


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

    useEffect(() => {
        if (bbox) {
            setOriginalBBox({ ...bbox });
        }
    }, [activeDlgIdx, bbox]);


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

                    frameHeight={FRAME_SIZE.h}

                    frameTopPadding={frameTopPadding}
                    setFrameTopPadding={setFrameTopPadding}
                    frameSideMargin={frameSideMargin}
                    setFrameSideMargin={setFrameSideMargin}

                    dispatchEdit={dispatchEdit}
                    saveJson={saveJson}

                    imgViewPortProps={imgViewPortProps}
                    originalBBox={originalBBox}
                    setOriginalBBox={setOriginalBBox}
                    maxY1={maxFrameY1}
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
