@echo off
echo ========================================
echo   AlMulhim Travel - Production Build
echo   (Website + Admin Dashboard + Backend)
echo ========================================
echo.

REM Step 0: Clean previous build and publish folders
echo [0/5] Cleaning previous build and publish directories...
if exist "e:\Projects\AlMulhim-Travel\backend\publish" (
    echo Cleaning publish folder...
    rmdir /s /q "e:\Projects\AlMulhim-Travel\backend\publish"
)
if exist "e:\Projects\AlMulhim-Travel\backend\src\APIs\bin" (
    echo Cleaning bin folder...
    rmdir /s /q "e:\Projects\AlMulhim-Travel\backend\src\APIs\bin"
)
if exist "e:\Projects\AlMulhim-Travel\backend\src\APIs\obj" (
    echo Cleaning obj folder...
    rmdir /s /q "e:\Projects\AlMulhim-Travel\backend\src\APIs\obj"
)
echo Clean completed!
echo.

REM Step 1: Build Frontend (Main Website)
echo [1/5] Building Frontend (React - Main Website)...
cd /d "e:\Projects\AlMulhim-Travel"
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
echo Frontend built successfully!
echo.

REM Step 2: Build Admin Dashboard
echo [2/5] Building Admin Dashboard (React)...
cd /d "e:\Projects\AlMulhim-Travel\admin"
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ERROR: Admin Dashboard build failed!
    pause
    exit /b 1
)
echo Admin Dashboard built successfully! (Output: backend/src/APIs/wwwroot/admin/)
echo.

REM Step 3: Publish Backend (includes wwwroot/admin from Step 2)
echo [3/5] Publishing Backend (.NET 8)...
cd /d "e:\Projects\AlMulhim-Travel\backend"
dotnet publish src/APIs/APIs.csproj -c Release -o ./publish
if %ERRORLEVEL% neq 0 (
    echo ERROR: Backend publish failed!
    pause
    exit /b 1
)
echo Backend published successfully!
echo.

REM Step 3.5: Removed hardcoded appsettings generation
echo [3.5/5] Using appsettings.Production.json from source directory...
echo.

REM Step 4: (Removed) Frontend is automatically published by dotnet publish because Vite outputs directly to backend/src/APIs/wwwroot
echo [4/5] Main Frontend already included in Backend publish!
echo.

REM Step 5: Done
echo [5/5] Build complete!
echo.
echo ========================================
echo   OUTPUT: e:\Projects\AlMulhim-Travel\backend\publish\
echo   Upload ALL contents of this folder to MonsterASP
echo.
echo   Main Site: https://almulhemtravel.com/
echo   Admin:     https://almulhemtravel.com/admin/
echo ========================================
echo.
