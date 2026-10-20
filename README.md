# Phòng Mạch Store

Cửa hàng thiết bị công nghệ viết bằng Next.js, TypeScript, Prisma và SQLite.
Danh mục sản phẩm được đọc từ cơ sở dữ liệu; khách có thể tìm kiếm, lọc sản
phẩm, thêm vào giỏ và đặt hàng. Đơn hàng được lưu cùng giá bán tại thời điểm
đặt và cập nhật tồn kho trong một transaction. Các trang riêng gồm `/products`,
`/about`, `/checkout` và `/order-confirmation/[id]`.

## Chạy dự án trên Windows

Chạy PowerShell tại thư mục dự án:

```powershell
winget install --id OpenJS.NodeJS.LTS --exact
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
./install.ps1
```

Script tự cài Node.js LTS bằng `winget` nếu chưa có Node.js 20.9+, cài thư viện
từ `package-lock.json`, tạo `.env` nếu chưa có, rồi khởi tạo SQLite và dữ liệu
mẫu. Nếu Node.js vừa được cài nhưng chưa nhận trong phiên PowerShell hiện tại,
đóng/mở PowerShell rồi chạy lại script.

Khởi động website sau khi cài đặt:

```powershell
npm run dev
```

Mở `http://localhost:3000`. Cơ sở dữ liệu SQLite được tạo tại
`prisma\dev.db`; đường dẫn được cấu hình trong `.env`. Có thể mở giao diện quản
lý dữ liệu bằng `npm run db:studio`.

## Cấu trúc dữ liệu

- `Product`: sản phẩm, giá, danh mục và số lượng còn lại.
- `Order`: thông tin người nhận, tổng tiền và trạng thái đơn.
- `OrderItem`: ảnh chụp tên/giá/số lượng ở thời điểm đặt hàng.
