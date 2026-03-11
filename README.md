# Portfolio Website

Modern portfolio site with:

- cinematic React frontend
- Express backend
- MongoDB storage for projects and contact submissions
- styled email delivery for contact form submissions

## Project Structure

- `frontend`: Vite + React + TypeScript UI
- `backend`: Express API + MongoDB models

## Local Setup

Frontend:

```sh
cd frontend
npm install
copy .env.example .env
npm run dev
```

Backend:

```sh
cd backend
npm install
copy .env.example .env
npm start
```

## Contact Form

The `/api/contact` route now:

1. validates the submission
2. stores the message in MongoDB
3. sends a styled notification email to `raviranjan01b@gmail.com`
4. sends an automatic confirmation email back to the sender

Required backend environment variables:

```env
MONGO_URI=your-mongodb-connection-string
CLIENT_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=raviranjan01b@gmail.com
SMTP_PASS=your-gmail-app-password
CONTACT_TO_EMAIL=raviranjan01b@gmail.com
CONTACT_FROM_NAME=Ravi Ranjan Portfolio
```

Required frontend environment variable:

```env
VITE_API_URL=http://localhost:5000/api
```

## Seed Projects

```sh
cd backend
npm run seed
```

## Deployment

See [DEPLOYMENT.md](/c:/Project+/Portfolio/Portfolio_3/editorial-canvas-main/DEPLOYMENT.md) for the full MongoDB Atlas + Render + Vercel deployment flow.
