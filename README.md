# Police Control Panel

경찰차 내부 제어장치를 참고해 만든 정방형 웹앱입니다. iPhone, iPad, 데스크톱에서 세로/가로 모드와 관계없이 패널이 1:1 비율로 유지됩니다.

## Features

- 현실형 어두운 제어 패널 UI
- 버튼별 토글 상태와 LED 점등
- 중앙 상태 표시창과 최근 조작 로그
- Web Audio API 기반 짧은 버튼 피드백
- GitHub Pages 배포 설정 포함

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

`main` 브랜치에 push하면 GitHub Actions가 `dist`를 빌드해 GitHub Pages로 배포합니다.

예상 배포 URL:

```text
https://qorky01.github.io/police-control-panel/
```
