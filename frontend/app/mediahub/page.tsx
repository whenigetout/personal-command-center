'use client';

import { useEffect, useState } from 'react';
import VideoCard from '@/components/VideoCard';

type Tag = { id: number; name: string };
type Actress = { id: number; name: string };
type Video = {
    id: number;
    title: string;
    file_path: string;
    tags: Tag[];
    actresses: Actress[];
};

function AddVideoForm({ onAdd }: { onAdd: () => void }) {
    const [title, setTitle] = useState('');
    const [filePath, setFilePath] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('http://localhost:8000/api/videos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, file_path: filePath }),
        });

        if (response.ok) {
            setTitle('');
            setFilePath('');
            onAdd();
        } else {
            console.error('Error adding video');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Add New Video</h3>
            <input
                className="border p-2 mr-2"
                type="text"
                placeholder="Video Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
            />
            <input
                className="border p-2 mr-2"
                type="text"
                placeholder="File Path (e.g., D:/videos/test.mp4)"
                value={filePath}
                onChange={e => setFilePath(e.target.value)}
                required
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
                Add
            </button>
        </form>
    );
}

function SyncFolderForm({ onSync }: { onSync: () => void }) {
    const [path, setPath] = useState('');
    const [status, setStatus] = useState<string | null>(null);

    const handleSync = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Syncing...');

        const res = await fetch('http://localhost:8000/api/sync-folder/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path }),
        });

        const data = await res.json();

        if (res.ok) {
            setStatus(data.status || 'Sync complete!');
            onSync();  // refresh list
        } else {
            setStatus(data.error || 'Sync failed.');
        }

        setPath('');
    };

    return (
        <form onSubmit={handleSync} className="mb-6 border p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">📁 Sync Folder</h3>
            <input
                className="border p-2 mr-2 w-[400px]"
                type="text"
                placeholder="E:/MyVideos"
                value={path}
                onChange={e => setPath(e.target.value)}
                required
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
                Sync
            </button>
            {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}
        </form>
    );
}

function DeleteAllButton({ onDelete }: { onDelete: () => void }) {
    const [status, setStatus] = useState<string | null>(null);

    const handleClick = async () => {
        if (!confirm('Are you sure you want to delete ALL videos?')) return;

        const res = await fetch('http://localhost:8000/api/delete-all/', {
            method: 'POST',
        });

        const data = await res.json();

        if (res.ok) {
            setStatus(data.status);
            onDelete();  // refresh video list
        } else {
            setStatus('Error deleting videos');
        }
    };

    return (
        <div className="mb-6">
            <button
                onClick={handleClick}
                className="bg-red-600 text-white px-4 py-2 rounded"
            >
                ❌ Delete All Videos
            </button>
            {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}
        </div>
    );
}


export default function MediaHubPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [showingVideoId, setShowingVideoId] = useState<number | null>(null);


    const refresh = () => {
        fetch('http://localhost:8000/api/videos/')
            .then(res => res.json())
            .then(data => setVideos(data));
    };

    useEffect(refresh, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">🎬 MediaHub</h1>
            <AddVideoForm onAdd={refresh} />
            <SyncFolderForm onSync={refresh} />
            <DeleteAllButton onDelete={refresh} />

            {videos.length === 0 ? (
                <p className="text-gray-500">No videos found.</p>
            ) : (
                <ul className="space-y-6">
                    {videos.map(video => (
                        <li key={video.id} className="border rounded p-4 shadow">
                            <h2 className="text-xl font-semibold">{video.title}</h2>
                            <p className="text-sm text-gray-500">{video.file_path}</p>
                            <p className="mt-2">
                                <strong>Tags:</strong> {video.tags.map(t => t.name).join(', ') || 'None'}
                            </p>
                            <p>
                                <strong>Actresses:</strong> {video.actresses.map(a => a.name).join(', ') || 'None'}
                            </p>
                            {/* For real video previews later, we'll replace this */}
                            <div
                                className="w-[300px] h-[170px] relative overflow-hidden rounded-lg shadow transition-all duration-300"
                            >
                                {showingVideoId === video.id ? (
                                    <video
                                        key={video.id} // force remount so autoplay works
                                        width="300"
                                        height="170"
                                        controls
                                        autoPlay
                                        className="absolute top-0 left-0 w-full h-full object-cover animate-fade-in"
                                        src={`http://localhost:8000/api/stream/?path=${encodeURIComponent(video.file_path)}`}
                                    />
                                ) : (
                                    <img
                                        key={`thumb-${video.id}`}
                                        src={`http://localhost:8000/api/thumbnail/?path=${encodeURIComponent(video.file_path)}`}
                                        alt="Thumbnail"
                                        className="cursor-pointer absolute top-0 left-0 w-full h-full object-cover hover:brightness-90 transition duration-200"
                                        onClick={() => setShowingVideoId(video.id)}
                                    />
                                )}
                            </div>


                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
