# Gigabit Feedback Vault

A task and feedback management system where employees can submit feedback, and admins can analyze team performance.

**Live Demo:** 
- Frontend: [https://gigabit-feedback-vault-2025.netlify.app](https://gigabit-feedback-vault-2025.netlify.app)
- Backend: [https://gigabit-feedback-vault-backend.vercel.app](https://gigabit-feedback-vault-backend.vercel.app)

---

## Project Architecture

### Frontend
- **Framework:** React (Vite.js)  
- **Styling:** Tailwind CSS  
- **Routing:** React Router  
- **Features:**
  - User authentication (Login/Register)
  - Feedback submission
  - Admin dashboard with summary charts
  - Dark/Light theme toggle stored in `localStorage`

### Backend
- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** MongoDB  
- **ORM:** Mongoose  
- **Features:**
  - REST API with secure endpoints
  - JWT authentication
  - Feedback aggregation (average ratings & comments)
  - Basic rate limiting & abuse prevention
  - CORS configured for frontend domains

### Data Flow
1. User interacts with the React frontend.
2. Frontend calls Express API endpoints.
3. Express performs CRUD operations on MongoDB.
4. Admin receives aggregated feedback via charts.

---

## Known Issues
- First Render deployment may take 50–60 seconds to “wake up” if idle.
- Currently, feedback data is not paginated (all records load at once).
- ChatGPT auto-summary feature is currently mocked; actual API integration is pending.
- CORS may block requests if backend is not whitelisted correctly.
- Passwords are stored in plain text (consider hashing before production).

---

## How to Run Locally

### Prerequisites
- Node.js v18+  
- MongoDB running locally or via cloud  
- npm or yarn

### Backend
```bash
cd backend
npm install
# Update .env with your MongoDB URI and JWT_SECRET
npm start
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```
### Folder Structure
```bash
Gigabit-Feedback-Vault/
│
├── gigabit-feedback-vault-backend/         # Node.js + Express + Mongoose API
│   ├── models/                             # Mongoose schemas
│   ├── config/                             # Database connection
│   ├── routes/                             # Express routes
│   ├── middleware/                         # Auth / Admin middlewares
│   ├── index.js                            # Entry point
│   ├── .env                                # Environment variables
│   └── package.json
│
├── gigabit-feedback-vault-frontend/        # React + Vite + Tailwind app
│   ├── src/
│   │   ├── assets/        
│   │   ├── component/                      # Reusable UI components
│   │   ├── layout/                         # Layouts (AuthLayout, etc.)
│   │   ├── context/                        # Share globaly (User, Theme, etc.)
│   │   ├── routes/                         # React Router config
│   │   ├── index.css           
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── docs/                      # Documentation
│   └── Postman_Collection.json
│
├── README.md                  # Project documentation
└── .gitignore

```
## API Documentation
API documentation is available via Postman Collection.

- File: `/docs/Postman_Collection.json`
- Import into Postman to test all endpoints.