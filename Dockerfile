# Use Node.js 18 Alpine image
FROM node:18-alpine

# Install wait-for-it script and netcat
RUN apk add --no-cache bash netcat-openbsd

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 3000

# Copy wait script
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Start the application with database wait
CMD ["/wait-for-it.sh", "postgres", "--", "npm", "run", "start:prod"] 