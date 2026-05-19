import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";
import RootLayout from "./Components/RootLayout";
import Home from "./Components/Home";
import Register from "./Components/Register";
import Login from "./Components/Login";
import AddArticle from "./Components/AddArticle";
import UserProfile from "./Components/UserProfile";
import AuthorProfile from "./Components/AuthorProfile";
import Article from "./Components/Article";
import AuthorDashboard from "./Components/AuthorDashboard";
import UserDashboard from "./Components/UserDashboard";
import EditArticleForm from "./Components/EditArticleForm";
import ProtectedRoute from "./Components/ProtectedRoute";
import Unauthorized from "./Components/Unauthorized";
import ErrorComponent from "./Components/ErrorComponent";

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