FROM node:21-alpine3.17

# Dependencies
COPY ./package* /client/
WORKDIR /client

RUN npm ci --unsafe-perm=true
RUN npm i -g serve

WORKDIR /
COPY . /client
WORKDIR /client

RUN chmod u+x ./start.sh

CMD ./start.sh
