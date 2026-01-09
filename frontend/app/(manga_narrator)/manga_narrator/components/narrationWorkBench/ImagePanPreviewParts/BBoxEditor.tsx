import { EditAction, EditActionType } from "../../../types/EditActionType"
import { OriginalImageBBox, DialogueLine } from "@manganarrator/contracts"
import { PrecisionSlider } from "../../common/PrecisionSlider"
import { DisplayValues } from "../../common/DisplayValues"

interface BBoxEditorProps {
    originalBBox: OriginalImageBBox
    setOriginalBBox: (v: OriginalImageBBox) => void
    maxY1: number
    imageIdx: number
    activeDlgIdx: number

    dispatchEdit: (action: EditAction) => void
    onSave: () => void;
}

export const BBoxEditor = ({
    originalBBox,
    setOriginalBBox,
    maxY1,
    imageIdx,
    activeDlgIdx,
    dispatchEdit,
    onSave
}: BBoxEditorProps) => {
    // const update = (key: keyof BBox, value: number) => {
    //     onChange({
    //         ...bbox,
    //         [key]: value,
    //     });
    // };

    const update = (y1: number) => {

        const newBbox = {
            ...originalBBox,
            y1: y1,
            y2: originalBBox.y2 + (y1 - originalBBox.y1)
        }
        const edit: EditAction = {
            dlgIdx: activeDlgIdx,
            imageIdx: imageIdx,
            type: EditActionType.Dialogue_update,
            updates: {
                original_bbox: newBbox
            }
        }
        setOriginalBBox(newBbox)
        dispatchEdit(edit)
    }


    return (
        <div className="space-y-2 p-3 border rounded text-sm w-64">
            <div className="font-semibold">BBox Editor</div>

            <DisplayValues
                displayLabel="x1"
                displayValue={originalBBox.x1}
            />

            <PrecisionSlider
                label="y1"
                value={originalBBox.y1}
                min={0}
                max={maxY1}
                step={1}
                bigStep={10}
                onChange={(y1) => update(y1)}
            />

            <DisplayValues
                displayLabel="x2"
                displayValue={originalBBox.x2}
            />

            <DisplayValues
                displayLabel="y2"
                displayValue={originalBBox.y2}
            />

            <button
                className="w-full mt-2 border rounded py-1 hover:bg-gray-100"
                onClick={() => onSave()}
            >
                Save to JSON
            </button>
        </div>
    );
};
