# https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker
FROM node:21-alpine
# RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN ls
WORKDIR /home/node/app
COPY package*.json ./
RUN mkdir -p /home/node/app/chrome-linux
COPY chrome-linux/chrome /home/node/app/chrome-linux/chrome
RUN npm install
USER node
COPY --chown=node:node . .
EXPOSE 3000
CMD [ "node", "index.js" ]
	
