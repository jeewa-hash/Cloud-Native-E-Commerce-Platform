FROM node:18-alpine
WORKDIR /app
COPY NotificationService/package*.json ./
RUN npm install
COPY NotificationService/ .
EXPOSE 5000
CMD ["node", "index.js"]