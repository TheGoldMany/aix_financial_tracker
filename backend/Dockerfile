# Base stage
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Dependencies stage
FROM base AS dependencies
COPY package*.json ./
RUN npm ci

# Development stage
FROM base AS development
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start:dev"]

# Build stage
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

# Production stage
FROM base AS production
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
