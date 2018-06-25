#!/bin/bash

set -x

rm -rf target
mkdir -p target

node_modules/.bin/pkg --target node8-linux-x64 --output target/linux-x64/lo package.json
node_modules/.bin/pkg --target node8-linux-x86 --output target/linux-x86/lo package.json
node_modules/.bin/pkg --target node8-win-x64 --output target/windows-x64/lo.exe package.json
node_modules/.bin/pkg --target node8-win-x86 --output target/windows-x86/lo.exe package.json
node_modules/.bin/pkg --target node8-macos-x64 --output target/macos-x64/lo package.json

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

(cd target/linux-x64 && zip -q -9 ../lo-${PACKAGE_VERSION}-linux-x64.zip lo)
(cd target/linux-x86 && zip -q -9 ../lo-${PACKAGE_VERSION}-linux-x86.zip lo)
(cd target/windows-x64 && zip -q -9 ../lo-${PACKAGE_VERSION}-windows-x64.zip lo.exe)
(cd target/windows-x86 && zip -q -9 ../lo-${PACKAGE_VERSION}-windows-x86.zip lo.exe)
(cd target/macos-x64 && zip -q -9 ../lo-${PACKAGE_VERSION}-macos-x64.zip lo)
