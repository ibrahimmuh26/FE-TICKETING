# Ticketing Ticketing System - Frontend

A modern, responsive Ticketing ticketing system built with React, TypeScript, and Tailwind CSS.

## Features

- **Multi-level Support System** (L1, L2, L3)
- **Ticket Management** - Create, view, update, and escalate tickets
- **Role-based Access Control** - Different permissions for L1, L2, L3 users
- **Real-time Activity Logs** - Track all ticket activities
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Critical Value Assignment** - For L2 users to mark critical tickets
- **Pagination** - Efficient data loading with customizable page size
- **Search & Filters** - Find tickets by ID, title, status, priority, or escalation level

## Prerequisites

Before running this application, make sure you have:

- **Node.js** v20.8.1 or higher
- **npm** v10.1.0 or higher
- **Backend API** running on `http://localhost:8021`

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ticketing-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Clear Vite cache** (Important for CSS to work properly)
   ```bash
   rm -rf node_modules/.vite
   ```

4. **Configure environment (Optional)**

   The app is configured to use `http://localhost:8021` as the backend API URL by default.

   To change this, update the `BASE_URL` in `src/services/api.ts`:
   ```typescript
   const apiClient = axios.create({
     baseURL: 'http://localhost:8021', // Change this to your backend URL
     headers: {
       'Content-Type': 'application/json',
     },
   });
   ```

## Running the Application

1. **Install dependencies** (if not already installed)
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   ```
   http://localhost:5173
   ```

> **Note:** Make sure the backend API is running on `http://localhost:8021` for the application to work properly.

## Environment Variables

Currently, the application doesn't require `.env` file. All configuration is done in code.

If you need to use environment variables in the future:

1. Create `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8021
   ```

2. Update `src/services/api.ts`:
   ```typescript
   const apiClient = axios.create({
     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8021',
   });
   ```

3. Restart the dev server

## Authentication

### Sample Credentials

The application requires authentication. Use these sample credentials to login:

**L1 User (Support Agent)**
- Email: `l1@example.com`
- Password: `password123`
- Permissions: Create tickets, update L1 tickets, escalate to L2

**L2 User (Senior Support)**
- Email: `l2@example.com`
- Password: `password123`
- Permissions: Update L2 tickets, assign critical values, escalate to L3

**L3 User (Admin)**
- Email: `admin@gmail.com`
- Password: `password123`
- Permissions: Resolve tickets, full system access

> **Note:** These are sample credentials. The actual credentials depend on your backend database.

## Key Features by Role

### L1 (Support Agent)
- Create new tickets
- View all tickets
- Update L1 tickets (add resolution notes, change status)
- Escalate tickets to L2 with reason
- Search and filter tickets

### L2 (Senior Support)
- View all tickets
- Update L2 tickets (add resolution notes, change status)
- Assign critical values (C1, C2, C3)
- Escalate tickets to L3 with reason
- Search and filter tickets

### L3 (Admin)
- View all tickets
- Update L3 tickets
- Resolve tickets with final resolution
- Full system access
- View all activity logs
- Search and filter tickets

## Project Structure

```
Ticketing-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── __tests__/      # Component tests
│   │   ├── icons/          # SVG icon components
│   │   ├── Modal.tsx
│   │   ├── Navbar.tsx
│   │   ├── Pagination.tsx
│   │   └── ...
│   ├── contexts/           # React Context providers
│   │   └── AuthContext.tsx
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx
│   │   ├── TicketList.tsx
│   │   └── Login.tsx
│   ├── services/           # API services
│   │   ├── api.ts          # Axios instance
│   │   ├── auth.service.ts
│   │   └── ticket.service.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── api.ts          # Backend API types
│   │   ├── auth.ts
│   │   └── ticket.ts
│   ├── utils/              # Utility functions
│   │   ├── __tests__/
│   │   └── mappers.ts      # Data transformation
│   ├── tests/              # Test setup and mocks
│   │   ├── setup.ts
│   │   ├── utils/
│   │   └── mocks/
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── vitest.config.ts        # Test configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
├── package.json
└── README.md
```

## Tech Stack

- **React** 19.2.0 - UI library
- **TypeScript** 5.9.3 - Type safety
- **Vite** 5.4.11 - Build tool & dev server
- **Tailwind CSS** 3.3.0 - Utility-first CSS framework
- **React Router DOM** 7.9.6 - Client-side routing
- **Axios** 1.13.2 - HTTP client
- **Vitest** 4.0.9 - Unit testing framework
- **React Testing Library** 16.3.0 - Component testing
- **MSW** 2.12.2 - API mocking for tests

## Responsive Breakpoints

- **Mobile**: < 640px - 2 columns (ID, Title)
- **Small Tablet**: ≥ 640px - 3 columns (+ Status)
- **Tablet**: ≥ 768px - 4 columns (+ Priority)
- **Desktop**: ≥ 1024px - 6 columns (+ Category, Level)
- **Large Desktop**: ≥ 1280px - All 7 columns (+ Assigned To)

## Testing

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

For detailed testing documentation, see [README.testing.md](./README.testing.md)

## Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The build output will be in the `dist/` directory.

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Testing
npm test             # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
```

## Troubleshooting

### CSS not loading / Styling issues
If CSS (Tailwind) is not loading after cloning to a new machine:
```bash
# Clean install and clear cache
rm -rf node_modules package-lock.json
npm install
rm -rf node_modules/.vite
npm run dev
```

### Port 5173 is already in use
```bash
# Kill the process using port 5173
kill -9 $(lsof -t -i:5173)

# Or use a different port
npm run dev -- --port 3000
```

### Authentication issues
- Clear browser localStorage: Open DevTools → Application → Local Storage → Clear
- Check that JWT token is being saved after login
- Verify backend is returning proper token format

### Build errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Security Notes

- **JWT Tokens** are stored in localStorage
- **API calls** are protected with Bearer token authentication
- **Role-based access** is enforced on both frontend and backend
- **Environment variables** should never be committed to git

## License

This project is private and confidential.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
