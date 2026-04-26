# Cine-Verse Backend

A comprehensive backend API for Cine-Verse, a movie streaming platform built with Node.js, Express, and TypeScript. Features user authentication, movie management, reviews, subscriptions, and more.

## Technology Stack

- **Runtime**: Node.js (ES Modules)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Better Auth with JWT
- **Validation**: Zod
- **Payment Processing**: Stripe
- **Email Service**: Nodemailer
- **Build Tool**: TSUP
- **Development**: TSX (for hot reloading)

## Project Structure

```
cine-verse-backend/
├── src/
│   ├── app/
│   │   ├── lib/                    # Core libraries
│   │   │   ├── auth.ts             # Authentication setup
│   │   │   └── prisma.ts           # Database client
│   │   ├── module/                 # Feature modules
│   │   │   ├── auth/               # User authentication
│   │   │   ├── category/           # Movie categories
│   │   │   ├── comment/            # User comments
│   │   │   ├── like/               # Like system
│   │   │   ├── manage-users/       # Admin user management
│   │   │   ├── move/               # Movie management (movies)
│   │   │   ├── review/             # Movie reviews
│   │   │   │   ├── review.controller.ts
│   │   │   │   ├── review.route.ts
│   │   │   │   ├── review.service.ts
│   │   │   │   └── review.validation.ts
│   │   │   ├── statics/            # Analytics and statistics
│   │   │   ├── subscription/        # Premium subscriptions
│   │   │   └── watchlist/          # User watchlists
│   │   └── utils/                  # Utility functions
│   │       ├── AppError.ts         # Custom error class
│   │       ├── catchAsync.ts       # Async error handler
│   │       ├── emailSender.ts      # Email service
│   │       ├── seed.ts             # Database seeding
│   │       └── sendResponse.ts     # API response formatter
│   ├── builder/
│   │   └── QueryBuilder.ts         # Database query builder
│   ├── config/
│   │   └── config.ts               # Application configuration
│   ├── errors/
│   │   ├── globalErrorHandler.ts   # Global error handling
│   │   └── handleZodError.ts       # Zod validation error handler
│   ├── generated/                  # Auto-generated Prisma client
│   ├── middleware/
│   │   ├── auth.middleware.ts      # Authentication middleware
│   │   ├── checkPremium.ts         # Premium user check
│   │   ├── notFound.ts             # 404 handler
│   │   └── validateRequest.ts      # Request validation
│   ├── routers/
│   │   └── index.ts                # Main router
│   ├── types/
│   │   ├── env.types.ts            # Environment types
│   │   ├── global.types.ts         # Global type definitions
│   │   └── role.types.ts           # User role types
│   ├── app.ts                      # Express app setup
│   └── server.ts                   # Server entry point
├── prisma/
│   └── schema.prisma               # Database schema
├── scripts/
│   └── fix-imports.js              # Build script for imports
├── dist/                           # Compiled JavaScript files
├── .env.example                    # Environment variables template
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

## Setup Guide

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cine-verse-backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   - Copy the environment template:
     ```bash
     cp .env.example .env
     ```
   - Fill in your environment variables in `.env`:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/cine_verse_db"
     JWT_SECRET="your-jwt-secret"
     STRIPE_SECRET_KEY="your-stripe-secret"
     EMAIL_USER="your-email@gmail.com"
     EMAIL_PASS="your-email-password"
     BETTER_AUTH_SECRET="your-better-auth-secret"
     BETTER_AUTH_URL="http://localhost:5000"
     ```

4. **Database Setup**
   - Generate Prisma client:
     ```bash

   - Run database migrations:
     ```bash
     pnpm run db:migrate
     ```

5. **Build the Application** (for production)
   ```bash
   pnpm run build
   ```

### Running the Application

- **Development mode** (with hot reloading):
  ```bash
  pnpm run dev
  ```
  The server will start on `http://localhost:5000`

- **Production mode**:
  ```bash
  pnpm run start
  ```

### Additional Commands

- **Database Studio** (GUI for database):
  ```bash
  pnpm run db:studio
  ```

- **Seed Database** (if seeding script exists):
  ```bash
  # Run your seeding script if available
  ```

## API Endpoints

The API provides endpoints for:

- **Authentication**: User registration, login, logout
- **Movies**: CRUD operations, search, filtering
- **Categories**: Movie categorization
- **Reviews**: User movie reviews and ratings
- **Comments**: Discussion system
- **Watchlist**: User movie lists
- **Subscriptions**: Premium features and payments
- **User Management**: Admin user controls
- **Analytics**: Platform statistics

Base URL: `http://localhost:5000/api/v1`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.