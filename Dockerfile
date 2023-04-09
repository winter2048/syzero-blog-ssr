FROM node
RUN mkdir -p /app
COPY . /app
WORKDIR /app
EXPOSE 3000
ENV HOST 0.0.0.0 
CMD ["npm","start"]