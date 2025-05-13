# YouTube Tracker

YouTube Tracker là một hệ thống theo dõi và lưu trữ thông tin các video âm nhạc từ YouTube. Hệ thống bao gồm hai phần chính: extension Chrome và server Node.js.

## 🌟 Tính năng chính

- **Tự động phát hiện video YouTube**: Extension theo dõi khi bạn truy cập YouTube
- **Phân loại video âm nhạc**: Tự động xác định video thuộc danh mục âm nhạc
- **Lưu trữ thông tin**: Lưu chi tiết video vào cơ sở dữ liệu PostgreSQL
- **API RESTful**: Cung cấp endpoints để tương tác với dữ liệu

## 🛠️ Công nghệ sử dụng

- **Frontend**: Chrome Extension (JavaScript)
- **Backend**: Node.js, Express
- **Cơ sở dữ liệu**: PostgreSQL
- **ORM**: Sequelize
- **API**: YouTube Data API v3

## 🗂️ Cấu trúc dự án

```
Youtube-tracker/
├── database.js          # Cấu hình kết nối PostgreSQL và Sequelize
├── index.js             # File chính khởi chạy server Express
├── youtubeService.js    # Service xử lý API YouTube
├── extension/           # Thư mục chứa mã nguồn Chrome Extension
│   ├── background.js    # Script chạy nền cho extension
│   ├── content.js       # Script tương tác với trang web YouTube
│   ├── popup.html       # Giao diện popup của extension
│   ├── popup.js         # Xử lý logic cho popup
│   ├── manifest.json    # Cấu hình extension
│   └── icons/           # Biểu tượng extension
├── model/
│   └── song.js          # Model Sequelize định nghĩa bảng songs
└── .env                 # Cấu hình biến môi trường (không được commit)
```

## 📋 Cách hoạt động

1. **Extension**:
   - Phát hiện khi người dùng truy cập YouTube
   - Gửi thông tin URL video đến server qua API

2. **Server**:
   - Phân tích URL và lấy thông tin video qua YouTube API
   - Kiểm tra xem video có thuộc danh mục âm nhạc không (categoryId = 10)
   - Lưu trữ thông tin video vào database nếu là video âm nhạc

## 📥 Cài đặt và sử dụng

### Server

1. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

2. **Cấu hình môi trường**:
   Tạo file `.env` với nội dung:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   YOUTUBE_API_KEY=your_youtube_api_key
   ```

3. **Khởi động server**:
   ```bash
   node index.js
   ```

### Extension

1. **Cài đặt extension trong Chrome**:
   - Mở Chrome và truy cập `chrome://extensions/`
   - Bật chế độ Developer mode
   - Nhấp vào "Load unpacked" và chọn thư mục `extension`
   - Hoặc, sử dụng file `extension.crx` để cài đặt trực tiếp

2. **Sử dụng extension**:
   - Sau khi cài đặt, extension sẽ tự động theo dõi khi bạn truy cập YouTube
   - Nhấp vào biểu tượng extension để xem thông tin hoặc tùy chỉnh

## 📡 API Endpoints

- `POST /api/songs`: Thêm video mới vào database
- `GET /api/songs`: Lấy danh sách tất cả video đã lưu
- `POST /track`: Kiểm tra và lưu video theo ID

## 🔮 Phát triển tương lai

- Thêm hệ thống xác thực người dùng
- Tạo giao diện web để quản lý video đã lưu
- Thêm tính năng phân tích và thống kê thói quen nghe nhạc
- Hỗ trợ tạo và quản lý playlist

## 📄 Giấy phép

MIT License
