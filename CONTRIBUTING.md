# Contributing to Pénzügyi Követő

Thank you for your interest in contributing to Pénzügyi Követő!

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aix_financial_tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development environment**
   ```bash
   npm run docker:up
   ```

## Development Workflow

### Backend Development

```bash
cd backend
npm run start:dev
```

The backend API will be available at `http://localhost:3001`

### Frontend Development

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Code Style

- We use ESLint and Prettier for code formatting
- Run `npm run lint` to check for issues
- Run `npm run format` (if available) to auto-fix formatting

## Commit Messages

We follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Build process or auxiliary tool changes

Example:
```
feat: add income filtering by date range
fix: correct budget calculation for custom categories
docs: update API documentation for expense endpoints
```

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Run `npm run test` to execute tests

## Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes
3. Ensure tests pass and code is linted
4. Update documentation if needed
5. Submit a pull request to `develop` branch
6. Wait for code review

## Questions?

Open an issue for questions or discussions about contributing.
