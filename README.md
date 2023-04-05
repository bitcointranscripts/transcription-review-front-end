## Transcription Review Frontend

This repo house the frontend for transaction review website

### Getting Started

1. Clone the repo
2. Install dependencies
3. Update environment variables
4. Run the app

### Prerequisites

- Node.js
- Yarn
- Docker (optional)

### Installing

1. Clone the repo

```sh
git clone
```

2. Install dependencies

```sh
yarn
```

3. Update environment variables

```sh
cp .env.example .env && cp .env.local.example .env.local
```

4. Run the app

```sh
yarn dev
```

5. You can also run with Docker for development

```sh
docker build -t transcription-review-frontend .
docker run -p 3000:3000 transcription-review-frontend
```
6. Here is the backend that powers it: 
   [https://github.com/bitcointranscripts/transcription-review-backend](https://github.com/bitcointranscripts/transcription-review-backend)
