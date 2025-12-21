@echo off
title Personal Command Center - Django Backend Launcher

REM === Activate Conda env and run Django backend ===
call conda activate pcc-env
python manage.py runserver 9000