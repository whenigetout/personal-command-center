from django.shortcuts import render
import time

# Create your views here.
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from league_tracker.league_accounts_info import get_account_data, get_soloq_info
from .models import LeagueAccount
from django.views.decorators.http import require_http_methods
import traceback

def refresh_account_by_riot_id(riot_id: str) -> dict:
    with open("league_tracker/riot_accounts_with_platforms.json", "r", encoding="utf-8") as f:
        accounts = json.load(f)

    account_data = next((acc for acc in accounts if acc.get("riot_id") == riot_id), None)
    if not account_data:
        return {"status": "error", "message": f"Account {riot_id} not found in source JSON"}

    name, tag = riot_id.split("#")
    region = account_data["region"]
    riot_region = account_data["riot_region"]
    platform = account_data["platform"]
    username = account_data["username"]
    desc = account_data["description"]

    def parse_wr(value):
        try:
            return float(value)
        except (ValueError, TypeError):
            return None

    result = get_soloq_info(name, tag, riot_region, platform, region)

    LeagueAccount.objects.update_or_create(
        riot_id=riot_id,
        defaults={
            "region": region,
            "username": username,
            "description": desc,
            "riot_region": riot_region,
            "platform": platform,
            "tier": result.get("Tier"),
            "rank": result.get("Rank", ""),
            "lp": parse_wr(result.get("LP")),
            "games": parse_wr(result.get("Games")),
            "wr": parse_wr(result.get("WR%")),
            "wr10": parse_wr(result.get("Last10WR%")),
            "wr20": parse_wr(result.get("Last20WR%")),
            "veteran": result.get("Veteran", False),
            "error": result.get("Raw", "") if result.get("Tier") == "Error" else "",
        }
    )
    return {"status": "success", "message": f"{riot_id} refreshed"}

@csrf_exempt
@require_http_methods(["POST"])
def refresh_single_account(request):
    try:
        body = json.loads(request.body)
        riot_id = body.get("riot_id")
        print(f"api called. api execution started for {riot_id}")
        if not riot_id:
            return JsonResponse({"status": "error", "message": "Missing riot_id"}, status=400)

        result = refresh_account_by_riot_id(riot_id)
        print(f"processing completed for {riot_id}, returning from api.")
        return JsonResponse(result)

    except Exception as e:
        traceback.print_exc()
        return JsonResponse({"status": "error", "message": str(e)}, status=500)


# Optionally keep legacy or one-time use API route
@csrf_exempt
@require_http_methods(["POST"])
def refresh_all_accounts(request):
    print("api called, api execution started.")

    valid_platforms = [
        "BR1", "EUN1", "EUW1", "JP1", "KR",
        "LA1", "LA2", "ME1", "NA1", "OC1", 
        "RU", "SG2", "TR1", "TW2", "VN2"
    ]

    def parse_wr(value):
        try:
            return float(value)
        except (ValueError, TypeError):
            return None

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
            platform.upper() not in valid_platforms or
            not region
        ):
            print(f"[SKIP] Invalid or missing platform for {riot_id} → {platform}")
            continue

        name, tag = riot_id.split("#")
        print(f"processing data for {riot_id} after 2s pause ...")
        # time.sleep(2)

        result = get_soloq_info(name, tag, riot_region, platform, region)

        print(f"wr10 is {parse_wr(result.get('Last10WR%'))}")

        # Save or update database record
        obj, _ = LeagueAccount.objects.update_or_create(
            riot_id=riot_id,
            defaults={
                "region": region,
                "username": username,
                "description": desc,
                "riot_region": riot_region,
                "platform": platform,
                "tier": result.get("Tier"),
                "rank": result.get("Rank", ""),
                "lp": parse_wr(result.get("LP")),
                "games": parse_wr(result.get("Games")),
                "wr": parse_wr(result.get("WR%")),
                "wr10": parse_wr(result.get("Last10WR%")),
                "wr20": parse_wr(result.get("Last20WR%")),
                "veteran": result.get("Veteran", False),
                "error": result.get("Raw", "") if result.get("Tier") == "Error" else "",
            }
        )

        # Optional: for debug/testing display purposes
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
        {"status": "success", "updated": len(rows)},
        safe=False
    )

@require_http_methods(["GET"])
def league_accounts_display(request):

    TIER_ORDER = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"]
    DIV_ORDER = ["IV", "III", "II", "I"]

    def display_rank(tier, rank):
        tier = (tier or "").upper()
        rank = (rank or "").upper()
        if tier in TIER_ORDER and tier not in ["MASTER", "GRANDMASTER", "CHALLENGER"]:
            return f"{tier.capitalize()} {rank}"
        elif tier in TIER_ORDER:
            return tier.capitalize()
        return "Unranked"

    accounts = LeagueAccount.objects.all()
    result = []
    for acc in accounts:
        result.append({
            "region": acc.region,
            "riot_id": acc.riot_id,
            "username": acc.username,
            "description": acc.description,
            "Tier": display_rank(acc.tier, acc.rank),
            "LP": acc.lp or 0,
            "WR": acc.wr if acc.wr is not None else "-",
            "Games": acc.games or 0,
            "Last10WR": acc.wr10 if acc.wr10 is not None else "-",
            "Last20WR": acc.wr20 if acc.wr20 is not None else "-",
            "Veteran": acc.veteran,
            "Error": acc.error or "",
        })
    
    return JsonResponse(result, safe=False)
