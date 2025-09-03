# Gigabit Feedback Vault

A task and feedback management system where employees can submit feedback, and admins can analyze team performance.

**Live Demo:** [https://gigabit-feedback-vault-2025.netlify.app/](https://gigabit-feedback-vault-2025.netlify.app/)  
**GitHub Repository:** [https://github.com/ZubairAlMamun2/Gigabit-Feedback-Vault](https://github.com/ZubairAlMamun2/Gigabit-Feedback-Vault)

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
- ChatGPT auto-summary feature is currently mocked; actual API integration is pending.
- Drag-and-drop task reordering works, but simultaneous edits may overwrite changes.
- CORS issues may appear if the frontend URL changes (update `cors` origins in backend).
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
cp .env.example .env
# Update .env with your MongoDB URI and JWT_SECRET
npm run dev
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```
