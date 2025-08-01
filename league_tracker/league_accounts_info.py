import requests

API_KEY = "RGAPI-1fc1f3e9-6ffd-4f37-897f-3f5a2587d8e3"  # Replace with your latest key

def get_soloq_info(riot_name, tagline, riot_region, platform, region):

    def format_display_rank(tier_val, rank_val):
        if not tier_val:
            return "Unranked"
        tier_title = tier_val.capitalize()
        return tier_title

    def fallback(reason):
        print(f"[ERROR] {reason}")
        return {
            "Tier": "Error",
            "Rank": "",
            "LP": 0,
            "Games": 0,
            "WR%": 0,
            "Veteran": False,
            "Last10WR%": "-",
            "Last20WR%": "-",
            "Raw": reason
        }

    # Step 1: Riot ID to PUUID
    account_url = f"https://{riot_region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{riot_name}/{tagline}?api_key={API_KEY}"
    res = requests.get(account_url)
    if res.status_code != 200:
        return fallback(f"Riot ID lookup failed: {res.status_code} - {res.text}")

    try:
        acc_res = res.json()
        puuid = acc_res["puuid"]
    except Exception as e:
        return fallback(f"Failed to parse account response: {e}")

    # Step 2: Ranked info
    rank_url = f"https://{platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/{puuid}?api_key={API_KEY}"
    rank_res = requests.get(rank_url)
    if rank_res.status_code != 200:
        return fallback(f"Ranked info failed: {rank_res.status_code} - {rank_res.text}")

    try:
        rank_data = rank_res.json()
    except Exception as e:
        return fallback(f"Failed to parse rank response: {e}")

    soloq = next((entry for entry in rank_data if entry['queueType'] == 'RANKED_SOLO_5x5'), None)

    tier = rank = lp = wins = losses = games = wr = veteran = None

    if soloq:
        tier = soloq['tier']
        rank = soloq['rank']
        lp = soloq['leaguePoints']
        wins = soloq['wins']
        losses = soloq['losses']
        veteran = soloq.get("veteran", False)
        games = wins + losses
        wr = round(100 * wins / games, 1) if games > 0 else 0

    # Step 3: Last 20 ranked matches
    match_ids_url = f"https://{region}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?type=ranked&start=0&count=20&api_key={API_KEY}"
    match_res = requests.get(match_ids_url)
    match_ids = match_res.json() if match_res.status_code == 200 else []

    win_last_10 = win_last_20 = 0
    for i, match_id in enumerate(match_ids):
        try:
            match_url = f"https://{region}.api.riotgames.com/lol/match/v5/matches/{match_id}?api_key={API_KEY}"
            match_detail = requests.get(match_url).json()
            participants = match_detail.get("info", {}).get("participants", [])
            for p in participants:
                if p["puuid"] == puuid:
                    if p["win"]:
                        if i < 10:
                            win_last_10 += 1
                        win_last_20 += 1
                    break
        except Exception as e:
            print(f"[ERROR] Failed to parse match {match_id}: {e}")
            continue

    wr10 = round(100 * win_last_10 / 10, 1) if len(match_ids) >= 0 else "-"
    wr20 = round(100 * win_last_20 / 20, 1) if len(match_ids) >= 0 else "-"

    display_rank = format_display_rank(tier, rank)

    return {
        "Tier": display_rank,
        "Rank": rank or "",
        "LP": lp or 0,
        "Games": games or 0,
        "WR%": wr or 0,
        "Veteran": veteran or False,
        "Last10WR%": wr10,
        "Last20WR%": wr20,
        "Raw": f"Rank: {tier} {rank} ({lp} LP), Games: {games}, Winrate: {wr}%" if soloq else "Unranked in SoloQ"
    }


def get_account_data(name, tag, riot_region, platform):
    return get_soloq_info(name, tag, riot_region, platform)