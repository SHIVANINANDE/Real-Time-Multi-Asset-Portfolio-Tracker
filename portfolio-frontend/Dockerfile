# ==========================================
# Stage 1: Build Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Best Practice: Copy package files first to leverage Docker layer caching
COPY package.json package-lock.json ./

RUN npm ci

# Copy remaining frontend assets
COPY . .

# Build Vite application for production
RUN npm run build

# ==========================================
# Stage 2: Nginx Production Server
# ==========================================
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose standard port 80
EXPOSE 80

# Nginx alpine runs as root by default, but it spawns worker processes as the nginx user. 
# Best Practice: Start nginx daemon off to execute in the foreground
CMD ["nginx", "-g", "daemon off;"]
