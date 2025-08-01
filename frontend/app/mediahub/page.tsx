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
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    const refresh = () => {
        fetch('http://localhost:8000/api/videos/')
            .then(res => res.json())
            .then(data => setVideos(data));
    };

    useEffect(() => {
        fetch('http://localhost:8000/api/videos/')
            .then(res => res.json())
            .then(data => {
                setVideos(data);
                if (data.length > 0) {
                    setSelectedVideo(data[0]); // Show first video by default
                }
            });
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">🎬 MediaHub</h1>
            <AddVideoForm onAdd={refresh} />
            <SyncFolderForm onSync={refresh} />
            <DeleteAllButton onDelete={refresh} />

            {videos.length === 0 ? (
                <p className="text-gray-500">No videos found.</p>
            ) : (
                <div className="flex gap-6">
                    {/* Main Player */}
                    <div className="flex-1">
                        {selectedVideo && (
                            <div className="border rounded p-4 shadow">
                                <h2 className="text-xl font-semibold">{selectedVideo.title}</h2>
                                <p className="text-sm text-gray-500">{selectedVideo.file_path}</p>
                                <p className="mt-2">
                                    <strong>Tags:</strong> {selectedVideo.tags.map(t => t.name).join(', ') || 'None'}
                                </p>
                                <p>
                                    <strong>Actresses:</strong> {selectedVideo.actresses.map(a => a.name).join(', ') || 'None'}
                                </p>
                                <VideoCard
                                    src={`http://localhost:8000/api/stream/?path=${encodeURIComponent(selectedVideo.file_path)}`}
                                    thumb={`http://localhost:8000/api/thumbnail/?path=${encodeURIComponent(selectedVideo.file_path)}`}
                                />
                            </div>
                        )}
                    </div>

                    {/* Sidebar Thumbnails */}
                    <div className="w-[300px] space-y-4 overflow-y-auto max-h-[80vh]">
                        {videos.map(video => (
                            <div
                                key={video.id}
                                className={`border p-2 rounded cursor-pointer hover:bg-gray-800 transition ${selectedVideo?.id === video.id ? 'bg-gray-900' : ''
                                    }`}
                                onClick={() => setSelectedVideo(video)}
                            >
                                <h3 className="text-md font-semibold truncate">{video.title}</h3>
                                <VideoCard
                                    src={`http://localhost:8000/api/stream/?path=${encodeURIComponent(video.file_path)}`}
                                    thumb={`http://localhost:8000/api/thumbnail/?path=${encodeURIComponent(video.file_path)}`}
                                    minimal
                                />

                            </div>
                        ))}
                    </div>
                </div>

            )}
        </div>
    );
}
