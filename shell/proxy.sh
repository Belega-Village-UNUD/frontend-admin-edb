#!/bin/bash

docker service ls | grep "ssl_nginx"

if [ $? -ne 0 ]; then
  docker stack deploy -c ./docker/ssl/docker-compose.yml ssl 

  if [ $? -ne 0 ]; then
    echo "Failed to deploy nginx ssl service"
    exit 1
  fi
fi

docker config ls | grep "fecoinsbillbelega.conf"

if [ $? -ne 0 ]; then
  export $(cat .env) > /dev/null 2>&1; envsubst < nginx/templates/fecoinsbillbelega.conf.template > nginx/templates/fecoinsbillbelega.conf
  if [ $? -ne 0 ]; then
    echo "Failed to deploy nginx ssl service"
    exit 1
  fi
  
  docker config create fecoinsbillbelega.conf ./nginx/templates/fecoinsbillbelega.conf

  if [ $? -ne 0 ]; then
    echo "Failed to create config for frontend admin route"
    exit 1
  fi

  echo "Successfully created config for frontend admin route" 

else

  echo "Config file for frontend route is available, updating now...."
  echo "Updating config frontend route in ssl service"
  docker service update --config-rm fecoinsbillbelega.conf ssl_nginx

  if [ $? -ne 0 ]; then
    echo "Failed to update config for frontend admin in ssl service"
    exit 1
  fi

  echo "Updating configuration for frontend route"
  docker config rm fecoinsbillbelega.conf
  export $(cat .env) > /dev/null 2>&1; envsubst < nginx/templates/fecoinsbillbelega.conf.template > nginx/templates/fecoinsbillbelega.conf

  if [ $? -ne 0 ]; then
    echo "Failed to create update for frontend admin route"
    exit 1
  fi

  docker config create fecoinsbillbelega.conf ./nginx/templates/fecoinsbillbelega.conf

  if [ $? -ne 0 ]; then
    echo "Failed updating config for frontend route"
    exit 1
  fi
fi

docker service update --config-add source=fecoinsbillbelega.conf,target=/etc/nginx/conf.d/fecoinsbillbelega.conf,mode=0440 ssl_nginx

if [ $? -ne 0 ]; then
  echo "Failed updating config for frontend route on ssl service"
  exit 1
fi

if [ $(docker service ps ssl_nginx | grep -i running | wc -l) == 0 ]; then
  docker service update --config-rm --force fecoinsbillbelega.conf
  docker config rm fecoinsbillbelega.conf 
  echo "Failed updating config for backend route on ssl service, something is wrong with the nginx configuration, please check the template and make sure the variable is available"
  exit 1
fi

echo "Successfully updating frontend config on service ssl_nginx"

echo "Successfully deploy the image for registry.belegacommerce.shop/belega-village-unud/frontend-admin-edb:$COMMIT_SHA on service frontend_admin_app"

docker service ls | grep ssl_nginx | awk '{print $2, $3, $4, $5}'
