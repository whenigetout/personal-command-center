import { BBox } from "../../../types/geometry";

interface BBoxEditorProps {
    bbox: BBox;
    onChange: (bbox: BBox) => void;
    onSave: (bbox: BBox) => void;
}

export const BBoxEditor = ({ bbox, onChange, onSave }: BBoxEditorProps) => {
    const update = (key: keyof BBox, value: number) => {
        onChange({
            ...bbox,
            [key]: value,
        });
    };

    return (
        <div className="space-y-2 p-3 border rounded text-sm w-64">
            <div className="font-semibold">BBox Editor</div>

            <label className="flex justify-between items-center gap-2">
                <span>x1</span>
                <input
                    type="number"
                    value={bbox.x1}
                    onChange={(e) => update("x1", +e.target.value)}
                    className="w-24 border px-1"
                />
            </label>

            <label className="flex justify-between items-center gap-2">
                <span>y1</span>
                <input
                    type="number"
                    value={bbox.y1}
                    onChange={(e) => update("y1", +e.target.value)}
                    className="w-24 border px-1"
                />
            </label>

            <label className="flex justify-between items-center gap-2">
                <span>x2</span>
                <input
                    type="number"
                    value={bbox.x2}
                    onChange={(e) => update("x2", +e.target.value)}
                    className="w-24 border px-1"
                />
            </label>

            <label className="flex justify-between items-center gap-2">
                <span>y2</span>
                <input
                    type="number"
                    value={bbox.y2}
                    onChange={(e) => update("y2", +e.target.value)}
                    className="w-24 border px-1"
                />
            </label>

            <button
                className="w-full mt-2 border rounded py-1 hover:bg-gray-100"
                onClick={() => onSave(bbox)}
            >
                Save to JSON
            </button>
        </div>
    );
};
