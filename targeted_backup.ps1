# targeted_backup.ps1 - 针对性备份（只备份要修改的文件）
param(
    [string]$BackupName = "targeted_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
)

Write-Host "=== 针对性文件备份 ===" -ForegroundColor Green
Write-Host "只备份即将修改的关键文件" -ForegroundColor Cyan
Write-Host ("时间: " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")) -ForegroundColor White

# 创建备份目录
$backupRoot = "targeted_backups"
if (-Not (Test-Path $backupRoot)) {
    New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null
}

$backupPath = Join-Path $backupRoot $BackupName
New-Item -ItemType Directory -Force -Path $backupPath | Out-Null

# ========== 只备份这些关键文件 ==========
$criticalFiles = @{
    # 配置文件
    "vite.config.ts" = "Vite配置 - 需要修改base路径";
    
    # 核心路由文件
    "src/App.tsx" = "主应用组件 - 需要修复路由配置";
    
    # 布局组件
    "src/components/layout/DesktopLayout.tsx" = "桌面布局 - 需要完善";
    "src/components/layout/MobileLayout.tsx" = "移动布局 - 需要完善";
    "src/components/layout/MobileBottomNav.tsx" = "移动底部导航 - 需要检查";
    
    # 服务文件
    "src/services/authService.tsx" = "认证服务 - 已修复但需确认";
    
    # 页面文件
    "src/pages/ProfilePage.tsx" = "个人中心 - 已修复但需确认";
    "src/pages/CasesPage.tsx" = "医案列表 - 可能需要创建";
    "src/pages/HomePage.tsx" = "首页 - 可能需要创建";
    "src/pages/LoginPage.tsx" = "登录页 - 可能需要创建";
    
    # 移动端页面
    "src/pages/mobile/MobileCasesPage.tsx" = "移动医案列表 - 可能需要创建";
    "src/pages/mobile/MobileLoginPage.tsx" = "移动登录页 - 可能需要创建";
    
    # 类型定义
    "src/shared/types/user.ts" = "用户类型定义 - 已统一";
}

# 执行备份
Write-Host "`n备份关键文件..." -ForegroundColor Yellow
$backupCount = 0
$skippedCount = 0

foreach ($file in $criticalFiles.Keys) {
    if (Test-Path $file) {
        $dest = Join-Path $backupPath $file
        $destDir = Split-Path $dest -Parent
        
        if (-not (Test-Path $destDir)) { 
            New-Item -ItemType Directory $destDir -Force 
        }
        
        Copy-Item $file $dest -Force
        $backupCount++
        Write-Host "  ✅ $file" -ForegroundColor Green
        Write-Host "     备注: $($criticalFiles[$file])" -ForegroundColor Gray
    } else {
        $skippedCount++
        Write-Host "  ⚠️  $file (不存在)" -ForegroundColor Yellow
        Write-Host "     状态: $($criticalFiles[$file])" -ForegroundColor Gray
    }
}

# 备份信息
$info = @{
    "project" = "众创医案平台";
    "backup_time" = (Get-Date -Format "yyyy-MM-dd HH:mm:ss");
    "files_backed_up" = $backupCount;
    "files_skipped" = $skippedCount;
    "purpose" = "路由分离修复前的关键文件备份";
    "notes" = "只备份即将修改的文件，避免不必要的存储";
}
$info | ConvertTo-Json | Out-File (Join-Path $backupPath "backup_info.json") -Encoding UTF8

Write-Host "`n📊 备份统计:" -ForegroundColor Cyan
Write-Host "  成功备份: $backupCount 个文件" -ForegroundColor White
Write-Host "  跳过文件: $skippedCount 个（不存在）" -ForegroundColor White
Write-Host "  备份目录: $backupPath" -ForegroundColor White
Write-Host "`n✅ 针对性备份完成！" -ForegroundColor Green
Write-Host "  只备份了真正需要修改的文件，节省空间" -ForegroundColor Gray
