FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm rebuild sqlite3 --build-from-source || true

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]