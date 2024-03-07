FROM node

COPY . /app

WORKDIR /app
RUN sed -i 's/node server.js/next start/g' package.json

RUN npm i --legacy-peer-deps
#RUN npm audit fix --force
RUN npm run build


EXPOSE 3000
CMD npm start