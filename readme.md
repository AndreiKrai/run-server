# Description
Run4Fun is a backend server for a running events platform. 
It provides a RESTful API for user registration, authentication, event management, participant registration, and more. The project is designed to support both web and mobile clients, and is built with scalability, security, and developer experience in mind.

# Technologies Used
Node.js & TypeScript — Main backend runtime and language
Express.js — Web framework for building REST APIs
Prisma ORM — Type-safe database access (PostgreSQL)
PostgreSQL — Relational database
Passport.js — Authentication middleware (local & OAuth strategies)
JWT — JSON Web Tokens for stateless authentication
Nodemailer — Sending transactional emails
Zod — Runtime validation and type-safe schemas
Docker — Containerized development and deployment
Prisma Migrate — Database migrations
dotenv — Environment variable management

# Features

User Authentication & Authorization

Email/password registration and login
OAuth login with Google (and other providers)
Email verification and password reset via email
JWT-based authentication
User roles (admin, user, etc.)
User Profile Management

View and update user profile
Upload/change profile and cover photos
Manage user addresses
Event Management

Create, update, and delete running events (admin)
Filter and search events
Event categories (e.g., 5K, 10K, etc.)
Participant Management

Register for events and categories
View and update own registrations
Admin management of all participants
Cancel registration
Email Notifications

Email verification
Password reset
Transactional notifications
Admin Features

Manage users, events, categories, and participants


## Збірка та запуск
docker-compose up --build

## Create a new migration
docker-compose exec app npx prisma migrate dev --name init
## Or deploy existing migrations
docker-compose exec app npx prisma migrate deploy

docker-compose down
## Запуск у фоновому режимі
## docker-compose up -d


/events                  # List/create events
/events/:id              # Get/update/delete a specific event
/events/:id/categories   # List/create categories for an event
/categories/:id          # Get/update/delete a specific category
/participants            # List/create participants
/participants/:id        # Get/update/delete a specific participant
/results                 # List/create results
/results/:id             # Get/update/delete a specific result