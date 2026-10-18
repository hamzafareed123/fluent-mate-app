# FluentMate

FluentMate is a mobile app for practicing English. You can learn with daily lessons, practice speaking, and follow your progress.

## What you need

- Node.js and npm
- Expo Go on your phone, or an Android/iOS simulator
- A Supabase project for sign-in and app data

## Get started

1. Download this project and open its folder in a terminal.
2. Install the packages:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and add your Supabase project URL and anon key:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Start the app:

   ```bash
   npx expo start
   ```

5. Follow the terminal instructions to open the app on your phone or simulator.

## Useful commands

- `npm run start` — start Expo
- `npm run android` — open on Android
- `npm run ios` — open on iOS
- `npm run web` — open in a web browser
- `npm run lint` — check the code for common issues

## Project folders

- `app/` — app screens and navigation
- `components/` — reusable screen parts
- `lib/` — app helpers and Supabase setup
- `providers/` — shared sign-in and theme state
- `supabase/` — database setup and server functions

## Note

Keep your Supabase keys private. The anon key is intended for the app, but database access should be protected with Supabase security rules.
