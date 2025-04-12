FROM node:18-alpine

# Install netcat for the database connection check
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production=false

# Copy Prisma schema first (separate from other files)
COPY prisma ./prisma/

# Copy the rest of the application
COPY . .

# Make start script executable
RUN chmod +x ./scripts/start.sh

# We'll generate Prisma client during container startup
CMD ["./scripts/start.sh"]