# Portfolio Deployment Guide

This project is split into:

- `frontend`: Vite + React portfolio UI
- `backend`: Express + MongoDB API for projects and contact messages
- `MongoDB Atlas`: hosted database for projects and contact submissions

The contact flow now does two things:

1. Saves every submission to MongoDB
2. Sends a styled email notification to `raviranjan01b@gmail.com` and a confirmation email back to the sender

## 1. Required Accounts

- GitHub
- MongoDB Atlas
- Render
- Vercel
- Gmail account with 2-Step Verification enabled

## 2. Configure MongoDB Atlas

1. Create a free Atlas cluster.
2. Create a database user.
3. In `Network Access`, allow `0.0.0.0/0` for deployment simplicity.
4. Copy the application connection string.
5. Replace `<password>` with your database password.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster-url/portfolio?retryWrites=true&w=majority
```

## 3. Configure Gmail SMTP

Gmail will not work with your normal password here. Use an App Password.

1. Log into `raviranjan01b@gmail.com`
2. Enable 2-Step Verification
3. Open Google Account -> Security -> App passwords
4. Generate a new app password for Mail
5. Use that 16-character password as `SMTP_PASS`

Backend mail variables:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=raviranjan01b@gmail.com
SMTP_PASS=your-gmail-app-password
CONTACT_TO_EMAIL=raviranjan01b@gmail.com
CONTACT_FROM_NAME=Ravi Ranjan Portfolio
```

## 4. Deploy the Backend on Render

1. Push this repo to GitHub.
2. In Render, create `New -> Web Service`.
3. Connect the GitHub repo.
4. Use these settings:

- Root Directory: `backend`
- Environment: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

5. Add these environment variables in Render:

```env
PORT=5000
MONGO_URI=your-atlas-connection-string
CLIENT_URL=https://your-frontend-domain.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=raviranjan01b@gmail.com
SMTP_PASS=your-gmail-app-password
CONTACT_TO_EMAIL=raviranjan01b@gmail.com
CONTACT_FROM_NAME=Ravi Ranjan Portfolio
```

6. Deploy the service.
7. Open:

```text
https://your-backend.onrender.com/api/health
```

You should see database and mail status in the JSON response.

## 5. Seed Portfolio Projects

If you want the backend project list populated in Atlas:

1. Open the Render shell or run locally inside `backend`
2. Execute:

```bash
npm run seed
```

If you run it locally, make sure `MONGO_URI` points to Atlas first.

## 6. Deploy the Frontend on Vercel

1. Create `New Project` in Vercel.
2. Import the same GitHub repository.
3. Use these settings:

- Framework Preset: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

4. Add this environment variable:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

5. Deploy the project.

## 7. Update CORS After Frontend Deploy

Once Vercel gives you the final frontend URL:

1. Copy the exact deployed frontend URL
2. Set Render `CLIENT_URL` to that URL
3. Redeploy the backend

This allows the contact form to call the API from production.

## 8. Test the Full Contact Flow

1. Open the live frontend
2. Submit the contact form with a real email address
3. Confirm:

- the form succeeds
- the message is stored in MongoDB
- `raviranjan01b@gmail.com` receives the styled notification email
- the sender receives the confirmation email

## 9. Local Development

Backend:

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## 10. Live URLs

This file cannot contain your final live URLs because they are created only after you deploy on Render and Vercel. Fill these in after deployment:

- Frontend: `https://<your-vercel-domain>`
- Backend: `https://<your-render-domain>`
- Health check: `https://<your-render-domain>/api/health`
