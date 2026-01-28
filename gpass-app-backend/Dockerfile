FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=4000
ENV DB_USER=gpass
ENV DB_PASSWORD=geoloc

EXPOSE 4000

CMD ["node", "server.js"]

