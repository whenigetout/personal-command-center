import { ImageViewportProps } from "./ImageViewport";
import { BBoxEditor } from "./BBoxEditor";
import { EditAction } from "../../../types/EditActionType";

// DebugControls.tsx
interface DebugControlsProps {
    frameWidth: number;
    setFrameWidth: (v: number) => void;

    frameTopPadding: number;
    setFrameTopPadding: (v: number) => void;

    frameSideMargin: number;
    setFrameSideMargin: (v: number) => void;

    frameOffset: number;
    setFrameOffest: (v: number) => void;

    dispatchEdit: (action: EditAction) => void
    saveJson: () => void

    imgViewPortProps: ImageViewportProps
    bboxY1: number
    imageIdx: number
    activeDlgIdx: number
    dlgText: string
}

export const DebugControls = ({
    frameWidth,
    setFrameWidth,
    frameTopPadding,
    setFrameTopPadding,
    frameSideMargin,
    setFrameSideMargin,
    frameOffset,
    setFrameOffest,
    dispatchEdit,
    saveJson,
    imgViewPortProps,
    bboxY1,
    imageIdx,
    activeDlgIdx,
    dlgText
}: DebugControlsProps) => {
    const { imgSize, imgScale, frame } = imgViewPortProps

    const bgSize = `${imgSize.w * imgScale}px ${imgSize.h * imgScale}px`
    const bgPos = `${frame.p1.x}px -${frame.p1.y}px`

    return (
        <div className="space-y-3 p-3 border rounded text-sm">
            <div>
                <label>Frame width</label>
                <input
                    type="range"
                    min={200}
                    max={800}
                    value={frameWidth}
                    onChange={(e) => setFrameWidth(+e.target.value)}
                />
                <span>{frameWidth}px</span>
            </div>

            <div>
                <label>Top padding</label>
                <input
                    type="range"
                    min={-50}
                    max={100}
                    value={frameTopPadding}
                    onChange={(e) => setFrameTopPadding(+e.target.value)}
                />
                <span>{frameTopPadding}px</span>
            </div>

            <div>
                <label>Side margin</label>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={frameSideMargin}
                    onChange={(e) => setFrameSideMargin(+e.target.value)}
                />
                <span>{frameSideMargin}px</span>
            </div>

            <div>
                <label>Frame Offset</label>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={frameOffset}
                    onChange={(e) => setFrameOffest(+e.target.value)}
                />
                <span>{frameSideMargin}px</span>
            </div>

            <div>
                <h3>Passed Props:</h3>
                <p>Frame Offset: {imgViewPortProps.frame.p1.y}</p>
                <p>BBox Y1: {bboxY1}</p>
                <p>original img size: {imgSize.w} x {imgSize.h}</p>
                <p>bgSize: {bgSize}</p>
                <p>bgPos: {bgPos}</p>
                <p>activeDlgIdx: {activeDlgIdx}</p>
                <p>dlgText: {dlgText}</p>
            </div>

            <BBoxEditor
                bbox={bbo}
            />

        </div>
    );
}
