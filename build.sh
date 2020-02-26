#!/bin/bash

set -x

rm -rf target
mkdir -p target

node_modules/.bin/pkg --target node12-linux-x64 --output target/linux-x64/lo package.json
node_modules/.bin/pkg --target node12-win-x64 --output target/windows-x64/lo.exe package.json
node_modules/.bin/pkg --target node12-macos-x64 --output target/macos-x64/lo package.json

(cd target/linux-x64 && zip -q -9 ../lo-linux-x64.zip lo)
(cd target/windows-x64 && zip -q -9 ../lo-windows-x64.zip lo.exe)
(cd target/macos-x64 && zip -q -9 ../lo-macos-x64.zip lo)

node_modules/.bin/pkg --target node12-linux-x64 --output target/linux-x64/life-export life-export.js
node_modules/.bin/pkg --target node12-win-x64 --output target/windows-x64/life-export.exe life-export.js
node_modules/.bin/pkg --target node12-macos-x64 --output target/macos-x64/life-export life-export.js

(cd target/linux-x64 && zip -q -9 ../life-export-linux-x64.zip life-export)
(cd target/windows-x64 && zip -q -9 ../life-export-windows-x64.zip life-export.exe)
(cd target/macos-x64 && zip -q -9 ../life-export-macos-x64.zip life-export)

