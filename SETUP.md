# Project Setup Instructions

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Neon account)
- npm or yarn package manager

## Quick Start

### 1. Clone and Setup Backend

```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```
DATABASE_URL=postgresql://neondb_owner:npg_Oj7PtmdiKGp1@ep-shiny-glitter-a1rlwzax-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
ADMIN_SECRET=12345
PORT=3000
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npm run start:dev
```

Backend will run on http://localhost:3000

### 2. Setup Frontend

Open a new terminal:
```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:
```
VITE_API_URL=http://localhost:3000
```

Start the frontend:
```bash
npm run dev
```

Frontend will run on http://localhost:5173

## Testing the Application

1. **Open Browser**: Navigate to http://localhost:5173

2. **Test Calculator**:
   - Click "Calculator" tab
   - Enter units consumed (e.g., 100)
   - Click "Calculate Bill"
   - View the breakdown
   - Click "Download Bill PDF"

3. **Test Admin Panel**:
   - Click "Admin Panel" tab
   - Enter admin secret: `12345`
   - Update pricing values
   - Click "Update Configuration"
   - Go back to calculator and verify new rates

## API Endpoints

### GET /api/config
Get current active pricing configuration
- No authentication required
- Returns: PricingConfig object

### PUT /api/config
Update pricing configuration (Admin only)
- Headers: `x-admin-secret: 12345`
- Body: `{ rate_per_unit, vat_percentage, service_charge }`
- Returns: Updated PricingConfig

### POST /api/calculate
Calculate bill for given units
- Body: `{ units: number }`
- Returns: Bill breakdown with total

## Features Implemented

✅ PostgreSQL database with TypeORM
✅ NestJS backend with validation
✅ Admin authentication via header secret
✅ React TypeScript frontend
✅ Tailwind CSS styling
✅ Dark, deep-tech themed UI
✅ Professional PDF generation
✅ Responsive design
✅ CORS enabled for deployment
✅ Error handling and validation
✅ Professional UI/UX
✅ Deployment ready (Render + Vercel)

## Project Structure

```
Project/
├── backend/
│   ├── src/
│   │   ├── bill/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── guards/
│   │   │   ├── bill.controller.ts
│   │   │   ├── bill.service.ts
│   │   │   └── bill.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── .env
├── README.md
├── DEPLOYMENT.md
└── SETUP.md
```

## Tech Stack

**Backend:**
- NestJS (TypeScript)
- TypeORM
- PostgreSQL (Neon)
- class-validator
- @nestjs/config

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Axios
- jsPDF
- Lucide React (icons)
- Vite

## Default Configuration

When the app first starts, a default pricing configuration is created:
- Rate per Unit: ৳5.00
- VAT: 15%
- Service Charge: ৳50.00

## Security Notes

⚠️ **Important for Production:**
1. Change the `ADMIN_SECRET` from default value
2. Set `synchronize: false` in TypeORM config
3. Use migrations for database schema changes
4. Add rate limiting
5. Implement proper authentication (JWT)
6. Enable HTTPS only
7. Add input sanitization
8. Implement proper logging

## Common Issues

**Backend won't start:**
- Check if port 3000 is available
- Verify DATABASE_URL is correct
- Ensure PostgreSQL database is accessible

**Frontend can't connect to backend:**
- Check VITE_API_URL in .env
- Ensure backend is running
- Check browser console for CORS errors

**PDF generation fails:**
- Check browser console for errors
- Ensure jsPDF is installed
- Verify bill calculation completes successfully

## Next Steps

1. Deploy backend to Render.com (see DEPLOYMENT.md)
2. Deploy frontend to Vercel (see DEPLOYMENT.md)
3. Test production deployment
4. Update environment variables
5. Test end-to-end functionality

## Support

For issues or questions:
- Email: info@acmeai.tech
- Check logs in terminal/browser console
- Review DEPLOYMENT.md for deployment help
