#!/bin/bash
# 현재 스크립트가 위치한 디렉토리로 이동
cd "$(dirname "$0")"

# 환경 변수에 Homebrew 경로 추가
export PATH="/opt/homebrew/bin:$PATH"

echo "==========================================="
echo "GitHub 주짓수 에이전트 - 소스 업로드 도구"
echo "==========================================="

# 커밋 메시지 인자 확인
commit_msg="$1"

if [ -z "$commit_msg" ]; then
    echo "커밋 메시지를 입력하세요 (비워두면 시스템 날짜로 저장됩니다):"
    read -r commit_msg
fi

if [ -z "$commit_msg" ]; then
    commit_msg="Auto update: $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo "🚀 GitHub로 업로드 중... [$commit_msg]"

git add .
git commit -m "$commit_msg"
git push

echo "==========================================="
echo "✅ 업로드 성공!"
echo "곧 창이 닫힙니다."
echo "==========================================="

sleep 2
