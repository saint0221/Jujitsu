#!/bin/bash
# 현재 스크립트가 위치한 디렉토리로 이동
cd "$(dirname "$0")"

# 환경 변수에 Homebrew 경로 추가
export PATH="/opt/homebrew/bin:$PATH"

echo "==========================================="
echo "주짓수 코리아 허브 - 로컬 서버를 준비 중입니다..."
echo "서버 종료: 이 터미널 창을 닫아주세요."
echo "==========================================="

# node_modules가 없으면 설치 시도
if [ ! -d "node_modules" ]; then
    echo "의존성 패키지를 설치하는 중입니다 (최초 1회)..."
    npm install
fi

# npm run dev 실행 (브라우저 자동 열기 시도)
npm run dev -- --open
