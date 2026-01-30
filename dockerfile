# syntax=docker/dockerfile:1
# https://chatgpt.com/c/697c0c36-c01c-8323-a592-6c206be131f5
FROM node:24-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["yarn", "dev"]
EXPOSE 8080