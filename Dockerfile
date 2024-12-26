FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund --legacy-peer-deps
COPY . ./
RUN npm run build
COPY --from=builder /app/dist /app/frontend_static
