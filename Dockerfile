## Temporary image only used to build server
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

## Optimized image used as server
FROM node:18-alpine AS server
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY package* ./
RUN npm install --production
ENV NODE_ENV production
ENV PORT 8080
EXPOSE 8080
CMD ["npm", "start"]