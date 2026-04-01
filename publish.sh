#!/usr/bin/env bash

version="$1"
if [ -z "$version" ]; then
    echo "Usage: $0 <version>"
    exit 1
fi

BLACK="\033[30m"
RESET="\033[0m"

# update version numbers
pluginFile="./image-focal-point/image-focal-point.php"
readmeFile="./image-focal-point/readme.txt"
sed -i '' "s/\* Version: .*/\* Version: $version/" $pluginFile
sed -i '' "s/^Stable tag: .*/Stable tag: $version/" $readmeFile

# display updated
printf "\n• Updating plugin version references to $version:\n\n$BLACK"
sed -n '2,9p' $pluginFile
printf '\n'
sed -n '1,10p' $readmeFile
printf "\n$RESET"

# create zip
printf "• Creating zip file:\n\n"
rm -rf dist
mkdir -p dist
cd ./image-focal-point && zip -r ../dist/image-focal-point.zip ./* -x ".*" "*.DS_Store"


