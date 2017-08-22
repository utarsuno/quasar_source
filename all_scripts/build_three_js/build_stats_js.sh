#!/usr/bin/env bash

cd ./three.js/;

git pull --quiet;

npm install;

npm run build-uglify;