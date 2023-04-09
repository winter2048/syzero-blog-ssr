FROM node:alpine

RUN mkdir -p /app
COPY . /app
WORKDIR /app

ENV HOST "0.0.0.0"

RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]