#!/bin/bash

BRANCH=$1
COMMIT_SHA=$2

echo $BRANCH;

if [ "$(git rev-parse --abbrev-ref HEAD)" != "$BRANCH" ]; then
    echo "this branch is not up to date"
    git checkout $BRANCH;
    git fetch --dry-run;
fi

docker service ls | grep "frontend_admin_app"

if [ $? -ne 0 ]; then
  docker service create --name frontend_admin_app --publish published=3000,target=3000 ghcr.io/belega-village-unud/frontend-admin-edb:$COMMIT_SHA
  if [ $? -ne 0 ]; then
      echo "Error in deploying $BRANCH of Frontend Admin Belega Service"
      exit 1
  fi
else
  docker service update --force --image ghcr.io/belega-village-unud/frontend-admin-edb:$COMMIT_SHA frontend_admin_app
  if [ $? -ne 0 ]; then
      echo "Error in deploying $BRANCH of Frontend Admin Belega Service"
      exit 1
  fi
fi


echo "Successfully deploy the image for ghcr.io/belega-village-unud/frontend-admin-edb:$COMMIT_SHA on service frontend_admin_app"

docker service ls | grep frontend_admin | awk '{print $2, $3, $4, $5}'
