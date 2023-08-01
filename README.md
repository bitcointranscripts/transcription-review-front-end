![Bitcoin Transciption Review](./public/btc-transcripts-landscape.png)

This repo hosts the frontend for transaction review website. Transcripts are generated from [TSTBTC](https://github.com/bitcointranscripts/tstbtc), then sent to the [transcrition review backend](https://github.com/bitcointranscripts/transcription-review-backend). You'll be able to see the results here.

In order to edit a transcript, you'll need to give auth permissions to access fork and repo and open a PR on your behalf (we did our best to minimize the requirements).

## Getting Started

1. Clone the repo
2. Install dependencies
3. Update environment variables
4. Run the app

### Installing

1. Clone the repo

```sh
git clone
```

2. Install dependencies

```sh
yarn
# or
npm install
```

3. Update environment variables

```sh
cp .env.local.example .env.local
```

As mentioned above you'll need to need GITHUB_ID and GITHUB_SECRET if you aren't pointing this front end towards a hosted backend.

4. Run the app

```sh
yarn dev
# or
npm run dev
```

If you are interested in running the backend app, checkout the [build instructions there](https://github.com/bitcointranscripts/transcription-review-backend/blob/main/README.md).
