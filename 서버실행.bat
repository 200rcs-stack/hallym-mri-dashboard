@echo off
title Hallym MRI Protocol Portal
echo ===================================================
echo Hallym MRI Protocol Portal - Mobile Server Starter
echo ===================================================
echo.
echo 개발 서버를 모바일 접속 허용 모드로 실행 중입니다...
echo (핸드폰에서 QR코드로 접속하시려면 이 까만 창을 닫지 마세요!)
echo.
call npm run dev -- --host
pause
