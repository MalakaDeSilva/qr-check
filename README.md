# Fuel QR Release

A community site to help new vehicle owners in Sri Lanka get their fuel pass when the previous owner’s QR is still linked. New owners create a request and get a **shareable link**. Previous owners open the link, delete their QR on [fuelpass.gov.lk](https://fuelpass.gov.lk), and mark the request as released.

## Features

- **Create request** – Enter vehicle registration number, get a shareable link (optional message and email for notification).
- **Request page** – Single page with steps: “Open fuelpass.gov.lk” and “I’ve deleted the QR – mark as released.”
- **Public board** – Browse and search all requests by registration number (secondary way to find requests).

## Tech

- Next.js 14 (App Router)
- MongoDB Atlas
- Tailwind CSS
- Responsive (mobile and desktop)

## Setup

1. **Clone and install**

   ```bash
   cd qr-check
   npm install
   ```

2. **MongoDB Atlas**

   - Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
   - Create a database user and get the connection string.
   - (Optional) Create a database named `qr-release` or set `MONGODB_DB_NAME`.

3. **Environment**

   Copy the example env file and set your MongoDB URI:

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local`:

   ```
   MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority
   ```

4. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploy

- Set `MONGODB_URI` (and optionally `MONGODB_DB_NAME`) in your host’s environment (e.g. Vercel).
- Build: `npm run build` and `npm start`, or deploy to Vercel/Netlify with the same env.

## Disclaimer

This app does not modify fuelpass.gov.lk. Users must delete their QR on the government site themselves. This site only helps match requesters with previous owners and track “released” status.
