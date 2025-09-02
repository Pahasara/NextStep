# Use official Node.js 20 alpine image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM nginx:alpine AS runner

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nextstep -u 1001

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Change ownership of nginx files to non-root user
RUN chown -R nextstep:nodejs /usr/share/nginx/html
RUN chown -R nextstep:nodejs /var/cache/nginx
RUN chown -R nextstep:nodejs /var/log/nginx
RUN chown -R nextstep:nodejs /etc/nginx/conf.d
RUN touch /var/run/nginx.pid
RUN chown -R nextstep:nodejs /var/run/nginx.pid

EXPOSE 8080

# Switch to non-root user
USER nextstep

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
