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

echo "Performing build for $BRANCH";

if [ "$(git rev-parse --abbrev-ref HEAD)" != "$BRANCH" ]; then
    echo "this branch is not up to date"
    git checkout --force $BRANCH;
    git fetch --dry-run;
fi

git pull origin --force $BRANCH;

if [ $? -ne 0 ]; then
    echo "Error in pull and fetch $BRANCH of Frontend Admin Belega Service $?"
    exit 1
fi


docker image prune -f;

if [ $? -ne 0 ]; then
    echo "Error in pruning images $?"
fi

docker build . --file docker/service/Dockerfile \
  -t registry.belegacommerce.shop/belega-village-unud/frontend-admin-edb:$COMMIT_SHA \
  -t registry.belegacommerce.shop/belega-village-unud/frontend-admin-edb:$BRANCH

docker push registry.belegacommerce.shop/belega-village-unud/frontend-admin-edb:$COMMIT_SHA 
docker push registry.belegacommerce.shop/belega-village-unud/frontend-admin-edb:$BRANCH 

echo "Successfully build the image for registry.belegacommerce.shop/belega-village-unud/frontend-admin-edb:$COMMIT_SHA"
