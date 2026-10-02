import { create } from "zustand";
import { persist } from "zustand/middleware";
import { io, Socket } from "socket.io-client";
import { toast } from "@/stores/useToastStore";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  orderCode?: string;
  createdAt: string;
  read: boolean;
  type: "ORDER_STATUS" | "NEW_ORDER" | "GENERAL";
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  socket: Socket | null;
  connectSocket: (token: string, role?: string) => void;
  disconnectSocket: () => void;
  addNotification: (item: Omit<NotificationItem, "id" | "createdAt" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1234";

const STATUS_MAP: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao hàng",
  COMPLETED: "Hoàn thành",
  DELIVERED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  REFUNDED: "Đã hoàn tiền",
};

export const translateStatusInMessage = (msg?: string): string => {
  if (!msg) return "";
  let result = msg;
  Object.keys(STATUS_MAP).forEach((code) => {
    // Replace [PENDING] with [Chờ xác nhận]
    result = result.replace(new RegExp(`\\[${code}\\]`, "g"), `[${STATUS_MAP[code]}]`);
  });

  // Convert 'chuyển trạng thái từ [X] sang [Y]' or 'đã được [Y]' -> 'đã được chuyển sang trạng thái [Y]'
  result = result.replace(/đã chuyển trạng thái từ \[[^\]]+\] sang (\[[^\]]+\])/gi, "đã được chuyển sang trạng thái $1");
  result = result.replace(/đã được (\[[^\]]+\])/gi, "đã được chuyển sang trạng thái $1");

  return result;
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      socket: null,

      connectSocket: (token: string, role?: string) => {
        if (!token) return;

        // Disconnect existing socket if connected
        const currentSocket = get().socket;
        if (currentSocket) {
          currentSocket.disconnect();
        }

        try {
          const socketUrl = `${BACKEND_BASE_URL}/notifications`;
          const socket = io(socketUrl, {
            auth: { token },
            query: { token },
            extraHeaders: {
              authorization: `Bearer ${token}`,
            },
            transports: ["websocket", "polling"],
            reconnection: true,
          });

          socket.on("connect", () => {
            console.log("🟢 [Socket.IO] Real-time notification connected:", socket.id);
          });

          // Listen for Order Status Updates (For Customer)
          socket.on("order_status_updated", (data: any) => {
            console.log("🔔 [Socket.IO] order_status_updated:", data);

            let rawMsg = "";
            if (data.newStatus) {
              const newText = STATUS_MAP[data.newStatus] || data.newStatus;
              rawMsg = `Đơn hàng ${data.orderCode} đã được chuyển sang trạng thái [${newText}].`;
            } else {
              rawMsg = data.message || `Đơn hàng ${data.orderCode} đã được cập nhật.`;
            }

            const cleanMsg = translateStatusInMessage(rawMsg);

            get().addNotification({
              title: `Đơn hàng ${data.orderCode || ""} được cập nhật`,
              message: cleanMsg,
              orderCode: data.orderCode,
              type: "ORDER_STATUS",
            });
          });

          // Listen for New Order Alerts (For Admin)
          socket.on("new_order", (data: any) => {
            console.log("🔔 [Socket.IO] new_order:", data);
            const message = data.message || `Có đơn hàng mới ${data.orderCode}!`;

            if (role === "ADMIN") {
              toast.success(message);
              get().addNotification({
                title: "Đơn hàng mới",
                message: message,
                orderCode: data.orderCode,
                type: "NEW_ORDER",
              });
            }
          });

          socket.on("disconnect", () => {
            console.log("🔴 [Socket.IO] Disconnected");
          });

          set({ socket });
        } catch (err) {
          console.error("Lỗi khi kết nối Real-time Notification Socket:", err);
        }
      },

      disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
          socket.disconnect();
          set({ socket: null });
        }
      },

      addNotification: (item) => {
        const newNotif: NotificationItem = {
          ...item,
          message: translateStatusInMessage(item.message),
          id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
          createdAt: new Date().toISOString(),
          read: false,
        };

        const updated = [newNotif, ...get().notifications];
        const unread = updated.filter((n) => !n.read).length;

        set({
          notifications: updated,
          unreadCount: unread,
        });
      },

      markAsRead: (id: string) => {
        const updated = get().notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
        const unread = updated.filter((n) => !n.read).length;

        set({
          notifications: updated,
          unreadCount: unread,
        });
      },

      markAllAsRead: () => {
        const updated = get().notifications.map((n) => ({ ...n, read: true }));
        set({
          notifications: updated,
          unreadCount: 0,
        });
      },

      clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      },
    }),
    {
      name: "luminabook-notifications",
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);
