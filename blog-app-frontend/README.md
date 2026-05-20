# 💻 MERN Blog Application Frontend Client

This directory houses the frontend user interface for the MERN Blog Application. It is a Single Page Application (SPA) built using React 19, powered by Vite for rapid development, styled using Tailwind CSS v4, and managed via a light Zustand state store.

---

## 📂 Project Structure

```text
blog-app-frontend/
├── src/
│   ├── Components/            # Page layouts and view components
│   │   ├── Home.jsx           # Public landing page displaying latest posts
│   │   ├── Login.jsx / Register.jsx # Authentication forms (with role selection)
│   │   ├── Header.jsx / Footer.jsx  # Layout navigation and footer
│   │   ├── RootLayout.jsx     # Master wrapper containing Navbar, Content, and Footer
│   │   │
│   │   ├── UserDashboard.jsx  # View for readers (browse, filter, view articles)
│   │   ├── AuthorDashboard.jsx# View for writers (creation hub, draft/publish lists)
│   │   ├── AdminDashboard.jsx # View for administrators (user management log)
│   │   │
│   │   ├── ProtectedRoute.jsx # Route interceptor validating access by user roles
│   │   ├── Article.jsx        # Article page (with comments & like systems)
│   │   ├── AddArticle.jsx     # Content publishing workspace for authors
│   │   ├── EditArticleForm.jsx# Article editing workspace for authors
│   │   ├── AuthorProfile.jsx  # Profile page for authors (public/private posts)
│   │   ├── UserProfile.jsx    # Basic profile view for reader accounts
│   │   └── Unauthorized.jsx   # Fallback page for restricted routes
│   │
│   ├── store/                 # Global state management
│   │   └── authStore.js       # Zustand authentication store (login/logout/check auth state)
│   │
│   ├── styles/ / assets/      # Styling guidelines and media resources
│   ├── config.js              # Endpoint and environment URL routing
│   ├── App.jsx                # Router configuration & component layout map
│   └── main.jsx               # DOM rendering initialization
```

---

## ⚙️ Key Technical Features

### 1. Global State Management (Zustand)
Session states (`currentUser`, `loading`, `isAuthenticated`) are stored globally using Zustand in `src/store/authStore.js`. It exposes simple async functions like `login`, `logout`, and `checkAuth` that interact with backend endpoints using Axios (with cookies enabled via `{ withCredentials: true }`).

### 2. Route Protection (`ProtectedRoute.jsx`)
Standard routes are secure by default. The custom Router guard wrapper restricts views to authorized users:
*   Redirects unauthenticated users to `/login`.
*   Restricts access to specific roles (e.g., preventing a Reader from accessing `/author-dashboard`).
*   Directs unauthorized users to `/unauthorized`.

### 3. Styled with Tailwind CSS v4
Modern typography and slick interfaces styled with Tailwind CSS v4 utility classes. Features include dark-themed layouts, glassmorphism, responsive cards, form styling, and animations.

---

## 💻 Setup & Development

### 1. API Configuration
Open `src/config.js` and set the endpoint corresponding to your server environment:
```javascript
export const API_URL = "http://localhost:4000"; // Local backend
// OR "https://your-production-api.render.com" for production
```

### 2. Commands
*   **Install dependencies**:
    ```bash
    npm install
    ```
*   **Start development server**:
    ```bash
    npm run dev
    ```
    *Starts on `http://localhost:5173`.*
*   **Build production package**:
    ```bash
    npm run build
    ```
*   **Preview production build locally**:
    ```bash
    npm run preview
    ```

---

## 🌐 Deployment Configuration

The frontend is ready to deploy on platforms like **Vercel**. 
The configuration file `vercel.json` ensures that all routes redirect back to `index.html` (SPA routing) so that page refreshes on subroutes do not throw `404 Not Found` errors:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
