FROM node:18-alpine


RUN apk add --no-cache bash jq mysql-client
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install


COPY . .
EXPOSE 8080
ENV PORT=8080

CMD ["npm", "start"]