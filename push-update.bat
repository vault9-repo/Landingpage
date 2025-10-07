@echo off
:: =====================================================
::  PrimePicksTip - Safe Git Auto Push Script
::  Usage: Double-click this file to push latest updates
:: =====================================================

echo.
echo 🟢 Starting safe push to GitHub...
echo.

:: Verify git repo
if not exist ".git" (
  echo ❌ Not a git repository! Run 'git init' first.
  pause
  exit /b
)

:: Show current branch
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set branch=%%b
echo 📦 Current branch: %branch%
echo.

:: Stage all changes safely
git add .

:: Create a descriptive commit message with timestamp
set "timestamp=%date%_%time%"
git commit -m "Auto update on %timestamp%"

:: Pull latest changes to avoid overwrite conflicts
git pull origin %branch% --rebase

:: Push to remote
git push origin %branch%

echo.
echo ✅ Push completed successfully!
echo.

pause
