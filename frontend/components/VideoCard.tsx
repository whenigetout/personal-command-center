'use client'

import { useState } from 'react'

type VideoProps = {
    id: number
    name: string
    filepath: string
    tags: string[]
    actresses: string[]
}

export default function VideoCard({ video }: { video: VideoProps }) {
    const [isHovered, setIsHovered] = useState(false)

    const thumbnailUrl = `/api/thumbnail/?path=${encodeURIComponent(video.filepath)}`
    const videoUrl = `/api/stream/?path=${encodeURIComponent(video.filepath)}`

    return (
        <div
            className="bg-zinc-900 rounded-lg overflow-hidden shadow hover:shadow-xl transition-all w-full max-w-xs"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="aspect-video w-full">
                {isHovered ? (
                    <video
                        src={videoUrl}
                        controls
                        autoPlay
                        muted
                        loop
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src={thumbnailUrl}
                        alt={video.name}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
            <div className="p-3">
                <h2 className="text-sm font-semibold line-clamp-2">{video.name}</h2>
                <p className="text-xs text-zinc-400">Tags: {video.tags.join(', ') || 'None'}</p>
                <p className="text-xs text-zinc-400">Actresses: {video.actresses.join(', ') || 'None'}</p>
            </div>
        </div>
    )
}
