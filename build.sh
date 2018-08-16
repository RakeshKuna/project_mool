#!/bin/bash
meteor npm install
meteor build --directory .meteor/docker/build/ --server-only
cp settings-qa.json .meteor/docker/build/settings.json
cp Dockerfile .meteor/docker/
cd .meteor/docker
#Run docker command as non-root user.
#Run below commands once to run docker commands as non-root
#sudo groupadd docker
#sudo usermod -aG docker $USER

docker build -t dockerhub.raksan.in/moolya/moolya-core:qa-040517 .
cd ../../
docker login dockerhub.raksan.in
docker push dockerhub.raksan.in/moolya/moolya-core:qa-040517
