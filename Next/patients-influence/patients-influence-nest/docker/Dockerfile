FROM node:18-alpine

RUN apk add nano curl git busybox-extras

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./

# Bundle app source
COPY . /usr/src/app
COPY env.prod /usr/src/app/env/.env.prod
COPY env.prod /usr/src/app/.env

#######
# Install app dependencies
RUN npm install -g husky
RUN npm install -g dotenv-cli
RUN npm install pm2 -g
RUN npm install -g @nestjs/cli@9.0.0
RUN npm install -g prisma@4.13.0

RUN npm ci
RUN npx prisma generate
RUN npm run build:prod

CMD ["pm2-runtime", "start", "dist/src/main.js"]

