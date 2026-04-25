FROM node:20-alpine

WORKDIR /app

COPY DeliveryManagementService/package*.json ./

RUN npm install

COPY DeliveryManagementService/ ./

EXPOSE 5003

CMD ["npm", "run", "dev"]