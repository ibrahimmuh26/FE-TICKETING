# Helpdesk Ticketing System - Frontend

A modern, responsive helpdesk ticketing system built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Multi-level Support System** (L1, L2, L3)
- **Ticket Management** - Create, view, update, and escalate tickets
- **Role-based Access Control** - Different permissions for L1, L2, L3 users
- **Real-time Activity Logs** - Track all ticket activities
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Critical Value Assignment** - For L2 users to mark critical tickets
- **Pagination** - Efficient data loading with customizable page size
- **Search & Filters** - Find tickets by ID, title, status, priority, or escalation level

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** v20.8.1 or higher
- **npm** v10.1.0 or higher
- **Backend API** running on `http://localhost:8021`

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd helpdesk-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment (Optional)**

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

## 🏃 Running the Application

### Start the Frontend

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

> **Note:** Make sure the backend API is running on `http://localhost:8021` for the application to work properly. See backend setup instructions below if needed.


### Frontend (.env - Optional)

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

### Backend (.env - Required)

```env
# Server Configuration
PORT=8021
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/helpdesk

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS (Optional)
ALLOWED_ORIGINS=http://localhost:5173
```

## 🌟 Key Features by Role

### L1 (Support Agent)
- ✅ Create new tickets
- ✅ View all tickets
- ✅ Update L1 tickets (add resolution notes, change status)
- ✅ Escalate tickets to L2 with reason
- ✅ Search and filter tickets

### L2 (Senior Support)
- ✅ View all tickets
- ✅ Update L2 tickets (add resolution notes, change status)
- ✅ Assign critical values (C1, C2, C3)
- ✅ Escalate tickets to L3 with reason
- ✅ Search and filter tickets

### L3 (Admin)
- ✅ View all tickets
- ✅ Update L3 tickets
- ✅ Resolve tickets with final resolution
- ✅ Full system access
- ✅ View all activity logs
- ✅ Search and filter tickets

## 📱 Responsive Breakpoints

- **Mobile**: < 640px - 2 columns (ID, Title)
- **Small Tablet**: ≥ 640px - 3 columns (+ Status)
- **Tablet**: ≥ 768px - 4 columns (+ Priority)
- **Desktop**: ≥ 1024px - 6 columns (+ Category, Level)
- **Large Desktop**: ≥ 1280px - All 7 columns (+ Assigned To)

## 🐛 Troubleshooting

### Port 5173 is already in use
```bash
# Kill the process using port 5173
kill -9 $(lsof -t -i:5173)

# Or use a different port
npm run dev -- --port 3000
```

### Port 8021 is already in use (Backend)
```bash
# Kill the process using port 8021
kill -9 $(lsof -t -i:8021)

# Or change PORT in backend .env file
```

### Backend connection refused
- Make sure backend is running on `http://localhost:8021`
- Check CORS settings in backend (should allow `http://localhost:5173`)
- Verify API endpoints match backend routes
- Check backend console for errors

### Authentication issues
- Clear browser localStorage: Open DevTools → Application → Local Storage → Clear
- Check that JWT token is being saved after login
- Verify backend is returning proper token format
- Check token expiration time in backend

### Build errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### MongoDB connection errors (Backend)
```bash
# Make sure MongoDB is running
# For macOS:
brew services start mongodb-community

# For Linux:
sudo systemctl start mongod

# For Windows:
net start MongoDB
```

## 📊 Available Scripts

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

## 🔒 Security Notes

- **JWT Tokens** are stored in localStorage
- **API calls** are protected with Bearer token authentication
- **Role-based access** is enforced on both frontend and backend
- **CORS** should be properly configured in backend
- **Environment variables** should never be committed to git
- Change **JWT_SECRET** in production to a strong random string

## 📝 API Request Examples

### Login
```bash
curl -X POST http://localhost:8021/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"password123"}'
```

### Get Tickets (with auth)
```bash
curl http://localhost:8021/tickets?page=1&limit=10 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Ticket (L1 only)
```bash
curl -X POST http://localhost:8021/tickets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Laptop screen broken",
    "description": "Screen has cracks",
    "category": "Hardware",
    "priority": "high",
    "expectedCompletionDate": "2024-12-31T00:00:00.000Z"
  }'
```

## 📄 License

This project is private and confidential.

## 👥 Contributors

- Development Team

## 📞 Support

For issues or questions, please contact the development team or open an issue in the repository.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
# FE-TICKETING
