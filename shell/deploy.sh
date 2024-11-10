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
  export COMMIT_SHA=$COMMIT_SHA $(cat .env | grep PORT) >  /dev/null 2>&1; docker stack deploy -c ./docker/service/docker-compose.yml frontend_admin
  if [ $? -ne 0 ]; then
      echo "Error in deploying $BRANCH of Frontend Belega Service"
      exit 1
  fi
else
  docker service update --force --image registry.belegacommerce.shop/belega-village-unud/frontend-web-edb:$COMMIT_SHA frontend_admin_app
  if [ $? -ne 0 ]; then
      echo "Error in deploying $BRANCH of Frontend Admin Belega Service"
      exit 1
  fi
fi

echo "Successfully deploy the image for registry.belegacommerce.shop/belega-village-unud/frontend-admin-edb:$COMMIT_SHA on service frontend_admin_app"

docker service ls | grep frontend_admin_app | awk '{print $2, $3, $4, $5}'
