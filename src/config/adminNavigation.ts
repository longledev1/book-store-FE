import React from "react";
import { 
  LayoutDashboard, 
  BookMarked, 
  ShoppingBag, 
  Users, 
  PenTool 
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
      { name: "Danh sách sách", path: "/admin/books" },
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
  }
];
