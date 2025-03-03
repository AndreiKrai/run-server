#!/bin/sh
set -e

# Wait for database to be ready
echo "🔄 Waiting for database..."
while ! nc -z db 5432; do
  sleep 1
done

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Generate Prisma Client
echo "🔄 Generating Prisma Client..."
npx prisma generate

echo "🚀 Starting the application..."
npm start