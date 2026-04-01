#!/bin/bash

mkdir -p dist
zip -r dist/image-focal-point.zip ./image-focal-point -x ".*" "*.DS_Store"