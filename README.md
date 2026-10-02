# Bookstore Frontend Application

Giao diện người dùng (Client) và hệ thống quản trị (Admin) cho nền tảng thương mại điện tử Nhà sách trực tuyến, được phát triển bằng **React 19**, **TypeScript**, **Vite** và **Tailwind CSS v4**.

---

## 🌟 Tính năng nổi bật

### 1. Phân hệ Khách hàng (Client)
- **Trang chủ (Home):** Hiển thị Banner tương tác, sách nổi bật, sách bán chạy với hiệu ứng chuyển động mượt mà.
- **Tìm kiếm & Lọc sách (Books Explorer):** 
  - Tìm kiếm thông minh hỗ trợ Semantic AI Search.
  - Bộ lọc đa năng theo Thể loại, Tác giả, Khoảng giá, và Sắp xếp linh hoạt.
- **Chi tiết sản phẩm & Tác giả:** Xem nội dung chi tiết sách, đánh giá, tiểu sử tác giả và danh sách tác phẩm liên quan.
- **Giỏ hàng & Thanh toán (Checkout):**
  - Quản lý giỏ hàng theo thời gian thực (Zustand store).
  - Tích hợp cổng thanh toán trực tuyến **VNPay Sandbox** và phương thức **COD** (Thanh toán khi nhận hàng).
  - Tự động gợi ý và chọn Địa chỉ giao hàng (Tỉnh/Thành, Quận/Huyện, Phường/Xã).
- **Xác thực bảo mật cao (Authentication):**
  - Đăng nhập / Đăng ký truyền thống (Email & Mật khẩu với JWT tự động refresh).
  - Đăng nhập nhanh một chạm qua **Google OAuth 2.0**.
  - Đăng nhập không cần mật khẩu bằng **WebAuthn / Passkey** (Sinh trắc học, FaceID, TouchID hoặc mã PIN thiết bị).
- **Hồ sơ cá nhân:** Cập nhật thông tin, quản lý Passkey và tra cứu lịch sử mua hàng.

### 2. Phân hệ Quản trị (Admin Portal)
- **Thống kê tổng quan (Dashboard):** Biểu đồ doanh thu, số lượng đơn hàng và chỉ số vận hành.
- **Quản lý Sách & Sản phẩm (Books/Products CRUD):** Thêm mới, chỉnh sửa, cập nhật số lượng tồn kho, giá bán và upload ảnh bìa / ảnh chi tiết.
- **Quản lý Thể loại (Categories) & Tác giả (Authors):** Toàn quyền quản trị danh mục thể loại và thông tin tác giả.
- **Quản lý Đơn hàng (Orders):** Theo dõi danh sách đơn hàng, xem chi tiết và cập nhật trạng thái đơn (Chờ xử lý, Đang giao, Đã giao, Đã hủy).
- **Quản lý Truyền thông (Media Manager):** Lưu trữ và quản lý kho hình ảnh của hệ thống.

---

## 🛠 Công nghệ sử dụng

- **Core:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Giao diện & Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/), [Base UI](https://base-ui.com/), [Swiper](https://swiperjs.com/)
- **Quản lý trạng thái & Xử lý dữ liệu:** [Zustand](https://zustand-demo.pmnd.rs/), [SWR](https://swr.vercel.app/), [Axios](https://axios-http.com/) (Interceptors, Token Refresh)
- **Form & Validation:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Bảo mật:** [@simplewebauthn/browser](https://simplewebauthn.dev/) (Passkeys)
- **Real-time:** [Socket.IO Client](https://socket.io/)

---

## 🚀 Hướng dẫn cài đặt và khởi chạy

### 1. Cài đặt các gói thư viện
```bash
npm install
# hoặc nếu dùng pnpm:
# pnpm install
```

### 2. Thiết lập biến môi trường (.env)
Sao chép file cấu hình mẫu `.env.example` thành `.env` (nếu cần thay đổi URL Backend):
```bash
# Trên Linux/macOS:
cp .env.example .env

# Trên Windows (Command Prompt / PowerShell):
copy .env.example .env
```

Nội dung mặc định của file `.env`:
```env
VITE_API_URL=http://localhost:1234/apis/v1
```
*(Nếu không tạo file `.env`, hệ thống sẽ tự động dùng mặc định `http://localhost:1234/apis/v1`)*.

### 3. Khởi chạy ứng dụng

```bash
# Chạy ở chế độ Development
npm run dev

# Build đóng gói ứng dụng cho Production
npm run build

# Xem trước bản build Production
npm run preview
```

Giao diện ứng dụng sẽ sẵn sàng tại:
`http://localhost:5173`
