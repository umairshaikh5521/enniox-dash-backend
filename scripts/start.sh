#!/bin/bash

# Build the project
npm run build

# Create logs directory if it doesn't exist
mkdir -p logs

# Start the server
npm start 