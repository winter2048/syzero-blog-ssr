FROM node:22.12.0

RUN mkdir -p /app
COPY . /app
WORKDIR /app

ENV HOST "0.0.0.0"
ENV UI_ENVIRONMENT Production

EXPOSE 3000

RUN npm install
RUN chmod +x ./start.sh

CMD ["bash", "./start.sh"]