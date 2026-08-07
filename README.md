# MAA Invest — Android App (Kotlin)

A native Android app for **MAA Invest**, built with **Kotlin + Jetpack Compose** — no Expo, no React Native, no cross-platform framework. It matches the look of the provided mockup (deep-green branding, wallet, savings goals, chamas/groups, investments) and talks directly to your existing PHP REST API at `maainvest.co.ke/api`.

This exists as an alternative to the Expo/React Native version of the app: that version needs Expo's cloud build service (EAS) to reliably handle Android's native-module build-tool matrix. This version is a plain Android project, so it builds with a simple `gradle assembleDebug` — the same kind of GitHub Actions workflow that works for any straightforward native Android app, no extra accounts needed.

## What's included

- Auth: Welcome/splash, Login, Register, local 4-digit PIN lock
- Home dashboard: portfolio value, wallet balance, active goals
- Wallet: balance, Add Money (M-Pesa/Bank/Card), Withdraw, transaction history
- Save: savings goals list + create goal
- Groups: browse groups, join by invite code, group detail with contribute
- Invest: browse investment products, buy flow (with premium-plan gating)
- Profile & More: account info, KYC status, logout

All screens call the real endpoints documented in your backend's `api/API_REFERENCE.md` — nothing here is mocked data.

## 1. Point the app at your backend

Edit `app/src/main/java/co/ke/maawebhost/invest/data/api/ApiClient.kt`:

```kotlin
const val API_BASE_URL = "[https://maainvest.co.ke/api/](https://maainvest.co.ke/api/)"
