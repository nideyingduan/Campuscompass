# Campus Nav - Timetable Installer (English-safe version, Unicode escaped)
# Step 1: put all .xls timetable files into ONE folder.
# Step 2: run this script, paste the folder path, press Enter.
# It copies files into <project>/timetables/ renamed as "<class-name>.xls".

$ErrorActionPreference = 'Continue'

Write-Host '=============================================='
Write-Host '  Campus Nav - Timetable Installer'
Write-Host '=============================================='
Write-Host ''
Write-Host 'Step 1: Put all .xls timetable files into ONE folder.'
Write-Host '        (select all files in WeChat, drag them into a new folder)'
Write-Host ''
$src = Read-Host 'Step 2: Paste that folder path here, then press Enter'
$src = $src.Trim().Trim('"').Trim("'")
if (-not $src -or -not (Test-Path $src)) {
    Write-Host ''
    Write-Host 'Invalid path. Script stopped.' -ForegroundColor Red
    Read-Host 'Press Enter to close'
    exit 1
}

$dst = Join-Path $PSScriptRoot 'timetables'
New-Item -ItemType Directory -Force -Path $dst | Out-Null

$files = Get-ChildItem -Path $src -Filter *.xls -File
if (-not $files) {
    Write-Host ''
    Write-Host 'No .xls files found in that folder. Please check the folder.' -ForegroundColor Yellow
    Read-Host 'Press Enter to close'
    exit 1
}

# Match class name like: 26级莞临床02班 / 26级湛临床01班
# Unicode: 级=7EA7 莞=839E 湛=6E5B 班=73ED
$pattern = '26\u7EA7(\u839E|\u6E5B)[^\u73ED]+\u73ED'

$ok = 0
$skip = 0
foreach ($f in $files) {
    if ($f.BaseName -match $pattern) {
        $newName = $matches[0] + '.xls'
        $target = Join-Path $dst $newName
        Copy-Item -Path $f.FullName -Destination $target -Force
        Write-Host ('Copied: ' + $newName) -ForegroundColor Green
        $ok++
    } else {
        Write-Host ('Skipped (no class name found): ' + $f.Name) -ForegroundColor Yellow
        $skip++
    }
}

Write-Host ''
Write-Host ('Done! Copied ' + $ok + ' files, skipped ' + $skip + '.') -ForegroundColor Green
Write-Host 'Go back to Doubao and tell me to verify the timetable.'
Read-Host 'Press Enter to close'
