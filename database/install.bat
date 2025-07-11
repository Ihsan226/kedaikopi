@echo off
REM ====== INSTALL DATABASE KEDAI KOPI - WINDOWS BATCH ======
REM Script otomatis untuk install database di XAMPP Windows
REM Pastikan XAMPP sudah terinstall dan MySQL running

echo ================================================
echo    KEDAI KOPI DATABASE INSTALLER
echo ================================================
echo.

REM Check if XAMPP is installed
if not exist "C:\xampp\mysql\bin\mysql.exe" (
    echo ❌ ERROR: XAMPP tidak ditemukan!
    echo    Silakan install XAMPP terlebih dahulu dari:
    echo    https://www.apachefriends.org/
    echo.
    pause
    exit /b 1
)

echo ✅ XAMPP ditemukan...

REM Set MySQL path
set MYSQL_PATH="C:\xampp\mysql\bin\mysql.exe"
set MYSQL_ADMIN="C:\xampp\mysql\bin\mysqladmin.exe"

REM Check if MySQL is running
echo 🔍 Checking MySQL status...
%MYSQL_ADMIN% -u root ping >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: MySQL tidak berjalan!
    echo    Silakan start MySQL dari XAMPP Control Panel
    echo.
    pause
    exit /b 1
)

echo ✅ MySQL berjalan...

REM Get current directory
set CURRENT_DIR=%~dp0
set DB_DIR=%CURRENT_DIR%

echo 📁 Database files directory: %DB_DIR%

REM Check if SQL files exist
if not exist "%DB_DIR%kedai_kopi.sql" (
    echo ❌ ERROR: File kedai_kopi.sql tidak ditemukan!
    echo    Pastikan file ada di folder: %DB_DIR%
    pause
    exit /b 1
)

echo ✅ SQL files ditemukan...

REM Install database
echo.
echo 🚀 Memulai instalasi database...
echo.

REM Step 1: Create database
echo 📝 Step 1: Membuat database kedai_kopi...
%MYSQL_PATH% -u root -e "CREATE DATABASE IF NOT EXISTS kedai_kopi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if errorlevel 1 (
    echo ❌ ERROR: Gagal membuat database!
    pause
    exit /b 1
)
echo ✅ Database kedai_kopi berhasil dibuat

REM Step 2: Import main schema
echo 📝 Step 2: Import schema database...
%MYSQL_PATH% -u root kedai_kopi < "%DB_DIR%kedai_kopi.sql"
if errorlevel 1 (
    echo ❌ ERROR: Gagal import schema!
    pause
    exit /b 1
)
echo ✅ Schema berhasil diimport

REM Step 3: Import test data (optional)
echo.
set /p IMPORT_TEST_DATA="📝 Import data sample? (y/n): "
if /i "%IMPORT_TEST_DATA%"=="y" (
    if exist "%DB_DIR%test_data.sql" (
        echo 📝 Step 3: Import data sample...
        %MYSQL_PATH% -u root kedai_kopi < "%DB_DIR%test_data.sql"
        if errorlevel 1 (
            echo ⚠️  WARNING: Gagal import data sample (tapi database tetap bisa digunakan)
        ) else (
            echo ✅ Data sample berhasil diimport
        )
    ) else (
        echo ⚠️  File test_data.sql tidak ditemukan, skip import data sample
    )
)

REM Verification
echo.
echo 🔍 Verifikasi instalasi...
%MYSQL_PATH% -u root -e "USE kedai_kopi; SHOW TABLES;" > temp_tables.txt 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Database tidak dapat diakses!
    pause
    exit /b 1
)

REM Count tables
for /f %%i in ('type temp_tables.txt ^| find /c /v ""') do set TABLE_COUNT=%%i
del temp_tables.txt >nul 2>&1

if %TABLE_COUNT% LSS 10 (
    echo ⚠️  WARNING: Hanya %TABLE_COUNT% tabel ditemukan, mungkin ada masalah
) else (
    echo ✅ Ditemukan %TABLE_COUNT% tabel - instalasi berhasil!
)

REM Check data
echo 🔍 Checking sample data...
%MYSQL_PATH% -u root -e "USE kedai_kopi; SELECT COUNT(*) as products FROM products; SELECT COUNT(*) as categories FROM categories; SELECT COUNT(*) as users FROM users;" 2>nul

echo.
echo ================================================
echo    INSTALASI SELESAI!
echo ================================================
echo.
echo 🎉 Database kedai_kopi berhasil diinstall!
echo.
echo 📋 Informasi:
echo    • Database: kedai_kopi
echo    • Host: localhost
echo    • User: root
echo    • Password: (kosong)
echo.
echo 🌐 Akses aplikasi:
echo    • Web: http://localhost/kedaikopi
echo    • phpMyAdmin: http://localhost/phpmyadmin
echo    • API: http://localhost/kedaikopi/api
echo.
echo 👤 Default login admin:
echo    • Email: admin@kedaikopi.com
echo    • Password: password
echo.
echo 🔧 Next steps:
echo    1. Buka http://localhost/kedaikopi
echo    2. Test fitur-fitur website
echo    3. Customize sesuai kebutuhan
echo.

REM Open browser (optional)
set /p OPEN_BROWSER="🌐 Buka website di browser? (y/n): "
if /i "%OPEN_BROWSER%"=="y" (
    start http://localhost/kedaikopi
    start http://localhost/phpmyadmin
)

echo.
echo ✨ Happy coding!
echo.
pause
