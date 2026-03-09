# HorseHub Mobile Build Guide

## 🚀 Capacitor Mobile Build Setup Complete!

### ✅ Configuration Status

- **Capacitor Version**: 7.4.2
- **Android SDK**: Configured and installed
- **Java JDK**: OpenJDK 17
- **Build Tools**: Gradle 8.11.1
- **Target Android**: API 35 (Android 15)
- **Min Android**: API 23 (Android 6.0)

### 📱 Mobile Build Configuration

#### Updated Files:
1. **capacitor.config.ts**
   - Added Android scheme configuration
   - Configured allowed navigation domains
   - Enabled web contents debugging
   - Added splash screen configuration

2. **AndroidManifest.xml**
   - Added required permissions (Internet, Storage, Camera)
   - Configured cleartext traffic for development
   - Set proper activity configuration

3. **Build Configuration**
   - Java 17 installed and configured
   - Android SDK 35 installed
   - Gradle build tools configured

### 🔧 Build Commands

#### 1. Build React App for Production
```bash
cd /app/frontend
yarn build
```

#### 2. Sync Capacitor
```bash
cd /app/frontend
npx cap sync android
```

#### 3. Build Android APK (Debug)
```bash
cd /app/frontend/android
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64
export ANDROID_HOME=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
./gradlew assembleDebug
```

**Output**: `/app/frontend/android/app/build/outputs/apk/debug/app-debug.apk`

#### 4. Build Android APK (Release - for production)
```bash
cd /app/frontend/android
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64
export ANDROID_HOME=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
./gradlew assembleRelease
```

**Output**: `/app/frontend/android/app/build/outputs/apk/release/app-release-unsigned.apk`

**Note**: Release builds need to be signed. See signing section below.

### 📦 One-Command Build Script

Use the automated build script:

```bash
cd /app/frontend
./build-mobile.sh debug    # For debug APK
./build-mobile.sh release  # For release APK
```

### 🔐 App Signing (for Release Builds)

To sign your release APK for Google Play Store:

1. **Generate a keystore** (one-time):
```bash
keytool -genkey -v -keystore horsehub-release-key.keystore -alias horsehub -keyalg RSA -keysize 2048 -validity 10000
```

2. **Create signing configuration** in `/app/frontend/android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file("path/to/horsehub-release-key.keystore")
            storePassword "your-store-password"
            keyAlias "horsehub"
            keyPassword "your-key-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

3. **Build signed release**:
```bash
./gradlew assembleRelease
```

### 📲 Testing the APK

#### On Physical Device:
1. Enable Developer Options on Android device
2. Enable USB Debugging
3. Connect device via USB
4. Install APK:
```bash
cd /app/frontend/android
export ANDROID_HOME=/opt/android-sdk
$ANDROID_HOME/platform-tools/adb install app/build/outputs/apk/debug/app-debug.apk
```

#### Via File Transfer:
1. Copy APK to device:
```bash
scp /app/frontend/android/app/build/outputs/apk/debug/app-debug.apk [your-device]
```
2. Open APK file on device to install

### 🐛 Troubleshooting

#### Build Fails - SDK Not Found:
```bash
export ANDROID_HOME=/opt/android-sdk
echo "sdk.dir=/opt/android-sdk" > /app/frontend/android/local.properties
```

#### Build Fails - Java Not Found:
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64
java -version
```

#### Capacitor Sync Issues:
```bash
cd /app/frontend
rm -rf android
npx cap add android
npx cap sync android
```

#### Clear Gradle Cache:
```bash
cd /app/frontend/android
./gradlew clean
```

### 📋 Environment Variables Required

Add these to your shell profile for permanent configuration:

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64
export ANDROID_HOME=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
```

### 🔄 Updating the App

When you make changes to the React code:

1. Build React app:
```bash
cd /app/frontend
yarn build
```

2. Sync with Capacitor:
```bash
npx cap sync android
```

3. Rebuild APK:
```bash
cd android
./gradlew assembleDebug
```

### 📊 Build Variants

- **Debug**: For development and testing (includes debugging symbols)
- **Release**: For production deployment (optimized, needs signing)

### 🎯 Next Steps for Production

1. **Test the debug APK** thoroughly on multiple devices
2. **Generate a signing key** for release builds
3. **Build and sign a release APK**
4. **Test the release build**
5. **Prepare Play Store listing** (screenshots, description, etc.)
6. **Upload to Google Play Console**

### ⚠️ Important Notes

- **Environment Variables**: The .env.production file is used for mobile builds
- **API URL**: Make sure REACT_APP_API_SERVER_URL points to production backend
- **HTTPS**: Production API must use HTTPS
- **Permissions**: App requests camera and storage permissions for photo uploads
- **Privacy Screen**: Plugin enabled to prevent screenshots of sensitive data
- **Min SDK 23**: App supports Android 6.0 and above

### 📞 Support

For issues or questions:
- Check Android Studio logcat for detailed errors
- Review Gradle build logs
- Verify all environment variables are set correctly
