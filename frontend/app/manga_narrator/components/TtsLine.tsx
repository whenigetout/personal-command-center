import React, { useEffect, useState } from 'react'

interface Props {
    run_id: string
    dialogue: {
        id: number
        image_file_name: string
        image_rel_path_from_root: string
        gender: string
        emotion: string
        text: string
        speaker: string
    }
    speakerId: string
}

const DJANGO_API_ROOT = process.env.NEXT_PUBLIC_BACKEND_API as string
const TTS_API_ROOT = process.env.NEXT_PUBLIC_TTS_API as string

export default function TtsLine({ run_id, dialogue, speakerId }: Props) {
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [version, setVersion] = useState<number | null>(null)
    const [cfg, setCfg] = useState("")
    const [exaggeration, setExaggeration] = useState("")
    const [useCustom, setUseCustom] = useState(false)
    const [loading, setLoading] = useState(false)

    const imageNameBase = dialogue.image_file_name.split('/').pop()?.replace('.', '_')
    const audioFolder = `${run_id}/${dialogue.image_rel_path_from_root}/${imageNameBase}/dialogue__${dialogue.id}`


    const fetchAudioInfo = async () => {
        try {

            console.log("-------------in fetchaudio-------------");
            console.log(audioFolder);
            const response = await fetch(`${DJANGO_API_ROOT}/api/manga/latest_audio/?path=${audioFolder}`)
            const data = await response.json()


            console.log(data);


            if (data?.url) {
                setAudioUrl(data.url)
                setVersion(parseInt(data.file_name.match(/v(\d+)/)?.[1] || "0", 10))

                const exgMatch = data.file_name.match(/exg([\d.]+)/)
                const cfgMatch = data.file_name.match(/cfg([\d.]+)/)

                setExaggeration(exgMatch?.[1] || "")
                setCfg(cfgMatch?.[1] || "")
            } else {
                setAudioUrl(null)
                setVersion(null)
            }
        } catch (err) {
            console.error("Failed to load TTS audio:", err)
        }
    }

    useEffect(() => {
        fetchAudioInfo()
    }, [run_id, dialogue.id])

    const triggerTTS = async () => {
        setLoading(true)
        const payload = {
            text: dialogue.text,
            gender: dialogue.gender,
            emotion: dialogue.emotion,
            speaker_id: speakerId,
            run_id: run_id,
            image_rel_path_from_root: dialogue.image_rel_path_from_root,
            image_file_name: dialogue.image_file_name,
            dialogue_id: dialogue.id,
            use_custom_params: useCustom,
            exaggeration: useCustom ? parseFloat(exaggeration) : undefined,
            cfg: useCustom ? parseFloat(cfg) : undefined
        }

        try {
            const res = await fetch(`${TTS_API_ROOT}/tts/dialogue`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            const result = await res.json()
            if (result.status === "success") {
                await fetchAudioInfo()
            } else {
                alert("TTS error: " + result.message)
            }
        } catch (err) {
            console.error("TTS generation failed:", err)
        }
        setLoading(false)
    }

    return (
        <div className="border border-purple-600 rounded mt-2 p-2 bg-gray-900">
            {audioUrl ? (
                <>
                    <div className="text-sm text-green-400">🎧 Latest: <code>{audioUrl.split("/").pop()}</code></div>
                    <audio src={audioUrl} controls className="my-2 w-full" />
                    <button
                        onClick={triggerTTS}
                        className="bg-purple-700 text-white text-xs px-2 py-1 rounded hover:bg-purple-800"
                        disabled={loading}
                    >
                        🔁 Regenerate
                    </button>
                </>
            ) : (
                <button
                    onClick={triggerTTS}
                    className="bg-purple-600 text-white text-xs px-2 py-1 rounded hover:bg-purple-700"
                    disabled={loading}
                >
                    🎙️ Generate
                </button>
            )}

            <div className="mt-2 flex items-center gap-3 text-xs text-gray-300">
                <label><input type="checkbox" checked={useCustom} onChange={() => setUseCustom(!useCustom)} /> Use custom cfg/exg</label>
                <input
                    value={cfg}
                    onChange={e => setCfg(e.target.value)}
                    placeholder="cfg"
                    disabled={!useCustom}
                    className="bg-gray-800 text-white px-1 w-16 rounded"
                />
                <input
                    value={exaggeration}
                    onChange={e => setExaggeration(e.target.value)}
                    placeholder="exg"
                    disabled={!useCustom}
                    className="bg-gray-800 text-white px-1 w-16 rounded"
                />
            </div>
        </div>
    )
}
