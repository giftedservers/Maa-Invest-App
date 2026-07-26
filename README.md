# MAA Invest — Mobile App

A cross-platform (Android + iOS) mobile app for **MAA Invest**, built with
**Expo (React Native + TypeScript)**. It matches the look of the provided
mockup (deep-green branding, wallet, savings goals, chamas/groups,
investments) and talks directly to your existing PHP REST API at
`invest.maawebhost.co.ke/api`.

## What's included

- Auth: Welcome/splash, Login, Register, local 4-digit PIN lock
- Home dashboard: portfolio value, trend chart, holdings, quick actions
- Wallet: balance, Add Money (M-Pesa/Bank/Card), Withdraw, transaction history
- Save: savings goals list + create goal
- Groups: browse/join chamas, group detail with contribute
- Invest: browse investment products, buy flow (with premium-plan gating)
- Profile & More: account info, KYC status, logout

All screens call the real endpoints documented in your backend's
`api/API_REFERENCE.md` — nothing here is mocked data (aside from the small
home-screen trend line, since the API doesn't yet return historical
portfolio snapshots).

## 1. Point the app at your backend

Edit `src/api/client.ts`:

```ts
export const API_BASE_URL = 'https://invest.maawebhost.co.ke/api';
```

Make sure your backend's `database/migration_api_tokens.sql` has been run
and the `api/` folder is deployed, per your existing README.

## 2. Install & run locally (for previewing while you develop)

You'll need [Node.js](https://nodejs.org) 18+ and the **Expo Go** app on
your phone (App Store / Play Store).

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS) to run the
app on your device — no Android Studio / Xcode required for development.

## 3. Push this to GitHub — GitHub builds the installable app for you

This repo includes `.github/workflows/build-android.yml`, which builds a
real Android `.apk` automatically on every push to `main` — entirely on
GitHub's own servers. **No Expo account, no token, nothing to sign up
for.** GitHub's runners already have Java and the Android SDK installed,
so the workflow just turns the project into a plain Android project and
builds it with Gradle, the same way any native Android app is built.

```bash
git init
git add .
git commit -m "Initial commit: MAA Invest mobile app"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

(Create the empty repo on GitHub first, without a README, so there's no
merge conflict on first push.)

**That's it — push, then:**

1. Go to the **Actions** tab on your repo → you'll see the build running
   (takes a few minutes)
2. When it's green, go to the **Releases** section (right sidebar of the
   repo homepage, or `github.com/<you>/<repo>/releases`)
3. Download `maa-invest-app.apk` from the latest release
4. Drop it into your website's `downloads/maa-invest-app.apk` — the
   QR-code install flow from your site picks it up automatically

Every future push to `main` produces a new release the same way. You can
also grab the same file from the **Actions** tab under that run's
"Artifacts" section if you don't want to wait for the Release step.

> This build is a debug-signed APK — perfect for direct-download / QR
> install, but not accepted by the Play Store (which requires a
> release-signed `.aab`). See the next section for that.

## 4. Building a production release (App Store / Play Store)

For the actual app stores you do need an Expo account (still free) — this
is only required if you want to publish to Play Store / App Store, not
for the everyday GitHub-builds-the-apk flow above:

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile production   # .aab for Play Store
eas build --platform ios --profile production        # for App Store / TestFlight
eas submit --platform android
eas submit --platform ios
```

See https://docs.expo.dev/build/introduction/ for the full guide. iOS
builds/submissions require an Apple Developer account ($99/year).

## Project structure

```
App.tsx                     — entry point
src/
  theme/                    — colors & typography tokens (sampled from mockup)
  api/                      — REST client + one module per backend resource
  context/AuthContext.tsx   — auth/session state, token storage
  components/               — buttons, cards, inputs, charts, progress rings
  navigation/                — auth stack, bottom tabs, root stack
  screens/
    auth/                   — Welcome, Login, Register, PIN setup
    home/                   — Dashboard
    wallet/                 — Wallet, Add Money, Withdraw
    save/                   — Goals list, Create goal
    groups/                 — Groups list, Group detail, Join by code
    invest/                 — Investment products
    history/                — Transaction history
    profile/                — Profile, More menu, Notifications
```

## Notes / things to wire up next

- **Group activity feed**: the backend doesn't yet expose a per-group
  transaction/activity endpoint, so `GroupDetailScreen`'s "Recent Activity"
  is a placeholder. Add a `api/groups/activity.php` endpoint to light it up.
- **Group withdraw / loans / members**: UI stubs are in place (they show a
  "coming soon" alert) since those aren't in the current REST API — the web
  app has `group_loans.php` / `group_withdrawals.php` but no JSON
  equivalents yet.
- **PIN lock** is currently local-only (device-side, via `expo-secure-store`)
  and not tied to the backend — it's a re-entry gate, not a second auth
  factor recognized by the server.
- Wallet deposits/withdrawals go through the real M-Pesa/Pesapal/KCB flow
  your backend already has wired up (STK push etc.), so they'll return
  `pending` status until the webhook confirms — the app surfaces that as an
  alert rather than an instant balance update.
