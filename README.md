# Pénzügyi Követő Rendszer

> Comprehensive personal finance and business accounting system for the Hungarian market

## Overview

Pénzügyi Követő Rendszer is a modern, cloud-based financial management application designed specifically for the Hungarian market. It provides both personal finance tracking (free tier) and professional accounting capabilities (pro tier) with full compliance to Hungarian tax regulations.

## Features

### Free Version
- ✅ Personal finance management
- ✅ Income and expense tracking
- ✅ Category-based budgeting with percentage allocation
- ✅ Savings management with automatic allocation
- ✅ Real-time budget monitoring
- ✅ Financial dashboards and reports
- ✅ Mobile-responsive design

### Pro Version
- ✅ Double-entry accounting system
- ✅ Chart of accounts management
- ✅ Journal entries and financial reporting
- ✅ Legal Hungarian invoice generation
- ✅ VAT calculation and compliance
- ✅ Multi-user support with role-based access
- ✅ Advanced reporting (income statement, balance sheet, trial balance)
- ✅ Invoice PDF generation and email delivery

## Technology Stack

### Frontend
- **Framework:** Next.js 14+ (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts

### Backend
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL 15+
- **Cache:** Redis
- **Authentication:** JWT (Access + Refresh Tokens)
- **Validation:** class-validator
- **API Docs:** Swagger/OpenAPI

### Infrastructure
- **Containerization:** Docker
- **Orchestration:** Docker Compose (dev) / Kubernetes (prod)
- **CI/CD:** GitHub Actions
- **Cloud:** AWS
- **Monitoring:** Sentry

## Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose
- PostgreSQL 15+ (if running locally)
- Redis 7+ (if running locally)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd aix_financial_tracker
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start with Docker (Recommended)

```bash
# Start all services
npm run docker:up

# View logs
npm run docker:logs

# Stop all services
npm run docker:down
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api

### 5. Alternative: Local Development

**Start PostgreSQL and Redis:**
```bash
npm run docker:up postgres redis
```

**Run migrations:**
```bash
npm run migrate:up
```

**Start development servers:**
```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run dev:frontend
npm run dev:backend
```

## Project Structure

```
penzugyi-koveto/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities and helpers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── stores/          # Zustand state stores
│   │   └── types/           # TypeScript types
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # NestJS application
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   ├── common/          # Shared code
│   │   ├── config/          # Configuration
│   │   └── database/        # Database migrations
│   └── package.json
├── .github/
│   └── workflows/           # CI/CD pipelines
├── docker-compose.yml       # Docker services
├── .env.example             # Environment variables template
└── README.md
```

## Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both applications for production
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run docker:up` - Start Docker services
- `npm run docker:down` - Stop Docker services
- `npm run migrate:up` - Run database migrations
- `npm run migrate:down` - Revert last migration

### Frontend
- `npm run dev:frontend` - Start Next.js dev server
- `npm run build:frontend` - Build for production
- `npm run test:frontend` - Run frontend tests
- `npm run lint:frontend` - Lint frontend code

### Backend
- `npm run dev:backend` - Start NestJS dev server
- `npm run build:backend` - Build for production
- `npm run test:backend` - Run backend tests
- `npm run lint:backend` - Lint backend code

## Database Migrations

```bash
# Create a new migration
cd backend
npm run migration:create -- MigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## API Documentation

Once the backend is running, access the interactive API documentation at:
- Swagger UI: http://localhost:3001/api

## Security

- Passwords are hashed using bcrypt (12 salt rounds)
- JWT tokens with short-lived access tokens (15 min) and refresh tokens (30 days)
- Rate limiting on all API endpoints
- CORS configured for production
- SQL injection protection via TypeORM
- XSS protection with sanitization
- HTTPS enforced in production

## Hungarian Compliance

The application is designed to comply with:
- Hungarian Accounting Act
- Hungarian tax law requirements for invoicing
- NAV (National Tax and Customs Administration) regulations
- GDPR data protection requirements

## Development Roadmap

- [x] Phase 1: Project setup and infrastructure
- [ ] Phase 1: Core free version features (Week 5-8)
- [ ] Phase 1: Free version polish (Week 9-12)
- [ ] Phase 1: Testing and deployment (Week 13-16)
- [ ] Phase 2: Pro version accounting features
- [ ] Phase 2: Invoice generation system
- [ ] Phase 3: Public launch and optimization

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@penzugyikoveto.hu or open an issue in this repository.

## Authors

- Pénzügyi Követő Team

## Acknowledgments

- Built with modern web technologies
- Designed specifically for the Hungarian market
- Inspired by international fintech best practices
