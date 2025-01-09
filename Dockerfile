# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Start the application
CMD ["node", ".output/server/index.mjs"] 