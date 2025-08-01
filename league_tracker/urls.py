from django.urls import path
from .views import refresh_all_accounts, league_accounts_display, refresh_single_account

urlpatterns = [
    path('api/refresh_all_accounts/', refresh_all_accounts, name='refresh_all_accounts_api'),
    path("api/league_accounts_display/", league_accounts_display, name="league_accounts_display"),
    path('api/refresh_single_account/', refresh_single_account, name='refresh_account'),
]
