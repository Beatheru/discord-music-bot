FROM node:20.15

RUN apt update && apt install ffmpeg -y

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/Bot.js"]
