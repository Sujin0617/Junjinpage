우리의 기록 PWA 배포 방법

1. 이 폴더 전체를 GitHub 저장소에 업로드합니다.
2. GitHub 저장소 > Settings > Pages
3. Build and deployment에서 "Deploy from a branch" 선택
4. Branch는 main / (root) 선택 후 Save
5. 잠시 후 생성되는 https://아이디.github.io/저장소이름/ 주소로 접속합니다.

설치 방법
- Android Chrome: 우측 상단 메뉴 > 앱 설치 또는 홈 화면에 추가
- iPhone Safari: 공유 버튼 > 홈 화면에 추가

중요
- PWA 설치 기능은 HTTPS에서 동작합니다. GitHub Pages는 HTTPS라서 괜찮습니다.
- Supabase 기록/사진/댓글은 온라인 연결이 필요합니다.
- service-worker.js는 앱 화면 파일을 캐시해 빠르게 다시 열도록 합니다.
