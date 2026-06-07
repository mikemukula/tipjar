# G$ Tip Jar

A creator tipping platform built for the **GoodDollar** ecosystem on **Celo**. Tip Jar lets digital creators set up a public tipping page so fans can support them with **G$** — GoodDollar's daily Universal Basic Income token.

## Overview

Tip Jar is a full-stack web app with two sides:

**Creator dashboard** — manage your profile, track earnings, and share tipping assets.

- Set display name, handle (`tip.gd/username`), bio, and social links
- View analytics: total tips, tip count, and average tip
- Copy your tipping link, download a QR code, or embed a widget on your site
- Browse a ledger of recent tips and fan messages

**Public tipping page** — what fans see when they visit your link.

- Choose a preset amount (10, 50, 100, 500 G$) or enter a custom amount
- Add an optional name and message
- Send a tip (currently simulated in this prototype)

The long-term vision is **wallet-to-wallet G$ transfers** via **GoodWallet** and **WalletConnect** on Celo, with zero platform fees. The current build is a polished UI and API scaffold; blockchain integration is planned.

## Tech Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Frontend | React 19, Vite, Lucide icons, hash-based routing |
| Backend  | Express.js, CORS                                |
| Storage  | Local `database.json` (profiles + tip ledger)   |

## Project Structure

```
tipjar/
├── frontend/          # React + Vite app (Tipping Studio UI)
│   └── src/
│       ├── App.jsx
│       └── components/
│           ├── DashboardView.jsx   # Creator dashboard
│           ├── TipPageView.jsx     # Public tipping page
│           └── Sidebar.jsx
└── backend/
    ├── server.js      # Express API
    └── database.json  # Created on first run
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### 1. Start the backend

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5001`.

### 2. Start the frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## API Endpoints

| Method | Endpoint       | Description              |
| ------ | -------------- | ------------------------ |
| GET    | `/api/profile` | Get creator profile      |
| POST   | `/api/profile` | Create or update profile |
| GET    | `/api/tips`    | List all tips            |
| POST   | `/api/tips`    | Record a new tip         |

## Routes

The frontend uses hash-based routing:

| Route                    | Description                    |
| ------------------------ | ------------------------------ |
| `#/`                     | Creator dashboard              |
| `#/preview`              | Live preview of tipping page   |
| `#/how-it-works`         | Product info and FAQ           |
| `#/tip/:username`        | Standalone public tipping page |
| `#/widget/:username`     | Embeddable widget view         |

## How It Works (Planned Flow)

1. **Register your handle** — Secure a tipping handle like `tip.gd/name` (on-chain registry in production).
2. **Distribute and share** — Use your QR code on streams or embed the widget on your site.
3. **Earn peer-to-peer** — Fans tip in G$ from GoodWallet; transfers go wallet-to-wallet on Celo with no platform fees.

## License

MIT
