from django.shortcuts import render

# Create your views here.
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from league_tracker.league_accounts_info import get_soloq_info
from .models import LeagueAccount

def league_data_view(request):
    accounts = LeagueAccount.objects.all()
    result = []
    for acc in accounts:
        result.append({
            "region": acc.region,
            "riot_id": acc.riot_id,
            "username": acc.username,
            "description": acc.description,
            "Tier": acc.display_rank(),
            "LP": acc.lp or 0,
            "WR%": acc.wr if acc.wr is not None else "-",
            "Games": acc.games or 0,
            "Last10WR%": acc.wr10 if acc.wr10 is not None else "-",
            "Last20WR%": acc.wr20 if acc.wr20 is not None else "-",
            "Veteran": acc.veteran,
            "Error": acc.error,
        })
    return JsonResponse(result, safe=False)

@csrf_exempt
def refresh_account_data(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        riot_id = body.get("riot_id")
        try:
            account = LeagueAccount.objects.get(riot_id=riot_id)
            # Re-fetch data using your existing Riot API functions
            data = get_league_info(account.riot_id, account.riot_region, account.platform)

            account.tier = data["Tier"]
            account.rank = data.get("Rank", "")
            account.lp = data["LP"]
            account.games = data["Games"]
            account.wr = float(data["WR%"]) if data["WR%"] != "-" else None
            account.wr10 = data["Last10WR%"]
            account.wr20 = data["Last20WR%"]
            account.veteran = data["Veteran"]
            account.error = ""
            account.save()
            return JsonResponse({"status": "success"})
        except Exception as e:
            account.error = str(e)
            account.save()
            return JsonResponse({"status": "error", "message": str(e)})

def parse_rank_string(info_str):
    if not info_str.startswith("Rank:"):
        return {"Tier": "Error", "LP": 0, "Games": 0, "WR%": 0, "Raw": info_str}
    try:
        tier = info_str.split("Rank: ")[1].split(" (")[0]
        lp = int(info_str.split("(")[1].split(" ")[0])
        games = int(info_str.split("Games: ")[1].split(",")[0])
        wr = float(info_str.split("Winrate: ")[1].replace("%", ""))
        return {"Tier": tier, "LP": lp, "Games": games, "WR%": wr, "Raw": info_str}
    except:
        return {"Tier": "ParseErr", "LP": 0, "Games": 0, "WR%": 0, "Raw": info_str}

def league_accounts_api(request):
    valid_platforms = [
    "BR1", "EUN1", "EUW1", "JP1", "KR",
    "LA1", "LA2", "ME1", "NA1", "OC1", 
    "RU", "SG2", "TR1", "TW2", "VN2"
]

    with open("league_tracker/riot_accounts_with_platforms.json", "r", encoding="utf-8") as f:
        accounts = json.load(f)

    rows = []
    for acc in accounts:
        riot_id = acc.get("riot_id", "-")
        riot_region = acc.get("riot_region")
        platform = acc.get("platform")
        region = acc.get("region")
        username = acc.get("username")
        desc = acc.get("description")

        if (
            riot_id == "-" or
            "#" not in riot_id or
            not riot_region or
            not platform or
            platform.upper() not in valid_platforms
        ):
            print(f"[SKIP] Invalid or missing platform for {riot_id} → {platform}")
            continue

        name, tag = riot_id.split("#")
        result = get_soloq_info(name, tag, riot_region, platform)
    
        
        rows.append({
            "region": region,
            "riot_region": riot_region,
            "platform": platform,
            "riot_id": riot_id,
            "username": username,
            "description": desc,
            "Tier": result.get("Tier", "-"),
            "LP": result.get("LP", "-"),
            "WR%": result.get("WR%", "-"),
            "Games": result.get("Games", "-"),
            "Veteran": result.get("Veteran", "-"),
            "Last10WR%": result.get("Last10WR%", "-"),
            "Last20WR%": result.get("Last20WR%", "-"),
        })

    return JsonResponse(
        sorted(
            rows,
            key=lambda r: (
                r.get("region", ""),
                r.get("Tier", "Unranked"),
                -r.get("LP", 0)
            )
        ),
        safe=False
    )

