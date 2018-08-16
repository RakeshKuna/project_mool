FROM ulexus/meteor:build
COPY build/ /home/meteor/www
RUN chown -R meteor:meteor /home/meteor/

#HOW TO Build
#sudo docker build -t harishreddy/smart:v1
#HOW TO RUN
#sudo docker run --name smart-mongo -d mongo
#sudo docker run --rm \
#  -e ROOT_URL=http://10.0.2.185:3000 \
#  --link smart-mongo:mongo-docker \
#  -e MONGO_URL=mongodb://mongo-docker:27017/smartDocker \
#  -p 3000:80 \
#  -e SETTINGS_FILE=/home/meteor/www/settings.json harishreddy/smart:v1
#
