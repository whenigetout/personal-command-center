interface SpeakerProps {
    speaker: string
}
export const Speaker = ({
    speaker
}: SpeakerProps) => {
    return (
        <div>Speaker
            <input
                className="bg-gray-900 border border-gray-700 text-blue-300 px-2 py-1 rounded mr-2"
                defaultValue={speaker}

            />
        </div>
    )
}
