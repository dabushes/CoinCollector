# CoinCollector

A comprehensive US coin collection tracker built with a modern full-stack architecture.

## Architecture

This is a monorepo containing:

- **Backend**: Node.js + Express + Prisma ORM + PostgreSQL
- **Frontend**: React + Vite
- **Database**: PostgreSQL with Prisma ORM

## Features

### Backend API
- RESTful API endpoints for:
  - 🪙 **Coins**: CRUD operations for coin records
  - 🏷️ **Types**: Manage coin types (Lincoln Cent, Jefferson Nickel, etc.)
  - 🏛️ **Mints**: Manage mint locations (Philadelphia, Denver, San Francisco)
  - 📚 **Collections**: User coin collection management
  - 👤 **Users**: User account management
- Prisma ORM with PostgreSQL database
- Comprehensive data seeding
- Input validation and error handling

### Frontend UI
- Clean, responsive React interface
- Add coins to personal collection
- Browse all available coins
- View and manage personal collection
- Real-time updates

### Database Schema
- **Coins**: Year, mint, type, condition, value, notes
- **Coin Types**: Name, denomination, series, year range
- **Mints**: Name, mint mark, location, active status
- **User Collections**: User coins with condition, quantity, notes
- **Users**: Basic user information

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd CoinCollector
npm install
```

2. **Set up the database:**
```bash
# Copy environment file
cp backend/.env.example backend/.env

# Edit backend/.env with your PostgreSQL connection string:
# DATABASE_URL="postgresql://username:password@localhost:5432/coincollector"
```

3. **Initialize the database:**
```bash
cd backend
npm run db:push
npm run db:seed
```

4. **Start the development servers:**
```bash
# From the root directory
npm run dev
```

This will start:
- Backend API server on http://localhost:3001
- Frontend development server on http://localhost:5173

## Development Commands

### Root Level
```bash
npm run dev              # Start both backend and frontend
npm run build            # Build both applications
npm run dev:backend      # Start only backend
npm run dev:frontend     # Start only frontend
```

### Backend (`cd backend`)
```bash
npm run dev              # Start development server with nodemon
npm run start            # Start production server
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes to database
npm run db:seed          # Seed database with sample data
npm run db:reset         # Reset database and re-seed
```

### Frontend (`cd frontend`)
```bash
npm run dev              # Start Vite development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

## API Endpoints

### Coins
- `GET /api/coins` - List coins (with pagination and filtering)
- `GET /api/coins/:id` - Get specific coin
- `POST /api/coins` - Create new coin
- `PUT /api/coins/:id` - Update coin
- `DELETE /api/coins/:id` - Delete coin

### Types
- `GET /api/types` - List all coin types
- `GET /api/types/:id` - Get specific type
- `POST /api/types` - Create new type
- `PUT /api/types/:id` - Update type
- `DELETE /api/types/:id` - Delete type

### Mints
- `GET /api/mints` - List all mints
- `GET /api/mints/:id` - Get specific mint
- `POST /api/mints` - Create new mint
- `PUT /api/mints/:id` - Update mint
- `DELETE /api/mints/:id` - Delete mint

### Collections
- `GET /api/collections` - List user's collection
- `GET /api/collections/:id` - Get specific collection item
- `POST /api/collections` - Add coin to collection
- `PUT /api/collections/:id` - Update collection item
- `DELETE /api/collections/:id` - Remove from collection
- `GET /api/collections/stats/:userId` - Get collection statistics

### Users
- `GET /api/users` - List users
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Project Structure

```
CoinCollector/
├── package.json              # Root workspace configuration
├── .gitignore               # Git ignore rules
├── README.md                # This file
├── backend/                 # Backend application
│   ├── package.json
│   ├── .env.example         # Environment variables template
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.js          # Database seeding script
│   └── src/
│       ├── index.js         # Express server entry point
│       └── routes/          # API route handlers
│           ├── coins.js
│           ├── types.js
│           ├── mints.js
│           ├── collections.js
│           └── users.js
└── frontend/                # Frontend application
    ├── package.json
    ├── vite.config.js       # Vite configuration
    ├── index.html
    └── src/
        ├── main.jsx         # React entry point
        ├── App.jsx          # Main application component
        └── App.css          # Styles
```

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Prisma**: Database ORM and migration tool
- **PostgreSQL**: Relational database
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Frontend
- **React**: UI library
- **Vite**: Build tool and development server
- **Axios**: HTTP client for API requests
- **CSS**: Styling (responsive design)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -am 'Add feature'`
6. Push: `git push origin feature-name`
7. Submit a pull request

## License

ISC License
