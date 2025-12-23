# Deployment Guide

## Backend Deployment (Render.com)

### Step 1: Create a New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository

### Step 2: Configure the Service
- **Name**: bill-calculator-backend
- **Region**: Singapore (or closest to you)
- **Branch**: main
- **Root Directory**: backend
- **Runtime**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`

### Step 3: Add Environment Variables
Add these in the "Environment" section:
```
DATABASE_URL=your_neon_database_url
ADMIN_SECRET=12345
PORT=3000
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

### Step 4: Deploy
Click "Create Web Service" and wait for deployment to complete.

---

## Frontend Deployment (Vercel)

### Step 1: Import Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository

### Step 2: Configure Build Settings
- **Framework Preset**: Vite
- **Root Directory**: frontend
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Add Environment Variables
Add in "Environment Variables" section:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### Step 4: Deploy
Click "Deploy" and wait for deployment to complete.

---

## Post-Deployment Steps

1. **Update Backend CORS**:
   - After frontend is deployed, update the `FRONTEND_URL` environment variable in Render
   - Add your Vercel URL to the CORS origins

2. **Test the Application**:
   - Visit your Vercel URL
   - Try calculating a bill
   - Test the admin panel with secret: `12345`
   - Update pricing configuration
   - Generate a PDF

3. **Database Initialization**:
   - The first time you access the calculator, the default pricing config will be created automatically
   - Rate: ৳5.00 per unit
   - VAT: 15%
   - Service Charge: ৳50.00

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches your Vercel deployment URL
- Check that backend is running and accessible

### Database Connection Issues
- Verify `DATABASE_URL` is correct in Render environment variables
- Ensure Neon database allows connections from Render IPs
- Check database SSL settings

### Build Failures
- Check build logs in Render/Vercel dashboard
- Ensure all dependencies are in package.json
- Verify Node version compatibility

---

## Local Development

### Backend
```bash
cd backend
npm install
npm run start:dev
```
Runs on http://localhost:3000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173

---

## Environment Variables Reference

### Backend (.env)
```
DATABASE_URL=postgresql://neondb_owner:npg_Oj7PtmdiKGp1@ep-shiny-glitter-a1rlwzax-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
ADMIN_SECRET=12345
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```
