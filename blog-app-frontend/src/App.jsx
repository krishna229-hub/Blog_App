import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";
import RootLayout from "./components/RootLayout";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import AddArticle from "./components/AddArticle";
import UserProfile from "./components/UserProfile";
import AuthorProfile from "./components/AuthorProfile";
import Article from "./components/Article";
import AuthorDashboard from "./components/AuthorDashboard";
import UserDashboard from "./components/UserDashboard";
import EditArticleForm from "./components/EditArticleForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";
import ErrorComponent from "./components/ErrorComponent";

function App() {
  const [count, setCount] = useState(0);
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement:<ErrorComponent />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "add-article",
          element: <AddArticle />,
        },
        {
          path: "user-profile",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserProfile />
            </ProtectedRoute>
          ),
          children: [],
        },
        {
          path: "author-profile",
          element: (
            <ProtectedRoute allowedRoles={["AUTHOR"]}>
              <AuthorProfile />
            </ProtectedRoute>
          ),
          children: [],
        },
        {
          path: "article/:id",
          element: (
            <ProtectedRoute allowedRoles={["USER", "AUTHOR"]}>
              <Article />
            </ProtectedRoute>
          ),
        },
        {
          path: "author-dashboard",
          element: (
            <ProtectedRoute allowedRoles={["AUTHOR"]}>
              <AuthorDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "user-dashboard",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "edit-article",
          element: <EditArticleForm />,
        },
        {
          path: "unauthorized",
          element: <Unauthorized />,
        },
      ],
    },
  ]);
  return (
    <>
      <Toaster position="top-center" />
      <RouterProvider router={routerObj}></RouterProvider>
    </>
  );
}

export default App;