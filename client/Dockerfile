FROM node:21-alpine3.17

# Dependencies
COPY ./package* /client/
WORKDIR /client

RUN npm ci --unsafe-perm=true
RUN npm i -g serve

WORKDIR /
COPY . /client
WORKDIR /client

# Use this to test PWA
# CMD npm run build && serve -l 3000 -s build

# Use this to hot-reload (cannot test PWA)
CMD npm start
