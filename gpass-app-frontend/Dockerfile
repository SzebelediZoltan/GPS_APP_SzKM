# ---------- BUILD STAGE ----------
FROM node:18-alpine AS build

WORKDIR /app

# csak a csomagfájlok először (cache miatt)
COPY package*.json ./
RUN npm install

# teljes forrás
COPY . .

# Vite build
RUN npm run build


# ---------- PRODUCTION STAGE ----------
FROM nginx:stable-alpine

# töröljük az alap configot
RUN rm /etc/nginx/conf.d/default.conf

# saját nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# buildelt fájlok bemásolása
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

