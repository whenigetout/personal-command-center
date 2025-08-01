@echo off
title League Tracker - Backend + Frontend Launcher

REM === Activate Conda env and run Django backend ===
start cmd /k "cd /d E:\Getting myself out\py\django\personal-command-center && conda activate pcc-env && python manage.py runserver"

REM === Run Next.js frontend ===
start cmd /k "cd /d E:\Getting myself out\py\django\personal-command-center\frontend && npm run dev"
