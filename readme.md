# Trello Clone - Backend API

Backend API cho ứng dụng quản lý dự án kiểu Trello được xây dựng bằng Node.js, Express và MongoDB. Dự án này thể hiện các phương pháp phát triển web hiện đại với xác thực, xác thực đầu vào và kiến trúc có thể mở rộng.

## 🚀 Bản Demo Trực Tuyến

- **Giao diện người dùng**: [Trello App](https://trello-app-lake.vercel.app/vi)
- **Hướng dẫn đăng nhập**:
  - Nhấp vào góc trên bên trái màn hình
  - Chọn 'Đi đến bảng của bạn'
  - Chọn một trong các phương thức đăng nhập có sẵn

## ✨ Tính Năng Nổi Bật

- **Xác Thực An Toàn**: Xác thực dựa trên JWT với tích hợp OAuth2 qua Auth0
- **Quản Lý Người Dùng**: Cập nhật hồ sơ, tải lên ảnh đại diện (qua Cloudinary), và xác thực tài khoản
- **Quản Lý Công Việc**: Các thao tác CRUD đầy đủ cho Bảng, Cột, Thẻ và Danh sách
- **Lượt Xem Gần Đây**: Theo dõi các bảng đã xem gần đây để truy cập nhanh
- **Bảng Ghim**: Khả năng ghim các bảng yêu thích để truy cập dễ dàng
- **Tối Ưu Hiệu Suất**: Bộ nhớ đệm Redis, giới hạn tốc độ và sắp xếp dữ liệu hiệu quả
- **Bảo Mật**: Cấu hình CORS, giới hạn tốc độ và xác thực yêu cầu
- **Tải Lên Tệp Tin**: Tích hợp Cloudinary để tải lên ảnh/ảnh đại diện

## 🛠️ Công Nghệ Sử Dụng

- **Môi Trường Runtime**: Node.js
- **Framework**: Express.js
- **Cơ Sở Dữ Liệu**: MongoDB (với ODM Mongoose)
- **Xác Thực**: Auth0, mã thông báo JWT
- **Bộ Nhớ Đệm**: Redis
- **Lưu Trữ Tệp**: Cloudinary
- **Xác Thực**: Middleware xác thực tùy chỉnh
- **Phiên Bản API**: Kiểm soát phiên bản tích hợp
- **Xử Lý Lỗi**: Quản lý lỗi toàn diện
- **Giới Hạn Tốc Độ**: Bảo vệ chống lại lạm dụng API

## 🏗️ Kiến Trúc

Ứng dụng tuân theo kiến trúc 4 lớp sạch sẽ:

1. **Controllers**: Xử lý các yêu cầu và phản hồi HTTP
2. **Services**: Triển khai logic nghiệp vụ
3. **Models**: Sơ đồ dữ liệu và thao tác cơ sở dữ liệu
4. **Middlewares**: Xác thực, xác thực và các lớp bảo mật

## 📁 Cấu Trúc Dự Án

```
src/
├── controllers/          # Xử lý yêu cầu
├── services/            # Logic nghiệp vụ
├── models/              # Sơ đồ cơ sở dữ liệu
├── routes/              # Định nghĩa tuyến đường API
├── middlewares/         # Xác thực & xác thực
├── validations/         # Quy tắc xác thực đầu vào
├── utils/               # Hàm trợ giúp
├── configs/             # Tập tin cấu hình
└── Helper/              # Trợ giúp tiện ích
```

## 🔧 Cài Đặt

1. **Sao chép kho lưu trữ**

```bash
git clone <đường_dẫn_kho_của_bạn>
cd trello-backend
```

2. **Cài đặt thư viện phụ thuộc**

```bash
npm install
```

3. **Thiết lập biến môi trường**
   Tạo tệp `.env` trong thư mục gốc với các biến sau:

```env
MONGODB_URI=chuỗi_kết_nối_mongodb_của_bạn
JWT_SECRET=bí_mật_jwt_của_bạn
REDIS_URL=url_redis_của_bạn
AUTH0_DOMAIN=miền_auth0_của_bạn
AUTH0_CLIENT_ID=id_khách_hàng_auth0_của_bạn
AUTH0_CLIENT_SECRET=mật_khẩu_khách_hàng_auth0_của_bạn
CLOUDINARY_CLOUD_NAME=tên_cloud_cloudinary_của_bạn
CLOUDINARY_API_KEY=khóa_api_cloudinary_của_bạn
CLOUDINARY_API_SECRET=bí_mật_api_cloudinary_của_bạn
ACCESS_TOKEN_SECRET=bí_mật_truy_cập_của_bạn
REFRESH_TOKEN_SECRET=bí_mật_làm_mới_của_bạn
DOMAIN_AUTH_CLIENT=miền_của_bạn
```

4. **Chạy ứng dụng**

```bash
npm start
```

## 🌐 API Endpoints

### Account Management

- `POST /api/v1/accounts/register` - Create new account
- `POST /api/v1/accounts/login` - Login to account
- `PUT /api/v1/accounts/upload-avatar` - Upload profile picture
- `GET /api/v1/accounts/profile` - Get user profile
- `PUT /api/v1/accounts/update-profile` - Update user profile

### Board Management

- `GET /api/v1/boards` - Get all user boards
- `POST /api/v1/boards` - Create new board
- `GET /api/v1/boards/:id` - Get specific board
- `PUT /api/v1/boards/:id` - Update board
- `DELETE /api/v1/boards/:id` - Delete board

### Column Management

- `POST /api/v1/columns` - Create new column
- `PUT /api/v1/columns/:id` - Update column
- `DELETE /api/v1/columns/:id` - Delete column

### Card Management

- `POST /api/v1/cards` - Create new card
- `PUT /api/v1/cards/:id` - Update card
- `DELETE /api/v1/cards/:id` - Delete card

### Recent Views

- `POST /api/v1/recent-views` - Add board to recent views
- `GET /api/v1/recent-views` - Get recent viewed boards

### Pinned Boards

- `POST /api/v1/pinned-boards` - Pin a board
- `GET /api/v1/pinned-boards` - Get pinned boards
- `DELETE /api/v1/pinned-boards/:id` - Unpin board

## 🔒 Security Features

- JWT token-based authentication
- Auth0 OAuth2 integration
- Rate limiting to prevent API abuse
- Input validation and sanitization
- Secure password handling
- CORS policy enforcement
- Protected routes with middleware

## 🧪 Testing

API endpoints have been tested using Postman. All routes follow RESTful conventions and return appropriate status codes.

## 🚀 Deployment

Currently deployed on Render. For production deployment, ensure all environment variables are properly configured and database connections are secured.

## 👨‍💻 Author

**Vu Van Dao**

This project serves educational purposes to demonstrate full-stack development skills, security best practices, and modern JavaScript frameworks.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](link-to-issues) if you want to contribute.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
This enhanced README provides a comprehensive overview of your Trello clone backend,
