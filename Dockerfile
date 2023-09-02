## Temporary image only used to build server
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

## Optimized image used as server
FROM node:18-alpine AS server
WORKDIR /app
COPY --from=builder ./app/build ./build
COPY package* ./
RUN npm install --production
EXPOSE 8080
CMD ["npm", "start"]