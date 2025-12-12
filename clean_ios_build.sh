#!/bin/bash
echo "Cleaning iOS build..."

# Clean Xcode build folder
cd ios
rm -rf build
echo "✓ Cleaned build folder"

# Clean DerivedData (all projects)
rm -rf ~/Library/Developer/Xcode/DerivedData/*
echo "✓ Cleaned Xcode DerivedData"

# Reinstall pods
echo "Reinstalling pods..."
pod install
echo "✓ Pods reinstalled"

echo ""
echo "Next steps:"
echo "1. Uninstall the app from your iOS device/simulator"
echo "2. Open Xcode and clean build folder (Product > Clean Build Folder or Cmd+Shift+K)"
echo "3. Rebuild and run the app"
