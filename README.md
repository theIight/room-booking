# BXC CTV Quest

Dự án đặt phòng họp nhanh gọn sử dụng Docker Compose.

## Hướng dẫn chạy dự án

1. **Khởi động các dịch vụ (Frontend, Backend, Database):**
   ```bash
   docker-compose up -d --build
   ```

2. **Truy cập ứng dụng:**
   - **Frontend:** http://localhost:5173
   - **Backend API:** http://localhost:8000
   - **MySQL Database:** Port `3306` | User/Password: `root`/`root` | DB: `booking_db`

## Các lệnh thường dùng

- **Xem logs hệ thống:**
  ```bash
  docker-compose logs -f
  ```
- **Dừng dự án:**
  ```bash
  docker-compose down
  ```
- **Dừng và xoá sạch dữ liệu (Reset DB):**
  ```bash
  docker-compose down -v
  ```
