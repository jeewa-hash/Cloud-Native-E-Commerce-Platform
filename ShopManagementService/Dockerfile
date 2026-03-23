FROM node:18-alpine
WORKDIR /app
COPY ShopManagementService/package*.json ./
RUN npm install
COPY ShopManagementService/ .
EXPOSE 4040
CMD ["node", "src/index.js"]