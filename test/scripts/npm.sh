#!/usr/bin/env sh

. ./test/scripts/semver.sh

NPMV="$(npm --version)"

semverLT "$NPMV" "1.4.9"

if [ $? == 0 ]; then
    # npm too low - update to v1.4.8 then
    npm install -g npm@1.4.28
fi
