FROM node:20.11 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20.11
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist
EXPOSE 5500
CMD npm run start:dev