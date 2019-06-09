# TAWRESTaurant

MEAN app for the order management of an hypothetical restaurant

## Environment dependencies

**Note**: this is the configuration of our test device.

Base configuration:
- OS: Ubuntu/Linux 18.04.1 LTS
- Node.js 10.12.0
- npm 6.9.0
- MongoDB 4.0.9
- Angular CLI 8.0.1 (```npm install -g @angular/cli```)

For Mobile/Android:
- Java SE Development Kit 8u202
- Android SDK with API 28
- Apache Cordova 9.0.0 (```npm install -g cordova```)

## Building

```bash
npm run install
npm run mongo # only if MongoDB is not running yet
npm run build-web
npm run populate

# Mobile/Android (optional)
npm run build-android

# Desktop/Linux (optional)
npm run build-linux

# Desktop/Win32 (optional)
npm run build-win32
```

## Running

Server runs on http://localhost:3201/

Starter user: cashier1:cashier1

```bash
npm run start-web

# Mobile/Android (optional)
npm run start-android

# Desktop/* (optional)
npm run start-desktop
```
