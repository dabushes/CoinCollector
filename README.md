# CoinCollector

A comprehensive coin collecting application built with a modern tech stack. This monorepo contains both the backend API and frontend interface for managing your coin collection.

## 🚀 Tech Stack

### Backend
- **Node.js** with **Express.js** - Server framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **TypeScript** - Type safety

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Modern CSS** - Styling

## 📁 Project Structure

```
CoinCollector/
├── backend/                 # Backend API (Node.js/Express/Prisma)
│   ├── src/                # Source code
│   ├── prisma/             # Database schema and migrations
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend documentation
├── frontend/               # Frontend React app
│   ├── src/                # Source code
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── package.json            # Workspace configuration
└── README.md               # This file
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 14+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dabushes/CoinCollector.git
   cd CoinCollector
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your database configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run seed
   ```

### Development

**Start both services concurrently:**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

The backend will be available at `http://localhost:3001` and the frontend at `http://localhost:5173`.

### Build for Production

```bash
npm run build:all
```

## 📋 Available Scripts

### Root Level
- `npm run install:all` - Install all dependencies
- `npm run dev:backend` - Start backend in development mode
- `npm run dev:frontend` - Start frontend in development mode
- `npm run build:all` - Build both backend and frontend
- `npm run test:all` - Run all tests
- `npm run lint:all` - Lint all code

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

## 🔧 Configuration

### Backend Configuration
The backend uses environment variables for configuration. See `backend/.env.example` for required variables.

### Frontend Configuration
The frontend configuration is handled through Vite. See `frontend/vite.config.js` for build settings.

## 📖 API Documentation

Once the backend is running, you can access:
- API endpoints at `http://localhost:3001/api`
- Sample routes for testing the connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
