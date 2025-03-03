FROM node:18-alpine

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build TypeScript code
RUN npm run build

EXPOSE 3000

# Make the startup script executable
RUN chmod +x scripts/start.sh

# Use the startup script as the entry point
CMD ["./scripts/start.sh"]