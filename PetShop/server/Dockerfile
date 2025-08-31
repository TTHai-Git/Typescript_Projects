FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production   # chỉ cài prod deps
COPY . .
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"]   # chạy trực tiếp, không dùng nodemon
