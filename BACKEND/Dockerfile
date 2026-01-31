# Use Node.js 18 LTS for compatibility
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose port
EXPOSE 8000

# Start the app
CMD ["npm", "start"]
