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
import CheckoutSuccessPage from "../pages/client/CheckoutSuccessPage";
import BlogPage from "../pages/client/BlogPage";
import BlogDetailPage from "../pages/client/BlogDetailPage";
import ProfilePage from "../pages/ProfilePage";
import ProfileForm from "../components/client/profile/ProfileForm";
import MyOrdersPage from "../pages/client/profile/MyOrdersPage";
import ChangePasswordPage from "../pages/client/profile/ChangePasswordPage";
import AuthorDetailPage from "../pages/client/AuthorDetailPage";

// Auth Pages
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import AuthSuccessPage from "../pages/auth/AuthSuccessPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";

// Admin Pages
import DashboardPageManagement from "../pages/admin/dashboard/DashboardPageManagement";
import ProductManagementPage from "../pages/admin/products/ProductManagementPage";
import CategoryManagementPage from "../pages/admin/categories/CategoryManagementPage";
import OrderManagementPage from "../pages/admin/orders/OrderManagementPage";
import UserManagementPage from "../pages/admin/UserManagementPage";
import BlogManagementPage from "../pages/admin/BlogManagementPage";
import AuthorManagementPage from "../pages/admin/authors/AuthorManagementPage";
import MediaManagementPage from "../pages/admin/media/MediaManagementPage";

const router = createBrowserRouter([
  // Client Route Configuration
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "books",
        element: <BooksPage />,
      },
      {
        path: "books/:id",
        element: <BookDetailPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "checkout/success",
        element: <CheckoutSuccessPage />,
      },
      {
        path: "order/payment-result",
        element: <CheckoutSuccessPage />,
      },
      {
        path: "auth/success",
        element: <AuthSuccessPage />,
      },
      {
        path: "blog",
        element: <BlogPage />,
      },
      {
        path: "blog/:id",
        element: <BlogDetailPage />,
      },
      {
        path: "author/:name",
        element: <AuthorDetailPage />,
      },
    ],
  },

  // Protected Profile Route Configuration (No Header and Footer)
  {
    path: "/profile",
    element: <ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN"]} />,
    children: [
      {
        element: <ProfilePage />,
        children: [
          {
            index: true,
            element: <ProfileForm />,
          },
          {
            path: "orders",
            element: <MyOrdersPage />,
          },
          {
            path: "purchase-history",
            element: <MyOrdersPage />,
          },
          {
            path: "change-password",
            element: <ChangePasswordPage />,
          },
        ],
      },
    ],
  },

  // Auth Route Configuration
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "reset-password/:token",
        element: <ResetPasswordPage />,
      },
      {
        path: "verify/:token",
        element: <VerifyEmailPage />,
      },
      {
        path: "verify-email/:token",
        element: <VerifyEmailPage />,
      },
    ],
  },

  // Admin Route Configuration (Protected)
  // Admin Route Configuration (Protected)
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <DashboardPageManagement />,
          },
          {
            path: "products",
            element: <ProductManagementPage />,
          },
          {
            path: "categories",
            element: <CategoryManagementPage />,
          },
          {
            path: "orders",
            element: <OrderManagementPage />,
          },
          {
            path: "users",
            element: <UserManagementPage />,
          },
          {
            path: "blogs",
            element: <BlogManagementPage />,
          },
          {
            path: "authors",
            element: <AuthorManagementPage />,
          },
          {
            path: "media",
            element: <MediaManagementPage />,
          },
        ],
      },
    ],
  },

  // Fallback Redirect
  {
    path: "*",
    element: (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans">
        Trang không tồn tại
      </div>
    ),
  },
]);

export default router;
