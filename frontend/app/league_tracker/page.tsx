'use client';
import { useEffect, useState } from 'react';

const tierOrder = [
    "Unranked", "Iron", "Bronze", "Silver", "Gold",
    "Platinum", "Emerald", "Diamond", "Master", "Grandmaster", "Challenger"
];

const romanToNumber: { [key: string]: number } = {
    "IV": 1, "III": 2, "II": 3, "I": 4
};

function getTierValue(tierStr: string): number {
    if (!tierStr || tierStr === "-") return -1;
    const parts = tierStr.split(" ");
    const tier = parts[0];
    const div = parts[1] || "";
    const tierIndex = tierOrder.indexOf(tier);
    const divIndex = romanToNumber[div] || 0;
    return tierIndex * 10 + divIndex;
}

type Account = {
    region: string;
    riot_id: string;
    Tier: string;
    LP: number;
    WR: number | string;
    Games: number;
    Last10WR: number | string;
    Last20WR: number | string;
    Veteran: boolean;
    username: string;
    description: string;
};

export default function LeagueTracker() {
    const [search, setSearch] = useState('');
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [sortBy, setSortBy] = useState('');
    const [sortAsc, setSortAsc] = useState(true);
    const [loadingRiotIds, setLoadingRiotIds] = useState<Set<string>>(new Set());

    function formatSummonerName(riotId: string): string {
        const [name, tag] = riotId.split('#');
        return `${name}-${tag}`.toLowerCase();
    }

    function getRegionCode(region: string): string {
        // You can customize this map if needed
        const regionMap: { [key: string]: string } = {
            sea: 'sg',       // or 'ph', 'th' etc depending on subregion (default to sg)
            europe: 'euw',
            asia: 'jp',      // or 'kr' depending on your needs
            na: 'na',
        };
        return regionMap[region.toLowerCase()] || 'na';
    }


    const fetchData = async () => {
        try {
            const res = await fetch('http://localhost:9000/api/league_accounts_display/');
            if (res.ok) {
                const data = await res.json();
                setAccounts(data);
            }
        } catch (err) {
            console.error('Error fetching:', err);
        }
    };

    const handleRefreshAll = async () => {
        const res = await fetch('http://localhost:9000/api/refresh_all_accounts/', { method: 'POST' });
        if (res.ok) {
            alert("✅ Refresh complete!");
            fetchData();
        } else {
            alert("❌ Failed. Check server logs.");
        }
    };

    const handleRefreshRow = async (riot_id: string) => {
        setLoadingRiotIds(prev => new Set(prev).add(riot_id));
        try {
            const res = await fetch('http://localhost:9000/api/refresh_single_account/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ riot_id })
            });
            if (res.ok) {
                await fetchData();
            } else {
                alert(`❌ Failed to refresh ${riot_id}`);
            }
        } catch {
            alert(`❌ Error refreshing ${riot_id}`);
        } finally {
            setLoadingRiotIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(riot_id);
                return newSet;
            });
        }
    };

    useEffect(() => { fetchData(); }, []);

    const filtered = accounts.filter(acc =>
        acc.riot_id.toLowerCase().includes(search.toLowerCase()) ||
        acc.username.toLowerCase().includes(search.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
        if (!sortBy) return 0;
        let valA: any = a[sortBy as keyof Account];
        let valB: any = b[sortBy as keyof Account];

        if (sortBy === "Tier") {
            valA = getTierValue(a.Tier);
            valB = getTierValue(b.Tier);
        }

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        return sortAsc ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
    });

    const handleSort = (key: string) => {
        setSortBy(key);
        setSortAsc(prev => (key === sortBy ? !prev : true));
    };

    return (
        <div className="min-h-screen p-6" style={{ backgroundColor: '#c3b286', color: '#423a32' }}>
            <h1 className="text-2xl font-semibold mb-4">League Account Tracker</h1>

            <input
                type="text"
                placeholder="Search Riot ID or Username"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full mb-6 px-4 py-2 rounded border border-[#423a32] placeholder-[#7a6d5e]"
                style={{ backgroundColor: '#e7ddc2', color: '#423a32' }}
            />

            <button
                onClick={handleRefreshAll}
                className="mb-4 px-4 py-2 rounded border border-[#423a32] bg-[#e7ddc2] hover:bg-[#d5c6a8] transition"
            >
                🔁 Refresh All
            </button>

            <div className="overflow-x-auto rounded border border-[#423a32]">
                <table className="w-full text-sm text-left">
                    <thead style={{ backgroundColor: '#b09b6c' }}>
                        <tr>
                            {[
                                'region', 'riot_id', 'Tier', 'LP', 'WR', 'Games',
                                'Last10WR', 'Last20WR', 'Veteran', 'username', 'description'
                            ].map(label => (
                                <th
                                    key={label}
                                    onClick={() => handleSort(label)}
                                    className="px-3 py-2 border border-[#423a32] font-semibold cursor-pointer select-none"
                                >
                                    {label}{sortBy === label ? (sortAsc ? ' ▲' : ' ▼') : ''}
                                </th>
                            ))}
                            <th className="px-3 py-2 border border-[#423a32] font-semibold">Refresh</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.length ? sorted.map((acc, i) => (
                            <tr key={i} className="border-b border-[#423a32]">
                                <td className="px-3 py-2">{acc.region}</td>
                                <td>
                                    <a
                                        href={`https://mobalytics.gg/lol/profile/${getRegionCode(acc.region)}/${formatSummonerName(acc.riot_id)}/overview`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: 'lightblue', textDecoration: 'underline' }}
                                    >
                                        {acc.riot_id}
                                    </a>
                                </td>

                                <td className="px-3 py-2">{acc.Tier}</td>
                                <td className="px-3 py-2">{acc.LP}</td>
                                <td className="px-3 py-2">{acc.WR}</td>
                                <td className="px-3 py-2">{acc.Games}</td>
                                <td className="px-3 py-2">{acc.Last10WR}</td>
                                <td className="px-3 py-2">{acc.Last20WR}</td>
                                <td className="px-3 py-2">{acc.Veteran ? 'Yes' : 'No'}</td>
                                <td className="px-3 py-2">{acc.username}</td>
                                <td className="px-3 py-2">{acc.description}</td>
                                <td className="px-3 py-2">
                                    <button
                                        className="px-2 py-1 border rounded bg-[#e7ddc2] hover:bg-[#d5c6a8] transition"
                                        disabled={loadingRiotIds.has(acc.riot_id)}
                                        onClick={() => handleRefreshRow(acc.riot_id)}
                                    >
                                        {loadingRiotIds.has(acc.riot_id) ? "..." : "🔁"}
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={12} className="text-center px-4 py-6 text-[#5e4e3f] italic">
                                    No data found. Try refreshing.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
