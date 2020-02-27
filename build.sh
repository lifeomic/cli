#!/bin/bash

set -x

rm -rf target
mkdir -p target

node_modules/.bin/pkg --target node12-linux-x64 --output target/linux-x64/lo package.json
node_modules/.bin/pkg --target node12-win-x64 --output target/windows-x64/lo.exe package.json
node_modules/.bin/pkg --target node12-macos-x64 --output target/macos-x64/lo package.json

node_modules/.bin/pkg --target node12-linux-x64 --output target/linux-x64/life-export life-export.js
node_modules/.bin/pkg --target node12-win-x64 --output target/windows-x64/life-export.exe life-export.js
node_modules/.bin/pkg --target node12-macos-x64 --output target/macos-x64/life-export life-export.js

cp node_modules/open/xdg-open target/linux-x64/.
cp node_modules/open/xdg-open target/macos-x64/.

(cd target/linux-x64 && zip -q -9 ../lo-linux-x64.zip lo life-export xdg-open)
(cd target/windows-x64 && zip -q -9 ../lo-windows-x64.zip lo.exe life-export.exe)
(cd target/macos-x64 && zip -q -9 ../lo-macos-x64.zip lo life-export xdg-open)
