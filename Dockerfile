# TARGET: DEVELOPMENT
FROM mhart/alpine-node:10.3.0 AS development

RUN apk update && apk upgrade && apk add git && apk add python && apk add make && apk add g++ && npm i -g yarn

ENV APP_HOME /usr/app
VOLUME ${APP_HOME}
EXPOSE ${PORT}
WORKDIR $APP_HOME

CMD ["yarn", "run", "start:dev"]


# TARGET: TEST
FROM mhart/alpine-node:10.3.0 AS test

RUN apk update && apk upgrade && apk add git && apk add python && apk add make && apk add g++ && npm i -g yarn

ENV APP_HOME /usr/app

EXPOSE ${PORT}
WORKDIR $APP_HOME
ADD . $APP_HOME/
RUN yarn --production=false


# TARGET: PRODUCTION
FROM mhart/alpine-node:10.3.0 AS production

RUN apk update && apk upgrade && apk add git && apk add python && apk add make && apk add g++ && npm i -g yarn
COPY --from=test /usr/app /usr/app

EXPOSE ${PORT}
WORKDIR /usr/app

RUN yarn prestart:prod
CMD ["node", "dist/main.js"]
