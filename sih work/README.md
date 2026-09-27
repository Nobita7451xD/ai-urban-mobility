# Urban Intelligence — Mobility Command

A responsive AI-assisted public transport fleet command center built with Next.js, React, TypeScript, Recharts, Framer Motion, Leaflet and OpenStreetMap-compatible tiles. The app uses centralized mock data and runs without credentials or a backend.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js. For a production build, run `npm run build` and `npm start`.

## Deploy publicly on Render

This repository includes a `render.yaml` Blueprint for a free Node.js web service. Push the repository to GitHub, then in Render choose **New + → Blueprint** and connect the repository. Render will install the locked dependencies, build the Next.js app, and start it. The service receives a public `onrender.com` URL. Free services may spin down while idle.

The dashboard currently uses seeded demo fleet data and a local simulation; it does not require API keys or a backend service.

## Main areas

- Overview: live fleet KPIs, ridership and route health
- Live Fleet: filterable vehicle list and Leaflet map
- AI Intelligence: predictions, analytics and actionable recommendations
- Live Map: interactive route, vehicle, stop, congestion and incident layers
- Route Analytics: performance charts and route comparison
- Alerts: acknowledge and resolve incident records
- Fleet Management: vehicle, driver and maintenance views
- Settings: system health and notification preferences

Mock fleet data lives in `src/data.ts`; the interactive dashboard and reusable view components are in `src/app.tsx`, and the Leaflet map is in `src/leaflet-map.tsx`.
