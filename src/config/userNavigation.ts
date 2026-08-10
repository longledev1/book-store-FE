import React from "react";
import { 
  User, 
  ShoppingBag, 
  History, 
  LockKeyhole 
} from "lucide-react";

export interface UserNavItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
}

export const userMenuConfig: UserNavItem[] = [
  {
    name: "Thông tin cá nhân",
    path: "/profile",
    icon: User,
  },
  {
    name: "Đơn hàng của tôi",
    path: "/profile/orders",
    icon: ShoppingBag,
  },
  {
    name: "Lịch sử mua hàng",
    path: "/profile/purchase-history",
    icon: History,
  },
  {
    name: "Đổi mật khẩu",
    path: "/profile/change-password",
    icon: LockKeyhole,
  },
];
