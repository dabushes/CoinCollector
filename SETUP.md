# CoinCollector Setup Guide

## Quick Start (Development)

1. **Install dependencies**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your PostgreSQL connection string
   ```

3. **Generate Prisma client and set up database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run seed
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend

   # Terminal 2 - Frontend  
   npm run dev:frontend
   ```

   The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Environment Setup

### PostgreSQL Database

You'll need a PostgreSQL database. For local development:

1. **Install PostgreSQL** (if not already installed)
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt install postgresql postgresql-contrib`
   - Windows: Download from https://www.postgresql.org/download/

2. **Create database**
   ```sql
   createdb coincollector
   ```

3. **Update .env file**
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/coincollector"
   ```

### Using Docker (Alternative)

You can also use Docker to run PostgreSQL:

```bash
docker run --name postgres-coincollector \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=coincollector \
  -p 5432:5432 \
  -d postgres:14
```

Then use this connection string:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/coincollector"
```

## Production Deployment

### Backend Deployment

1. Set up production PostgreSQL database
2. Set environment variables:
   ```
   DATABASE_URL=your-production-database-url
   NODE_ENV=production
   PORT=3001
   ```
3. Install dependencies: `npm install --production`
4. Generate Prisma client: `npm run db:generate`
5. Run migrations: `npm run db:migrate`
6. Start server: `npm start`

### Frontend Deployment

1. Build the app: `npm run build:frontend`
2. Serve the `frontend/dist` folder using a web server (nginx, Apache, etc.)
3. Configure the web server to proxy API calls to the backend

### Using a Platform as a Service

**Backend (e.g., Railway, Heroku):**
- Connect your GitHub repository
- Set environment variables in the platform dashboard
- The platform will automatically run the build commands

**Frontend (e.g., Vercel, Netlify):**
- Connect your GitHub repository
- Set build command: `npm run build:frontend`
- Set publish directory: `frontend/dist`
- Configure API proxy to your backend URL

## Troubleshooting

### Common Issues

1. **Prisma client not generated**
   ```bash
   npm run db:generate
   ```

2. **Database connection errors**
   - Check your DATABASE_URL is correct
   - Ensure PostgreSQL is running
   - Verify database exists

3. **Port conflicts**
   - Backend uses port 3001 by default
   - Frontend uses port 5173 by default
   - Change ports in .env or vite.config.js

4. **Build errors**
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Check Node.js version (requires 18+)

### Logs and Debugging

- Backend logs are displayed in the terminal where you run `npm run dev:backend`
- Frontend logs are visible in the browser console
- Database logs can be viewed with `npm run db:studio`

## Next Steps

- Add authentication/authorization
- Implement image upload for coins
- Add data export/import features
- Create mobile app version
- Add more detailed reporting and analytics