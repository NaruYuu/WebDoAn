# Phòng Mạch

Cửa hàng thiết bị công nghệ viết bằng Next.js, TypeScript, Prisma và SQLite.
Danh mục sản phẩm được đọc từ cơ sở dữ liệu; khách có thể tìm kiếm, lọc sản
phẩm, thêm vào giỏ và đặt hàng. Đơn hàng được lưu cùng giá bán tại thời điểm
đặt và cập nhật tồn kho trong một transaction. Các trang riêng gồm `/products`,
`/about`, `/checkout` và `/order-confirmation/[id]`.

## Chạy dự án trên Windows

Yêu cầu Node.js 20.9 trở lên và npm.

```powershell
cd C:\Users\NaruYuu\Projects\WebDoAn
npm install
npm run db:push
npm run db:seed
npm run dev
```

Mở `http://localhost:3000`. Cơ sở dữ liệu SQLite được tạo tại
`prisma\dev.db`; đường dẫn được cấu hình trong `.env`. Có thể mở giao diện quản
lý dữ liệu bằng `npm run db:studio`.

## Cấu trúc dữ liệu

- `Product`: sản phẩm, giá, danh mục và số lượng còn lại.
- `Order`: thông tin người nhận, tổng tiền và trạng thái đơn.
- `OrderItem`: ảnh chụp tên/giá/số lượng ở thời điểm đặt hàng.

Ảnh mẫu tải từ Unsplash và cần kết nối Internet để hiển thị. Thông tin đơn hàng
được lưu local trong SQLite. Luồng đặt hàng hiện hỗ trợ thanh toán khi nhận
hàng (COD); chưa kết nối cổng thanh toán trực tuyến.
