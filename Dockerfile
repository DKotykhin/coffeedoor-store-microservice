#standalone container
FROM node:20 as dev

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm install

COPY . /app

RUN npm run build

# CMD [ "npm", "run", "start:dev" ]
CMD [ "npm", "start" ]


# common container
FROM node:20 as prod

WORKDIR /coffeedoor-store-microservice

COPY ./coffeedoor-store-microservice/package.json /coffeedoor-store-microservice
COPY ./coffeedoor-store-microservice/package-lock.json /coffeedoor-store-microservice
COPY ./coffeedoor-store-microservice/tsconfig.json tsconfig.json
COPY ./coffeedoor-store-microservice/nest-cli.json nest-cli.json

RUN npm install

COPY /coffeedoor-store-microservice /coffeedoor-store-microservice

RUN npm run build

CMD [ "npm", "start" ]
