# Use Node.js 18 alpine for smaller footprint
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies with npm ci (faster & more reliable)
# Clean cache and remove unnecessary files in one layer
RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf /tmp/*

# Copy application files
COPY . .

# Remove development files if they exist
RUN rm -rf .git .gitignore README.md *.md tests/ test/ .env.example

# Create uploads directory and set permissions for node user
RUN mkdir -p uploads/doctors uploads/medicines uploads/patients && \
    chown -R node:node /app

# Expose port
EXPOSE 1002

# Run as non-root user for security
USER node

# Use node instead of npm start for production (saves memory)
CMD ["node", "index.js"]
