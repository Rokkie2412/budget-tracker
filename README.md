# Budget Tracker

A cross-platform budget tracker built with Expo and React Native. The app provides a mobile interface for recording transactions and viewing monthly summaries and reports. Its Expo API routes provide the backend, using MongoDB for persistence and JWTs for authentication.

## Tech stack

- Expo SDK 57, React Native, Expo Router, and TypeScript
- NativeWind and Gluestack UI
- Zustand for app state
- MongoDB with Mongoose
- Expo API routes deployed to Vercel
- EAS Build for Android and iOS binaries

## Requirements

- [Bun](https://bun.sh/) for installing dependencies and running project scripts
- An [Expo account](https://expo.dev/signup) for EAS builds
- Android Studio for local Android emulation, or Xcode on macOS for local iOS simulation
- A MongoDB database for running the backend

## Getting started

Install the locked dependencies and start Expo:

```bash
bun install --frozen-lockfile
bun run start
```

Use the Expo CLI menu to open the app on a connected device, Android emulator, or iOS simulator. The project uses file-based routing; app screens and API routes are under `src/app`.

Useful development commands:

```bash
bun run android
bun run ios
bun run web
bun run lint
```

## Backend API

Expo Router API route files live in `src/app/api`:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/login` | Authenticate a user and return a JWT |
| `POST` | `/api/addTransaction` | Add a transaction |
| `GET` | `/api/getTransactions` | Retrieve paginated transactions |
| `GET` | `/api/getMonthSummary` | Retrieve a monthly summary |
| `GET` | `/api/getMonthlyReport` | Retrieve monthly reports |

The app uses `EXPO_PUBLIC_API_URL` as the backend base URL in non-development builds. The EAS `preview` and `production` profiles currently point to:

```text
https://budget-tracker-five-pi-21.vercel.app
```

Local development uses the current origin for API requests. Configure the local database and encryption settings in an untracked `.env` file; never commit secrets:

```dotenv
MONGO_URI_DEV=<development MongoDB connection string>
MONGO_URI_PROD=<production MongoDB connection string>
ENCRYPTION_KEY=<32-byte encryption key>
STATIC_SALT=<stable salt used to hash user IDs>
```

Set the corresponding variables in Vercel for deployed API functions. The backend selects `MONGO_URI_PROD` in Vercel production and `MONGO_URI_DEV` otherwise. `ENCRYPTION_KEY` must be exactly 32 bytes. Keep server-only variables out of `EXPO_PUBLIC_*` variables, which are embedded in the app bundle.

## Deploy the backend to Vercel

The repository includes a Vercel configuration that builds the Expo API routes and routes requests to the server handler. On a new machine, authenticate and link this project to your Vercel project:

```bash
bunx vercel login
bunx vercel link
```

Add the backend environment variables to the Vercel project, then deploy:

```bash
bun run build
bunx vercel --prod
```

`bun run build` runs the API-only Expo export. Vercel also runs the configured build command when deploying from a connected Git repository.

> **Deployment protection:** If Vercel Deployment Protection is enabled for production, unauthenticated app clients will be blocked before reaching the API. Allow public access to the production deployment if the app needs to call it directly; continue to enforce user access through the API's login and JWT authentication.

## Build with EAS

Authenticate with Expo, then build the configured profile:

```bash
bunx eas-cli@latest login
```

Internal Android APK for testing:

```bash
bunx eas-cli@latest build --platform android --profile preview
```

Android production profile:

```bash
bunx eas-cli@latest build --platform android --profile production
```

Build for iOS or both platforms by changing the platform:

```bash
bunx eas-cli@latest build --platform ios --profile production
bunx eas-cli@latest build --platform all --profile production
```

Both Android profiles currently create internally distributed APKs. The production profile is not configured as a Google Play Store release. EAS uses the `preview` or `production` environment defined in `eas.json`; Android signing credentials are managed remotely by EAS.

## Project scripts

| Command | Description |
| --- | --- |
| `bun run start` | Start the Expo development server |
| `bun run android` | Start Expo for Android |
| `bun run ios` | Start Expo for iOS |
| `bun run web` | Start Expo for web |
| `bun run build` | Export the Expo API routes for backend deployment |
| `bun run lint` | Run Expo lint |
