#!/bin/bash

echo "Starting node server"
export NODE_ENV="development"
export NODE_PORT="3000"
nodemon app.js
