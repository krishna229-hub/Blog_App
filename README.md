#  MERN Stack Blog Application

A complete, professional MERN stack blog application featuring dynamic role-based access control, article publication workflows, profile management, and a modern responsive user interface.

##  Project Overview

This project is a multi-role blogging platform where:
*   **Readers (Users)** can browse published articles, search/filter, read content, leave comments, and like posts.
*   **Authors** have a dedicated workspace to draft, publish, edit, archive, and delete articles, as well as view engagement analytics.
*   **Admins** manage the platform, supervise users (with the ability to block/unblock users), and manage article compliance.

The codebase is split into a **Frontend React client** (Vite + Tailwind CSS v4) and a **Backend REST API** (Express + MongoDB + Cloudinary).

---

##  Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Zustand (State Management), Axios, React Router v7, React Hook Form, React Hot Toast |
| **Backend** | Node.js, Express, MongoDB (Mongoose ODM), JWT (Authentication), Cookie Parser, Multer, Cloudinary SDK |
| **Hosting** | **Frontend**: Vercel (SPA Router configured) <br> **Backend**: Render Web Service & Vercel Serverless |

---

##  Repository Structure

```text
Capstone Project/
├── BLOG-APP-BACKEND/          # Express REST API
│   ├── APIs/                  # Role-based route controllers (User, Author, Admin, Common)
│   ├── config/                # Multer & Cloudinary upload configurations
│   ├── middlewares/           # Authentication & Authorization middlewares
│   ├── models/                # Mongoose Database Schemas (User, Article)
│   ├── services/              # Authentication & business helper services
│   ├── Server.js              # Application entry point & Database connection
│   └── vercel.json            # Vercel deployment configuration
│
└── blog-app-frontend/         # React SPA Client
    ├── src/
    │   ├── Components/        # UI components, layout structures, and pages
    │   ├── store/             # Zustand state management (Authentication store)
    │   ├── App.jsx            # Routing configurations & application layout
    │   └── config.js          # API connection URL config
    └── vite.config.js         # Vite bundler options
```

---

##  Key Features

1.  **Role-Based Access Control (RBAC):** Users, Authors, and Admins are served custom dashboards and have secure routes validated on both the frontend and backend.
2.  **JWT Authentication via HTTP-Only Cookies:** Secure login flow storing sessions in secure, cross-site cookies, preventing XSS token theft.
3.  **Dynamic Article Management:** Authors can manage draft states, edit, or archive articles, which immediately updates public/private dashboards.
4.  **Cloud Image Uploads:** User profile pictures and article assets are processed locally using Multer and hosted on Cloudinary.
5.  **Clean & Modern UI:** Designed with cohesive gradients, dark mode features, and dynamic animations utilizing Tailwind CSS v4.

---

## Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+) and [MongoDB](https://www.mongodb.com/) installed or access to a MongoDB Atlas cluster.

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd BLOG-APP-BACKEND
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `BLOG-APP-BACKEND/` with the following variables:
   ```env
   PORT=4000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   ```
4. Run the backend server locally:
   ```bash
   npm start
   ```
   *The backend will run on `http://localhost:4000`.*

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../blog-app-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify or edit the backend API URL in `src/config.js`:
   ```javascript
   export const API_URL = "http://localhost:4000";
   ```
4. Run the frontend development server:
   ```bash
   npm run dev
   ```
   *The app will be accessible at `http://localhost:5173`.*

---

##  Deployment Configuration

*   **Backend Deployment**: Ready for **Render** (via standard node listener) and **Vercel** (configured as serverless function). The server dynamically checks `process.env.VERCEL` to prevent binding conflicts on serverless runtimes.
*   **Frontend Deployment**: Configured for **Vercel** with a `vercel.json` rewrite configuration to support React Router single-page application routing without 404 errors on refreshes.
