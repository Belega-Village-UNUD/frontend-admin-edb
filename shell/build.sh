#!/bin/bash

if [ -z $1  ]; then
    echo "Please provide the external branch name the first argument"
    exit 1
fi

if [ -z $2  ]; then
    echo "Please provide the commit sha the second argument"
    exit 1
fi

BRANCH=$1
COMMIT_SHA=$2

echo "Performing build for staging" $BRANCH;

if [ "$(git rev-parse --abbrev-ref HEAD)" != "$BRANCH" ]; then
    echo "this branch is not up to date"
    git checkout $BRANCH;
    git fetch --dry-run origin $BRANCH;
fi

git pull origin $BRANCH;

if [ $? -ne 0 ]; then
    echo "Error in pull and fetch $BRANCH of Frontend Admin Belega Service $?"
    exit 1
fi

set -x
docker image prune -f;

docker build . \
    -t ghcr.io/belega-village-unud/frontend-admin-edb:$COMMIT_SHA \
    -t ghcr.io/belega-village-unud/frontend-admin-edb:$BRANCH

if [ $? -ne 0 ]; then
    echo "Error in build $BRANCH for Frontend Admin Belega Service $?"
    exit 1
fi

set +x

echo "Successfully build the image for ghcr.io/belega-village-unud/frontend-admin-edb:$COMMIT_SHA"
