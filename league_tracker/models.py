from django.db import models

# Create your models here.
from django.db import models

class LeagueAccount(models.Model):
    region = models.CharField(max_length=10)
    riot_id = models.CharField(max_length=100, unique=True)
    username = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    riot_region = models.CharField(max_length=10)
    platform = models.CharField(max_length=10)

    tier = models.CharField(max_length=30, blank=True, null=True)
    rank = models.CharField(max_length=5, blank=True, null=True)
    lp = models.IntegerField(blank=True, null=True)
    games = models.IntegerField(blank=True, null=True)
    wr = models.FloatField(blank=True, null=True)
    wr10 = models.FloatField(blank=True, null=True)
    wr20 = models.FloatField(blank=True, null=True)
    veteran = models.BooleanField(default=False)

    error = models.TextField(blank=True, null=True)  # Store fetch error if any
    last_updated = models.DateTimeField(auto_now=True)

    def display_rank(self):
        if not self.tier:
            return "Unranked"
        tier = self.tier.capitalize()
        if tier in ["Master", "Grandmaster", "Challenger"]:
            return tier
        roman = {"I": "I", "II": "II", "III": "III", "IV": "IV"}
        return f"{tier} {roman.get(self.rank, '')}"
