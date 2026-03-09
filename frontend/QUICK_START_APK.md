# 🎯 Quick Start: Generate Android APK

## Option 1: Automated Build (Recommended)

```bash
cd /app/frontend
./build-mobile.sh debug
```

**This will:**
1. Clean previous builds
2. Install dependencies
3. Build React app
4. Sync Capacitor
5. Generate debug APK

**Output:** `/app/frontend/android/app/build/outputs/apk/debug/app-debug.apk`

---

## Option 2: Manual Step-by-Step

### Step 1: Build React App
```bash
cd /app/frontend
yarn build
```

### Step 2: Sync Capacitor
```bash
npx cap sync android
```

### Step 3: Build APK
```bash
cd android
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64
export ANDROID_HOME=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
./gradlew assembleDebug
```

**Output:** `/app/frontend/android/app/build/outputs/apk/debug/app-debug.apk`

---

## Option 3: Release Build (Production)

### For Production Deployment:

```bash
cd /app/frontend
./build-mobile.sh release
```

**Output:** `/app/frontend/android/app/build/outputs/apk/release/app-release-unsigned.apk`

⚠️ **Note:** Release builds must be signed before distribution. See `MOBILE_BUILD_GUIDE.md` for signing instructions.

---

## 📲 Installing APK on Device

### Method 1: USB Connection
```bash
# Connect device via USB
# Enable USB debugging on device
export ANDROID_HOME=/opt/android-sdk
$ANDROID_HOME/platform-tools/adb install /app/frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

### Method 2: File Transfer
1. Copy APK to your device
2. Open file manager on device
3. Tap APK file
4. Allow installation from unknown sources
5. Install

---

## 🐛 Common Issues

### "SDK location not found"
```bash
echo "sdk.dir=/opt/android-sdk" > /app/frontend/android/local.properties
```

### "JAVA_HOME not set"
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64
```

### "Build failed"
```bash
cd /app/frontend/android
./gradlew clean
cd ..
./build-mobile.sh debug
```

---

## 📚 Full Documentation

- **Complete Guide:** `/app/frontend/MOBILE_BUILD_GUIDE.md`
- **Validation Report:** `/app/frontend/MOBILE_BUILD_VALIDATION.md`

---

## ✅ Verification

After build, verify APK exists:
```bash
ls -lh /app/frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

Expected output: File size around 15-50 MB
