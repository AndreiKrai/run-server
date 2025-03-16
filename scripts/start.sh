#!/bin/sh
# filepath: /Users/andreiokraichenko/Projects/run4fun/run-server/scripts/start.sh
set -e

# Display environment info (helpful for debugging)
echo "🔍 Environment:"
echo "DATABASE_URL: ${DATABASE_URL}"
echo "PORT: ${PORT}"

# Wait for database to be ready
echo "🔄 Waiting for database..."
while ! nc -z db 5432; do
  sleep 5
done

# Generate Prisma Client
echo "🔄 Generating Prisma Client..."
npx prisma generate

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Build TypeScript code
echo "🔨 Building application..."
npm run build

echo "🚀 Starting the application..."
npm start