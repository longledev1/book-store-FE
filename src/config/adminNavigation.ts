import React from "react";
import { 
  LayoutDashboard, 
  BookMarked, 
  ShoppingBag, 
  Users, 
  PenTool,
  Image
} from "lucide-react";

export interface SubmenuItem {
  name: string;
  path: string;
}

export interface NavItem {
  name: string;
  path?: string; // Direct link path
  icon: React.ComponentType<any>;
  subItems?: SubmenuItem[]; // Dropdown links group
}

// Configurable Admin Navigation Menu Object
export const adminMenuConfig: NavItem[] = [
  { 
    name: "Tổng quan", 
    path: "/admin", 
    icon: LayoutDashboard 
  },
  { 
    name: "Quản lý Catalog", 
    icon: BookMarked,
    subItems: [
      { name: "Danh sách sản phẩm", path: "/admin/products" },
      { name: "Danh mục sách", path: "/admin/categories" },
      { name: "Danh sách tác giả", path: "/admin/authors" }
    ]
  },
  { 
    name: "Quản lý Đơn hàng", 
    icon: ShoppingBag,
    subItems: [
      { name: "Danh sách đơn hàng", path: "/admin/orders" }
    ]
  },
  { 
    name: "Quản lý Người dùng", 
    icon: Users,
    subItems: [
      { name: "Danh sách thành viên", path: "/admin/users" }
    ]
  },
  { 
    name: "Quản lý Blog & SEO", 
    icon: PenTool,
    subItems: [
      { name: "Danh sách bài viết", path: "/admin/blogs" },
      { name: "Tạo bài viết mới", path: "/admin/blogs/new" }
    ]
  },
  {
    name: "Quản lý Media",
    path: "/admin/media",
    icon: Image
  }
];
