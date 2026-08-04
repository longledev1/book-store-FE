import React from "react";
import { createBrowserRouter } from "react-router-dom";

// Layouts
import ClientLayout from "../components/layout/ClientLayout";
import AdminLayout from "../components/layout/AdminLayout";
import AuthLayout from "../components/layout/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

// Client Pages
import HomePage from "../pages/client/HomePage";
import BooksPage from "../pages/client/BooksPage";
import BookDetailPage from "../pages/client/BookDetailPage";
import CartPage from "../pages/client/CartPage";
import CheckoutPage from "../pages/client/CheckoutPage";
import BlogPage from "../pages/client/BlogPage";
import BlogDetailPage from "../pages/client/BlogDetailPage";
import ProfilePage from "../pages/client/ProfilePage";
import AuthorDetailPage from "../pages/client/AuthorDetailPage";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

// Admin Pages
import DashboardPage from "../pages/admin/DashboardPage";
import BookManagementPage from "../pages/admin/books/BookManagementPage";
import OrderManagementPage from "../pages/admin/OrderManagementPage";
import UserManagementPage from "../pages/admin/UserManagementPage";
import BlogManagementPage from "../pages/admin/BlogManagementPage";

const router = createBrowserRouter([
  // Client Route Configuration
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "books",
        element: <BooksPage />
      },
      {
        path: "books/:id",
        element: <BookDetailPage />
      },
      {
        path: "cart",
        element: <CartPage />
      },
      {
        path: "checkout",
        element: <CheckoutPage />
      },
      {
        path: "blog",
        element: <BlogPage />
      },
      {
        path: "blog/:id",
        element: <BlogDetailPage />
      },
      {
        path: "author/:name",
        element: <AuthorDetailPage />
      },
      // Protected Client Profile route
      {
        element: <ProtectedRoute allowedRoles={["customer", "admin"]} />,
        children: [
          {
            path: "profile",
            element: <ProfilePage />
          }
        ]
      }
    ]
  },

  // Auth Route Configuration
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "register",
        element: <RegisterPage />
      },
      {
        path: "reset-password/:token",
        element: <ResetPasswordPage />
      }
    ]
  },

  // Admin Route Configuration (Protected)
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />
          },
          {
            path: "books",
            element: <BookManagementPage />
          },
          {
            path: "orders",
            element: <OrderManagementPage />
          },
          {
            path: "users",
            element: <UserManagementPage />
          },
          {
            path: "blogs",
            element: <BlogManagementPage />
          }
        ]
      }
    ]
  },

  // Fallback Redirect
  {
    path: "*",
    element: <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">Trang không tồn tại</div>
  }
]);

export default router;
