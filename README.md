# GeoLab

A multi‑page SPA for geotechnical engineers to manage soil sample data and view regional geo news. Built with React, TypeScript, and Material-UI.

## Features

- **Samples Management**: Upload, filter, and analyze geological sample data with automatic calculations
- **News Feed**: Browse and manage geological science news articles
- **Dark/Light Theme**: Toggle between light and dark mode for comfortable viewing
- **Material-UI Components**: Clean, professional UI with responsive design

## Tech Stack

- React 18
- TypeScript
- Vite
# GeoLab

A small React + TypeScript app for managing geotechnical samples and reading related news. Uses Vite and Material-UI for a responsive, modern UI.

## Features

- Samples upload, edit, filter and summary statistics
- Per-row adjusted values with configurable correction and porosity
- News list with basic article management
- Light / dark theme toggle

## Tech Stack

- React 18
- TypeScript
- Vite
- Material-UI (MUI)

## Quick Start

Prerequisites:

- Node.js v16+ and npm or yarn

Install dependencies:

```bash
npm install
```

Run locally (development):

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Design choices

- Data model: in-memory arrays for simplicity; rows are identified by an `id` string.
- Two-state calculation model: the app maintains a live `samples` array and a `computed` snapshot. When "Auto Recalculate" is enabled, the snapshot follows changes immediately. When disabled, the snapshot only updates when the user clicks "Recalculate" — this prevents intermediate edits from affecting summary and adjusted values until explicitly confirmed.
- Defaults: missing Correction Factor or Porosity values are treated as defaults (see CSV section).
- UI: Material-UI components for fast iteration and consistent look-and-feel.

## CSV format (example)

Each line is a CSV row with the following columns:

- Sample ID
- Moisture (%)
- Dry Density (g/cm³)
- Correction Factor (%) — optional, defaults to 5
- Porosity (%) — optional, defaults to 30

Example rows:

```
001234-12,12.5,1.85,5,30
001234-13,9.8,1.92,,28
003212-01,15.2,1.77,6,31
```

Notes:

- If the Correction Factor or Porosity fields are empty, the app will use the default values of 5% and 30% respectively.
- The CSV parser expects simple comma-separated values with no quoted fields.

## Where to look in the code

- Samples UI and logic: [src/components/SamplesPage.tsx](src/components/SamplesPage.tsx)
- News UI: [src/components/NewsPage.tsx](src/components/NewsPage.tsx)
- App layout and routing: [src/App.tsx](src/App.tsx)
