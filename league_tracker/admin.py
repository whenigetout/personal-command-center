from django.contrib import admin
from .models import LeagueAccount

@admin.register(LeagueAccount)
class LeagueAccountAdmin(admin.ModelAdmin):
    list_display = ["username", "riot_id", "region", "tier", "rank", "lp", "wr", "wr10", "wr20", "games", "veteran", "error"]
    search_fields = ["username", "riot_id", "region"]
