# AI Proposal Generator Backend

A powerful NestJS backend API for generating AI-powered proposals with user management, profile creation, and Stripe payment integration.

## 🚀 Features

### Core Features
- **User Authentication & Authorization** - JWT-based authentication with role-based access
- **Profile Management** - Create and manage professional profiles with skills, experience, and certifications
- **Proposal Generation** - AI-powered proposal creation with customizable templates
- **Subscription Management** - Stripe integration with usage-based limits
- **Email Verification** - Secure email verification system
- **Password Reset** - Forgot password functionality with email notifications

### Payment & Limits
- **Usage-based Limits** - Enforce limits on profiles and proposals
- **Stripe Integration** - Seamless payment processing
- **Subscription Plans**:
  - **Free**: 2 profiles, 5 proposals
  - **Basic**: 5 profiles, 15 proposals
  - **Premium**: 10 profiles, 50 proposals

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Payments**: Stripe
- **Email**: Nodemailer
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Stripe account (for payments)
- SMTP email service (Gmail, SendGrid, etc.)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-proposal-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=ai_proposal_db

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password

   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   STRIPE_BASIC_PRICE_ID=price_basic_plan_id
   STRIPE_PREMIUM_PRICE_ID=price_premium_plan_id

   # Frontend URL
   FRONTEND_URL=http://localhost:3000

   # Environment
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb ai_proposal_db

   # Run migrations
   npm run migration:run
   ```

5. **Start the application**
   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

## 📚 API Documentation

Once the application is running, visit `http://localhost:3000/api` for interactive API documentation (Swagger UI).

## 🔐 Authentication

### Register
```http
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

### Login
```http
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Verify Email
```http
POST /auth/verify-email
{
  "token": "verification_token"
}
```

## 👤 User Management

### Create Profile
```http
POST /profiles
Authorization: Bearer <jwt_token>
{
  "name": "John Doe",
  "title": "Full Stack Developer",
  "bio": "Experienced developer...",
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": "5+ years...",
  "education": "BS Computer Science...",
  "certifications": ["AWS Certified", "Google Cloud"]
}
```

### Create Proposal
```http
POST /proposals
Authorization: Bearer <jwt_token>
{
  "title": "E-commerce Website Development",
  "content": "I will develop a modern e-commerce website...",
  "clientName": "TechCorp",
  "projectDescription": "Building an online store...",
  "budget": 5000,
  "timeline": "3 months",
  "profileId": "profile_uuid"
}
```

## 💳 Payment Integration

### Check Usage Limits
```http
GET /payments/usage-limits/profile
GET /payments/usage-limits/proposal
Authorization: Bearer <jwt_token>
```

### Create Checkout Session
```http
POST /payments/create-checkout-session
Authorization: Bearer <jwt_token>
{
  "priceId": "price_basic_plan_id"
}
```

### Get Subscription Status
```http
GET /payments/subscription-status
Authorization: Bearer <jwt_token>
```

## 🏗️ Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── dto/                # Auth DTOs
│   ├── guards/             # JWT and Local guards
│   ├── strategies/         # Passport strategies
│   └── auth.service.ts     # Auth service
├── common/                 # Shared utilities
│   ├── decorators/         # Custom decorators
│   ├── dto/               # Common DTOs
│   ├── entities/           # Base entities
│   ├── guards/            # Common guards
│   ├── interceptors/      # Response interceptors
│   ├── services/          # Shared services
│   └── utils/             # Utility functions
├── config/                # Configuration files
├── payments/              # Payment module
│   ├── dto/              # Payment DTOs
│   ├── payments.service.ts
│   ├── usage.service.ts
│   └── payments.controller.ts
├── profiles/              # Profile management
│   ├── dto/              # Profile DTOs
│   ├── entities/         # Profile entity
│   └── profiles.service.ts
├── proposals/             # Proposal management
│   ├── dto/              # Proposal DTOs
│   ├── entities/         # Proposal entity
│   └── proposals.service.ts
├── subscriptions/         # Subscription management
│   ├── entities/         # Subscription entity
│   └── subscriptions.module.ts
├── users/                # User management
│   ├── dto/              # User DTOs
│   ├── entities/         # User entity
│   └── users.service.ts
├── app.module.ts         # Main application module
└── main.ts              # Application entry point
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode
npm run start:debug        # Start with debug mode

# Building
npm run build             # Build the application
npm run start:prod        # Start production server

# Testing
npm run test              # Run unit tests
npm run test:e2e          # Run end-to-end tests
npm run test:cov          # Run tests with coverage

# Code Quality
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
```

### Database Migrations

```bash
# Generate migration
npm run migration:generate -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🚀 Deployment

### Docker (Recommended)

1. **Build the image**
   ```bash
   docker build -t ai-proposal-backend .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 ai-proposal-backend
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   export NODE_ENV=production
   export DB_HOST=your-production-db-host
   # ... other production variables
   ```

3. **Start the application**
   ```bash
   npm run start:prod
   ```

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Email verification
- Rate limiting (recommended for production)
- CORS configuration
- Input validation with class-validator

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_HOST` | PostgreSQL host | Yes |
| `DB_PORT` | PostgreSQL port | Yes |
| `DB_USERNAME` | Database username | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `DB_DATABASE` | Database name | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | Yes |
| `SMTP_HOST` | SMTP server host | Yes |
| `SMTP_PORT` | SMTP server port | Yes |
| `SMTP_USER` | SMTP username | Yes |
| `SMTP_PASS` | SMTP password | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes |
| `FRONTEND_URL` | Frontend application URL | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, email support@example.com or create an issue in the repository.

## 🔗 Related Links

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Stripe Documentation](https://stripe.com/docs)
- [Swagger Documentation](https://swagger.io/)

---

Made with ❤️ using NestJS 