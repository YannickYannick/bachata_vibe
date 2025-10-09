# Script PowerShell de démarrage pour le mode développement
# Démarre l'API Django et le frontend React en parallèle

Write-Host "🚀 Démarrage du mode développement BachataVibe" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "manage.py")) {
    Write-Host "❌ Erreur: manage.py non trouvé. Assurez-vous d'être dans le répertoire racine du projet." -ForegroundColor Red
    exit 1
}

# Fonction pour nettoyer les processus à la sortie
function Stop-AllServers {
    Write-Host ""
    Write-Host "🛑 Arrêt des serveurs..." -ForegroundColor Yellow
    
    if ($djangoJob) { Stop-Job $djangoJob -ErrorAction SilentlyContinue }
    if ($reactJob) { Stop-Job $reactJob -ErrorAction SilentlyContinue }
    
    Get-Job | Remove-Job -Force -ErrorAction SilentlyContinue
    exit 0
}

# Capturer Ctrl+C
$null = Register-EngineEvent PowerShell.Exiting -Action { Stop-AllServers }

try {
    Write-Host "📡 Démarrage de l'API Django sur http://127.0.0.1:8000..." -ForegroundColor Blue
    
    # Démarrer Django en arrière-plan
    $djangoJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        python manage.py runserver --settings=bachata_site.settings_test
    }
    
    # Attendre que Django démarre
    Start-Sleep -Seconds 3
    
    Write-Host "⚛️  Démarrage du frontend React sur http://localhost:3000..." -ForegroundColor Cyan
    
    # Démarrer React en arrière-plan
    $reactJob = Start-Job -ScriptBlock {
        Set-Location "$using:PWD\frontend"
        npm start
    }
    
    Write-Host ""
    Write-Host "✅ Serveurs démarrés avec succès !" -ForegroundColor Green
    Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "🔌 API: http://127.0.0.1:8000" -ForegroundColor White
    Write-Host ""
    Write-Host "Appuyez sur Ctrl+C pour arrêter les serveurs" -ForegroundColor Yellow
    
    # Surveiller les jobs
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Vérifier si les jobs sont toujours en cours
        if ($djangoJob.State -ne "Running") {
            Write-Host "⚠️  Le serveur Django s'est arrêté" -ForegroundColor Red
            break
        }
        
        if ($reactJob.State -ne "Running") {
            Write-Host "⚠️  Le serveur React s'est arrêté" -ForegroundColor Red
            break
        }
    }
    
} catch {
    Write-Host "❌ Erreur lors du démarrage: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    Stop-AllServers
}
