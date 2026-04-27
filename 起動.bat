@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed.
  echo Install Node.js LTS from https://nodejs.org/ and try again.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [INFO] First-time setup: npm install
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    echo.
    pause
    exit /b 1
  )
)

echo [INFO] Building app...
call npm run build
if errorlevel 1 (
  echo [ERROR] npm run build failed.
  echo.
  pause
  exit /b 1
)

echo [INFO] Opening browser...
start "" "http://localhost:3000"

echo [INFO] Starting server. Keep this window open.
call npm run start -- -p 3000

if errorlevel 1 (
  echo [ERROR] Server stopped due to an error.
  echo.
  pause
  exit /b 1
)

endlocal
