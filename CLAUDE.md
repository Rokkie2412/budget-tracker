@AGENTS.md

# Instructions for Claude

## Project Context

- **Framework**: Expo SDK 57 (React Native 0.86) with Expo Router (App Router).
- **Styling**: NativeWind v4 (Tailwind CSS v3).
- **Package Manager**: Always use `pnpm`.
- **State & Form**: Zustand, Formik + Yup, TanStack React Query.
- **Storage**: `expo-secure-store` for sensitive data, `react-native-mmkv` for general cache.

## Coding Guidelines

- Written in TypeScript with strict typing.
- Use path aliases for imports: `@/` for `./src` and `@/assets` for `./assets`.
- Write functional React components using default exports for screens in `app/`.
- Styling must use `className="..."` with Tailwind utility classes.

## Commands

- Start Expo Dev Server: `npx expo start --clear`
- Install dependencies: `pnpm add <package>`
- Install dev dependencies: `pnpm add -D <package>`
- Run Android/iOS: `pnpm android` / `pnpm ios`
