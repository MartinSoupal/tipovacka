#!/bin/bash

cd tipovacka-app

# Run Angular build with production settings
ng build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "Build successful. Deploying to Firebase..."
  # Deploy to Firebase Hosting
  firebase deploy --only hosting
else
  echo "Build failed. Not deploying to Firebase."
  exit 1
fi
