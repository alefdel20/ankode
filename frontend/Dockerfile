FROM node:18 AS build

WORKDIR /app

# 👇 IMPORTANTE: apuntar a frontend explícitamente
COPY frontend/package*.json ./

RUN npm install

# 👇 copiar frontend completo
COPY frontend/ .

RUN npm run build

# ---------- nginx ----------
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]