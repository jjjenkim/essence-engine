# 본질엔진 (Essence Engine)

혼란스러운 생각을 7단계로 분석해서 **본질 → 실행**으로 이어주는 웹 앱입니다.

## 로컬 실행

이 프로젝트는 정적 `index.html` + Vercel Serverless Function(`api/generate.js`) 조합입니다.

1) 환경변수 설정

```bash
cp .env.example .env
```

`.env`에 `GEMINI_API_KEY`를 넣으세요.

2) 로컬 테스트(선택)

Vercel CLI가 있다면:

```bash
vercel dev
```

## 배포 (Vercel)

Vercel 프로젝트 환경변수에 `GEMINI_API_KEY`를 설정하면 동작합니다.

