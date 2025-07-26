# CoinCollector Backend

The backend API for the CoinCollector application, built with Node.js, Express, and Prisma.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 14+

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database configuration
   ```

3. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run seed
   ```

### Development

Start the development server with hot reloading:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`.

### Production

Build and start the production server:
```bash
npm run build
npm start
```

## 📋 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run build` - Build the application
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run seed` - Seed database with sample data

## 🗄️ Database Schema

### User
- `id` - Unique identifier
- `email` - User email (unique)
- `name` - User display name
- `createdAt` - Account creation date
- `updatedAt` - Last update date

### Coin
- `id` - Unique identifier
- `name` - Coin name
- `country` - Country of origin
- `year` - Minting year
- `denomination` - Face value
- `mintage` - Number minted
- `composition` - Metal composition
- `diameter` - Coin diameter (mm)
- `weight` - Coin weight (grams)
- `description` - Detailed description
- `condition` - Coin condition (enum)
- `purchasePrice` - Purchase price
- `currentValue` - Current market value
- `acquired` - Date acquired
- `imageUrl` - Image URL
- `notes` - Personal notes
- `userId` - Owner reference
- `createdAt` - Creation date
- `updatedAt` - Last update date

### Condition Enum
- `POOR`
- `FAIR` 
- `GOOD`
- `VERY_GOOD`
- `FINE`
- `VERY_FINE`
- `EXTREMELY_FINE`
- `ALMOST_UNCIRCULATED`
- `MINT_STATE`
- `PROOF`

## 🛣️ API Endpoints

### Health Check
- `GET /` - API information
- `GET /api/health` - Health check

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/:id/stats` - Get user collection statistics

### Coins
- `GET /api/coins` - Get all coins (with optional filtering)
- `GET /api/coins/:id` - Get coin by ID
- `POST /api/coins` - Create new coin
- `PUT /api/coins/:id` - Update coin
- `DELETE /api/coins/:id` - Delete coin

#### Query Parameters for GET /api/coins
- `userId` - Filter by user ID
- `country` - Filter by country (case insensitive)
- `year` - Filter by year
- `condition` - Filter by condition
- `search` - Search in name, description, and notes

## 🔧 Environment Variables

Required environment variables (see `.env.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS
- `JWT_SECRET` - JWT secret key
- `API_VERSION` - API version

## 🧪 Testing

The project uses Jest for testing. Run tests with:
```bash
npm test
```

## 📝 Code Style

The project uses ESLint for code linting. Run linting with:
```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

## 🚀 Deployment

1. Set up production database
2. Set environment variables
3. Install dependencies: `npm install --production`
4. Generate Prisma client: `npm run db:generate`
5. Run migrations: `npm run db:migrate`
6. Start server: `npm start`

## 🔍 Database Management

Use Prisma Studio to visually manage your database:
```bash
npm run db:studio
```

This will open a web interface at `http://localhost:5555` where you can view and edit your data.