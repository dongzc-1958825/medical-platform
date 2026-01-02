# simple_complete_backup.ps1 - 简化完整备份
param([string]$Tag = "")

Write-Host "🏥 众创医案平台 - 简化备份系统" -ForegroundColor Cyan
Write-Host "=========================================="

# 创建备份目录
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "complete_backups\backup_${timestamp}"
if ($Tag) { $backupDir = "${backupDir}_$Tag" }

New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

Write-Host "备份目录: $backupDir" -ForegroundColor Yellow

# 关键文件列表（简化版）
$criticalFiles = @(
    # 配置文件
    "vite.config.js",
    "package.json",
    "tsconfig.json",
    "tailwind.config.js",
    "index.html",
    
    # 核心源代码
    "src/App.tsx",
    "src/main.tsx",
    
    # 布局组件
    "src/components/layout/DesktopLayout.tsx",
    "src/components/layout/MobileLayout.tsx",
    "src/components/layout/MainLayout.tsx",
    "src/components/layout/MobileBottomNav.tsx",
    
    # 页面文件
    "src/pages/HomePage.tsx",
    "src/pages/CasesPage.tsx",
    "src/pages/CommunityPage.tsx",
    "src/pages/LoginPage.tsx",
    "src/pages/ProfilePage.tsx",
    
    # 服务与上下文
    "src/services/authService.tsx",
    "src/contexts/AuthContext.tsx"
)

Write-Host "`n🔍 开始备份文件..." -ForegroundColor Cyan

$backupCount = 0
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        $targetPath = Join-Path $backupDir $file
        $targetDir = Split-Path $targetPath -Parent
        
        # 创建目录
        if (-not (Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        
        # 复制文件
        Copy-Item $file $targetPath -Force
        $backupCount++
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  $file (不存在)" -ForegroundColor Yellow
    }
}

# 备份摘要
$summary = @"
众创医案平台备份摘要
==================
备份时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
备份标签: $(if ($Tag) { $Tag } else { "无" })
备份文件数: $backupCount
备份目录: $backupDir

备份的文件:
"@

# 添加文件列表
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        $summary += "`n- $file"
    }
}

$summary | Out-File (Join-Path $backupDir "!备份摘要.txt") -Encoding UTF8

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "✅ 备份完成!" -ForegroundColor Green
Write-Host "备份到: $backupDir" -ForegroundColor Yellow
Write-Host "文件数: $backupCount" -ForegroundColor Yellow

# 显示备份大小
$size = (Get-ChildItem $backupDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1KB
Write-Host ("大小: {0:N2} KB" -f $size) -ForegroundColor Yellow

# 清理旧备份（保留最近3个）
Write-Host "`n🧹 清理旧备份..." -ForegroundColor Magenta
if (Test-Path "complete_backups") {
    $allBackups = Get-ChildItem "complete_backups" -Directory | Sort-Object CreationTime -Descending
    if ($allBackups.Count -gt 3) {
        $oldBackups = $allBackups | Select-Object -Skip 3
        foreach ($old in $oldBackups) {
            Remove-Item $old.FullName -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "  删除: $($old.Name)" -ForegroundColor Gray
        }
    }
}

