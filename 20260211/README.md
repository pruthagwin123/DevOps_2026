# Personal Finance Tracker

A simple full-stack app for tracking income and expenses with a minimal dashboard.

## Quick Start

1. Install dependencies

- `npm install --prefix server`
- `npm install --prefix client`

2. Start the backend

- `npm --prefix server start`

3. Start the frontend

- `npm --prefix client run dev`

## Login

- Enter a username and 4-digit PIN to access the app.
- If you already had data before login was added, use `demo` / `1234`.

## Tests

- `npm test`

## Build

- `npm run build`

## API

- `POST /income`
- `POST /expense`
- `POST /transaction`
- `GET /summary`
- `GET /transactions`
