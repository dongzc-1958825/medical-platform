# pre_repair_backup.ps1 - 修复前备份
param(
    [string]$FileToRepair = "",
    [string]$Description = ""
)

Write-Host "🔧 修复前备份系统" -ForegroundColor Cyan
Write-Host "=========================================="

if ($FileToRepair -and (Test-Path $FileToRepair)) {
    Write-Host "🎯 目标文件: $FileToRepair" -ForegroundColor Green
    
    # 创建单个文件备份
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupDir = "file_backups\$([System.IO.Path]::GetFileNameWithoutExtension($FileToRepair))_${timestamp}"
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    # 备份目标文件
    Copy-Item $FileToRepair (Join-Path $backupDir (Split-Path $FileToRepair -Leaf)) -Force
    
    # 备份相关文件
    $relatedFiles = @()
    
    # 如果是配置文件，备份相关配置
    if ($FileToRepair -match "config|vite") {
        $relatedFiles = @("package.json", "tsconfig.json", "index.html")
    }
    
    # 如果是App.tsx，备份相关路由文件
    if ($FileToRepair -match "App\.tsx") {
        $relatedFiles = @("src/main.tsx", "src/components/layout/*.tsx")
    }
    
    foreach ($pattern in $relatedFiles) {
        if (Test-Path $pattern) {
            $files = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue
            foreach ($file in $files) {
                $targetPath = Join-Path $backupDir $file.Name
                Copy-Item $file.FullName $targetPath -Force
                Write-Host "  📦 相关文件: $($file.Name)" -ForegroundColor Gray
            }
        }
    }
    
    Write-Host "✅ 文件备份完成: $backupDir" -ForegroundColor Green
    
} else {
    Write-Host "📦 执行完整备份..." -ForegroundColor Yellow
    .\simple_backup.ps1 -Tag "修复前_$Description"
}
