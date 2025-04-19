#!/bin/bash

# Set environment variables explicitly
export VITE_API_URL=https://healthquest-n0i2.onrender.com/api

# Build the application
npm run build

# Show success message
echo "Build completed successfully with backend URL: $VITE_API_URL" 