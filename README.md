# Admin-Driven Rule-Engine Utility Bill Calculator

A professional web application for calculating utility bills with admin-configurable pricing rules.

## Tech Stack

- **Frontend**: React (TypeScript), Tailwind CSS, Axios
- **Backend**: NestJS (TypeScript), TypeORM
- **Database**: PostgreSQL (Neon)
- **PDF Generation**: jsPDF

## Features

- 📊 Dynamic bill calculation based on admin-configured pricing
- 🔐 Admin panel for managing pricing rules (rate, VAT, service charge)
- 📄 Professional PDF bill generation
- 🌌 Deep-tech dark themed UI
- 📱 Responsive design

## Project Structure

```
Project/
├── backend/          # NestJS backend
│   └── src/
├── frontend/         # React frontend
│   └── src/
└── README.md
```

## Setup Instructions

### Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Environment Variables

**Backend (.env)**:
```
DATABASE_URL=your_postgresql_connection_string
ADMIN_SECRET=12345
PORT=3000
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**:
```
VITE_API_URL=http://localhost:3000
```

## Admin Access

To access the admin panel, use the admin secret: `12345`

## Deployment

### Backend (Render)
1. Create a new Web Service
2. Connect your repository
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm run start:prod`
5. Add environment variables

### Frontend (Vercel)
1. Import your repository
2. Set root directory to `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable: `VITE_API_URL`

## Company Information

**Acme AI Ltd.**  
H #385, R #6, Mirpur DOHS, Dhaka 1216, Bangladesh  
Email: info@acmeai.tech  
Web: www.acmeai.tech
