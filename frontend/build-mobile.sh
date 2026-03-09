#!/bin/bash

# HorseHub Mobile Build Script
# Usage: ./build-mobile.sh [debug|release]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64
export ANDROID_HOME=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

BUILD_TYPE=${1:-debug}

echo -e "${GREEN}🚀 HorseHub Mobile Build Script${NC}"
echo -e "${GREEN}================================${NC}\n"

# Validate build type
if [[ "$BUILD_TYPE" != "debug" && "$BUILD_TYPE" != "release" ]]; then
    echo -e "${RED}❌ Invalid build type. Use 'debug' or 'release'${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Build Configuration:${NC}"
echo "  Build Type: $BUILD_TYPE"
echo "  Java: $(java -version 2>&1 | head -n 1)"
echo "  Android SDK: $ANDROID_HOME"
echo ""

# Step 1: Clean previous builds
echo -e "${YELLOW}🧹 Step 1/5: Cleaning previous builds...${NC}"
if [ -d "build" ]; then
    rm -rf build
fi
if [ -d "android/app/build" ]; then
    cd android && ./gradlew clean && cd ..
fi
echo -e "${GREEN}✓ Clean complete${NC}\n"

# Step 2: Install dependencies
echo -e "${YELLOW}📦 Step 2/5: Installing dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    yarn install
else
    echo "Dependencies already installed"
fi
echo -e "${GREEN}✓ Dependencies ready${NC}\n"

# Step 3: Build React app
echo -e "${YELLOW}⚛️  Step 3/5: Building React application...${NC}"
yarn build
echo -e "${GREEN}✓ React build complete${NC}\n"

# Step 4: Sync Capacitor
echo -e "${YELLOW}🔄 Step 4/5: Syncing Capacitor...${NC}"
npx cap sync android
echo -e "${GREEN}✓ Capacitor sync complete${NC}\n"

# Step 5: Build Android APK
echo -e "${YELLOW}🤖 Step 5/5: Building Android APK ($BUILD_TYPE)...${NC}"
cd android

if [ "$BUILD_TYPE" == "debug" ]; then
    ./gradlew assembleDebug
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
else
    ./gradlew assembleRelease
    APK_PATH="app/build/outputs/apk/release/app-release-unsigned.apk"
fi

cd ..

# Check if APK was created
if [ -f "android/$APK_PATH" ]; then
    APK_SIZE=$(du -h "android/$APK_PATH" | cut -f1)
    echo -e "${GREEN}✓ Android build complete${NC}\n"
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}✅ BUILD SUCCESSFUL!${NC}"
    echo -e "${GREEN}================================${NC}"
    echo ""
    echo -e "📦 APK Location: ${YELLOW}android/$APK_PATH${NC}"
    echo -e "📊 APK Size: ${YELLOW}$APK_SIZE${NC}"
    echo ""
    echo -e "📲 Install on device:"
    echo -e "   ${YELLOW}adb install android/$APK_PATH${NC}"
    echo ""
else
    echo -e "${RED}❌ Build failed - APK not found${NC}"
    exit 1
fi
