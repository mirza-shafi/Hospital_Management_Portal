# Use Node.js 18 alpine for smaller footprint
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies and clean cache in one layer
RUN npm install --omit=dev && npm cache clean --force

# Copy all files
COPY . .

# Expose port
EXPOSE 1002

# Use node instead of npm start for production (saves memory)
CMD ["node", "index.js"]
