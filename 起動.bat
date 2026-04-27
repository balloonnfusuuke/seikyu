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

echo [INFO] Syncing dependencies...
call npm install
if errorlevel 1 (
  echo [ERROR] npm install failed.
  echo.
  pause
  exit /b 1
)

echo [INFO] Building app...
call npm run build
if errorlevel 1 (
  echo [ERROR] npm run build failed.
  echo.
  pause
  exit /b 1
)

set PORT=3000
netstat -ano | findstr /r /c:":3000 .*LISTENING" >nul
if not errorlevel 1 (
  set PORT=3001
  echo [WARN] Port 3000 is already in use. Switching to port 3001.
)

echo [INFO] Opening browser...
start "" "http://localhost:%PORT%"

echo [INFO] Starting server. Keep this window open.
call npm run start -- -p %PORT%

if errorlevel 1 (
  echo [ERROR] Server stopped due to an error.
  echo.
  pause
  exit /b 1
)

endlocal
