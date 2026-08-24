@echo off
echo ========================================
echo Restarting IIS Application Pool
echo ========================================

REM Restart the default application pool (change name if needed)
echo Stopping Application Pool...
%windir%\system32\inetsrv\appcmd stop apppool /apppool.name:"DefaultAppPool"

timeout /t 3 /nobreak

echo Starting Application Pool...
%windir%\system32\inetsrv\appcmd start apppool /apppool.name:"DefaultAppPool"

echo.
echo ========================================
echo Application Pool Restarted Successfully!
echo ========================================
echo.
echo Now test the WhatsApp bot with a message.
echo Check logs at: https://almulhimtravel.com/logs/ai-debug.log
echo.
pause
