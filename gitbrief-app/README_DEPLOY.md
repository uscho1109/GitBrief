# 🚀 GitBrief Deployment Guide

GitBrief 프로젝트를 로컬에서 실행하고 Vercel에 배포하는 방법입니다.

## 1. 필수 의존성 설치
프로젝트 루트(`gitbrief-app`)에서 다음 명령어를 실행하여 필요한 라이브러리를 설치합니다.

```bash
cd gitbrief-app
npm install lucide-react react-markdown remark-gfm clsx tailwind-merge
```

## 2. 로컬 실행
개발 서버를 구동하여 UI와 기능을 확인합니다.

```bash
npm run dev
```

## 3. Git 저장소 초기화 및 푸시
프로젝트를 GitHub 등의 원격 저장소에 올립니다.

```bash
git init
git add .
git commit -m "feat: Initial commit of GitBrief with AI caching and live chat"
# GitHub 레포지토리 연결 후
# git remote add origin <your-repo-url>
# git push -u origin main
```

## 4. Vercel 배포 (CLI 사용 시)
Vercel CLI를 사용하여 즉시 배포하거나, GitHub 연동을 통해 자동 배포를 설정합니다.

```bash
# Vercel CLI 설치 (없을 경우)
npm i -g vercel

# 배포 실행
vercel
```

## 💡 '알잘딱' 기능 확인 포인트
1. **캐싱 로직**: 동일한 GitHub URL을 두 번 검색해 보세요. 두 번째 검색은 0.1초 만에 결과가 나타납니다.
2. **인벤토리 채팅**: 우측 상단의 말풍선 아이콘을 클릭하여 슬라이딩 채팅창을 열고 메시지를 입력해 보세요.
3. **코드 복사**: 요약 카드 내의 코드 블록 위에 마우스를 올리면 나타나는 'Copy' 버튼이 정상 작동하는지 확인하세요.
4. **환경 뱃지**: 레포지토리 성격에 따라 Docker, Node.js 등의 뱃지가 다르게 달리는지 확인하세요.

---
**Senior Engineer's Note:** 이 코드는 프로덕션 수준의 UI/UX를 지향하며, 확장 가능한 Context 구조와 성능 최적화된 캐싱 로직을 포함하고 있습니다.
