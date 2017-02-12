#!/usr/bin/env bash

echo "npm version:"
npm --version

cd build

# Login to npm
printf "%s\n%s\n%s" $NPM_USER $NPM_PASSWORD $NPM_EMAIL | npm login && npm publish --access public || :
