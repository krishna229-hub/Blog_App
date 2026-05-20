# ⚙️ MERN Blog Application Backend REST API

This directory contains the Node.js, Express, and MongoDB backend for the MERN Blog Application. It implements role-based access control (RBAC), secure authentication using JWT inside HTTP-only cookies, and image uploading powered by Multer and Cloudinary.

---

##  Project Structure

```text
BLOG-APP-BACKEND/
├── APIs/                  # Express route controllers grouped by role
│   ├── AdminAPI.js        # Admin routes (user management, blocking/unblocking)
│   ├── AuthorAPI.js       # Author routes (article CRUD, analytics, states)
│   ├── UserAPI.js         # Reader/User routes (comments, likes, reading)
│   └── CommonAPI.js       # Public/Shared routes (registration, login, logout, check auth)
│
├── config/                # Third-party service configurations
│   ├── cloudinary.js      # Cloudinary credential configurations
│   ├── cloudinaryUpload.js# Upload helper configurations
│   └── multer.js          # Multer storage configuration for handling file uploads
│
├── middlewares/           # Custom Express middlewares
│   ├── verifyToken.js     # JWT token validation & payload extraction
│   ├── validAdmin.js      # Middleware restricting routes to Admins
│   ├── validAuthor.js     # Middleware restricting routes to Authors
│   └── validUser.js       # Middleware restricting routes to Users (Readers)
│
├── models/                # Mongoose Database Models
│   ├── UserModel.js       # Schema representing User accounts (Admins, Authors, Users)
│   └── ArticleModel.js    # Schema representing Blog Articles (and comments/likes)
│
├── services/              # Core business services
│   └── AuthServices.js    # Authentication logic (registration, password hashing, verification)
│
├── Server.js              # Application entry point, database connection, middleware stack
├── package.json           # Scripts, metadata, and dependencies
└── vercel.json            # Deployment configuration for Vercel Serverless
```

---

## Tech Stack & Key Libraries

*   **Node.js & Express**: Core REST API framework.
*   **Mongoose**: ODM to interface with MongoDB.
*   **jsonwebtoken (JWT)**: Secure user session token generation.
*   **bcryptjs**: Safe hashing of user credentials.
*   **cookie-parser**: Extracts JWT tokens from secure HTTP-only cookies.
*   **cors**: Cross-Origin Resource Sharing control.
*   **multer & cloudinary**: Local multi-part file intercepting and secure hosting of media assets.

---

##  Core API Endpoints

###  Public / Common API (`/common-api`)
*   `POST /common-api/user`: Registers a new user.
*   `POST /common-api/login`: Authenticates credentials, issues HTTP-only JWT cookie.
*   `GET /common-api/logout`: Clears the authentication cookies.
*   `GET /common-api/check-auth`: Verifies cookie token, returns active session payload.
*   `GET /common-api/articles`: Fetches all public, active articles.
*   `GET /common-api/articles/:id`: Fetches a single article by its identifier.

### 👤 Reader API (`/user-api`)
*   `POST /user-api/comment/:articleId`: Adds a comment to an article.
*   `PUT /user-api/like/:articleId`: Toggles like status on a post.

###  Author API (`/author-api`)
*   `POST /author-api/article`: Creates a new article (draft state).
*   `PUT /author-api/article`: Updates article details.
*   `DELETE /author-api/article/:articleId`: Deletes/Archives a specific post.
*   `GET /author-api/articles/:username`: Retrieves all articles authored by the user.

### Admin API (`/admin-api`)
*   `GET /admin-api/users`: Fetches list of all accounts.
*   `PUT /admin-api/user/status`: Blocks or unblocks a specific user account.

---

##  Setup & Development

### 1. Environment Variables (`.env`)
Create a `.env` file in the root of the backend directory:
```env
PORT=4000
MONGO_URL=mongodb+srv://...
JWT_SECRET=your_secret_string
CLOUD_NAME=cloudinary_cloud_name
API_KEY=cloudinary_api_key
API_SECRET=cloudinary_api_secret
```

### 2. Commands
*   **Install dependencies**:
    ```bash
    npm install
    ```
*   **Run local dev server**:
    ```bash
    npm start
    ```

---

##  Deployment Details

The backend is configured for hybrid deployment:
1.  **Vercel Serverless Functions**: Configured in `vercel.json` to map all endpoints to `Server.js`.
2.  **Render Web Services**: The application includes dynamic environment detection. It checks `process.env.VERCEL` before calling `app.listen()`. Since Render runs as a persistent service and is not Vercel, the listener runs, successfully binding the process to Render's dynamic host port.