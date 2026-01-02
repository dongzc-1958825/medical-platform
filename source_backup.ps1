# source_backup.ps1 - 源代码专用备份
param(
    [ValidateSet("quick", "full")]
    [string]$Mode = "quick",
    
    [string]$Description = "",
    
    [switch]$ListOnly
)

# 配置
$CONFIG_FILE = "source_backup_config.json"
$BACKUP_ROOT = "source_backups"

function Write-Info($message) { Write-Host "ℹ️  $message" -ForegroundColor Cyan }
function Write-Success($message) { Write-Host "✅ $message" -ForegroundColor Green }
function Write-Warning($message) { Write-Host "⚠️  $message" -ForegroundColor Yellow }
function Write-Error($message) { Write-Host "❌ $message" -ForegroundColor Red }
function Write-Detail($message) { Write-Host "    $message" -ForegroundColor Gray }

Write-Host ""
Write-Host "🏥 众创医案平台 - 源代码备份系统" -ForegroundColor Cyan
Write-Host "=========================================="
Write-Host "模式: $Mode"
Write-Host "时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host ""

# 1. 检查配置文件
if (-not (Test-Path $CONFIG_FILE)) {
    Write-Error "找不到配置文件: $CONFIG_FILE"
    Write-Info "请先创建 source_backup_config.json"
    exit 1
}

$config = Get-Content $CONFIG_FILE -Raw | ConvertFrom-Json
Write-Success "加载配置: $($config.project_name) v$($config.backup_system_version)"

# 2. 确定备份范围
$backupScope = @()
switch ($Mode) {
    "quick" { 
        $scopeConfig = $config.backup_options.quick
        $backupScope = $scopeConfig.includes
        Write-Info "快速备份模式: $($scopeConfig.description)"
    }
    "full" { 
        $scopeConfig = $config.backup_options.full
        $backupScope = $scopeConfig.includes
        Write-Info "完整备份模式: $($scopeConfig.description)"
    }
}

# 3. 列出要备份的文件
Write-Host ""
Write-Host "📋 将备份以下内容:" -ForegroundColor Magenta
Write-Host "------------------------------------------"

$allFilesToBackup = @()
foreach ($category in $backupScope) {
    Write-Host ""
    Write-Host "📁 类别: $category" -ForegroundColor Green
    
    $patterns = $config.critical_source_files.$category
    if (-not $patterns) {
        Write-Warning "  配置中未找到类别: $category"
        continue
    }
    
    foreach ($pattern in $patterns) {
        if ($pattern.EndsWith("/")) {
            # 目录模式
            $dir = $pattern.TrimEnd('/')
            if (Test-Path $dir) {
                $files = Get-ChildItem -Path $dir -File -Recurse -Include "*.tsx", "*.ts", "*.js", "*.jsx", "*.json", "*.css", "*.scss" -ErrorAction SilentlyContinue
                foreach ($file in $files) {
                    # 排除检查
                    $exclude = $false
                    foreach ($excludePattern in $config.exclude_patterns) {
                        if ($file.FullName -like "*$excludePattern*") {
                            $exclude = $true
                            break
                        }
                    }
                    
                    if (-not $exclude) {
                        $relativePath = Resolve-Path -Path $file.FullName -Relative
                        $allFilesToBackup += $relativePath
                        Write-Detail "  + $relativePath"
                    }
                }
            }
        } else {
            # 文件模式
            if (Test-Path $pattern) {
                $files = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue
                foreach ($file in $files) {
                    $relativePath = Resolve-Path -Path $file.FullName -Relative
                    $allFilesToBackup += $relativePath
                    Write-Detail "  + $relativePath"
                }
            }
        }
    }
}

# 如果只是列出，就退出
if ($ListOnly) {
    Write-Host ""
    Write-Success "列出完成，共 $($allFilesToBackup.Count) 个文件"
    exit 0
}

# 4. 执行备份
Write-Host ""
Write-Host "🚀 开始备份..." -ForegroundColor Magenta

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFolder = "${timestamp}_${Mode}"
if ($Description) {
    $backupFolder = "${backupFolder}_$($Description.Replace(' ', '_'))"
}

$backupPath = Join-Path $BACKUP_ROOT $backupFolder
New-Item -ItemType Directory -Path $backupPath -Force | Out-Null

# 复制文件
$successCount = 0
$allFilesToBackup = $allFilesToBackup | Sort-Object -Unique
foreach ($file in $allFilesToBackup) {
    try {
        $sourcePath = $file
        $targetPath = Join-Path $backupPath $file
        $targetDir = Split-Path $targetPath -Parent
        
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        Copy-Item $sourcePath $targetPath -Force
        $successCount++
    }
    catch {
        Write-Warning "  备份失败: $file"
    }
}

# 5. 完成
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Success "备份完成!"
Write-Host "备份位置: $backupPath" -ForegroundColor Yellow
Write-Host "备份文件: $successCount 个" -ForegroundColor Yellow
Write-Host "备份大小: $([math]::Round((Get-ChildItem $backupPath -Recurse | Measure-Object Length -Sum).Sum / 1KB, 2)) KB" -ForegroundColor Yellow

# 6. 清理旧备份（保留最近5个）
Write-Host ""
Write-Host "🧹 清理旧备份..." -ForegroundColor Magenta

$allBackups = Get-ChildItem $BACKUP_ROOT -Directory | Sort-Object CreationTime -Descending
if ($allBackups.Count -gt 5) {
    $oldBackups = $allBackups | Select-Object -Skip 5
    foreach ($old in $oldBackups) {
        Write-Detail "  删除: $($old.Name)"
        Remove-Item $old.FullName -Recurse -Force -ErrorAction SilentlyContinue
    }
    Write-Success "已清理 $($oldBackups.Count) 个旧备份"
}

Write-Host ""
