@echo off
REM Run this from anywhere to start the Panaghiusa Festival 2026 app locally.
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies...
  npm install
)
echo Starting Next.js development server...
npm run dev
