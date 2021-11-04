FROM node:14-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app1
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 8081
RUN chown -R node /usr/src/app1
USER node
CMD ["node", "server.js"]
