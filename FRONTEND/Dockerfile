# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with npm ci (faster & deterministic)
RUN npm ci && \
    npm cache clean --force

# Copy all files
COPY . .

# Build the app
RUN npm run build && \
    rm -rf node_modules src public

# Production stage - use minimal nginx alpine
FROM nginx:stable-alpine

# Copy build files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx files
RUN rm -rf /etc/nginx/conf.d/default.conf.bak

EXPOSE 80

# Run nginx as non-root user
USER nginx

CMD ["nginx", "-g", "daemon off;"]
