$ErrorActionPreference = "Stop"

function Write-Info([string]$message) {
  Write-Host "[INFO] $message" -ForegroundColor Cyan
}

function Write-ErrorAndExit([string]$message) {
  Write-Host "[ERROR] $message" -ForegroundColor Red
  Write-Host ""
  Read-Host "Enterキーで終了"
  exit 1
}

Set-Location (Join-Path $PSScriptRoot "..")

Write-Info "請求書アプリの起動準備を開始します。"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js が見つかりません。" -ForegroundColor Yellow
  Write-Host "以下のURLから Node.js (LTS) をインストール後、もう一度 起動.bat を実行してください。"
  Write-Host "https://nodejs.org/ja"
  Read-Host "Enterキーで終了"
  exit 1
}

if (-not (Test-Path "node_modules")) {
  Write-Info "初回セットアップ: 依存関係をインストールします。"
  npm install
  if ($LASTEXITCODE -ne 0) {
    Write-ErrorAndExit "npm install に失敗しました。"
  }
}

Write-Info "本番ビルドを更新します。"
npm run build
if ($LASTEXITCODE -ne 0) {
  Write-ErrorAndExit "npm run build に失敗しました。"
}

Write-Info "ブラウザを開きます。"
Start-Process "http://localhost:3000"

Write-Info "アプリを起動します。終了するまでこの画面を閉じないでください。"
npm run start -- -p 3000
