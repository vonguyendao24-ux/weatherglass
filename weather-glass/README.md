# Weather Glass

Demo dashboard thời tiết toàn quốc theo phong cách Glassmorphism.

## Nội dung
- Dashboard thời tiết đầy đủ, không quảng cáo
- Màn hình đăng nhập đơn giản cho mọi người dùng
- Tìm kiếm toàn quốc theo tên thành phố Việt Nam
- Định vị GPS để lấy thời tiết tại vị trí hiện tại
- Hiển thị chi tiết: độ ẩm, cảm giác, gió, mây che phủ, UV, áp suất
- Dự báo theo giờ và dự báo 7 ngày
- Bảng tốc độ cập nhật thời tiết tại các thành phố lớn
- Dữ liệu thời tiết lấy từ API Open-Meteo miễn phí

## Chạy demo Web
1. Mở `web/index.html` bằng trình duyệt.
2. Hoặc dùng một server tĩnh:
   ```bash
   npx http-server web
   ```
3. Màn hình đăng nhập sẽ xuất hiện. Nhập tên người dùng và mật khẩu bất kỳ để tiến vào dashboard.
4. Nhập tên thành phố toàn quốc, ví dụ: `Hà Nội`, `Đà Nẵng`, `Sa Pa`.
5. Hoặc bấm nút `Định vị` để lấy thời tiết theo vị trí hiện tại.

## Cài đặt app (PWA)
Ứng dụng hiện là một Progressive Web App, nên bạn có thể cài đặt vào điện thoại hoặc máy tính như một app độc lập.

1. Chạy server tại thư mục `web/`, ví dụ:
   ```bash
   cd web
   python -m http.server 8080
   ```
2. Mở `http://localhost:8080` trên Chrome, Edge hoặc trình duyệt hỗ trợ PWA.
3. Chrome/Edge sẽ hiển thị thông báo `Install` hoặc menu `Install app`.
4. Nhấn cài đặt để dùng app độc lập mà không thấy thanh địa chỉ trình duyệt.

## Chia sẻ bằng URL
Để mọi người đều truy cập được qua URL, bạn chỉ cần đưa toàn bộ nội dung thư mục `web/` lên dịch vụ hosting tĩnh như GitHub Pages, Netlify hoặc Vercel.

Ví dụ với GitHub Pages:
1. Tạo repository mới trên GitHub.
2. Đẩy toàn bộ nội dung thư mục `web/` lên repository.
3. Kích hoạt GitHub Pages trên nhánh `main` và thư mục `root`.
4. URL sẽ có dạng `https://<ten-nguoi-dung>.github.io/<ten-repo>`.

Hoặc dùng Netlify/Vercel để upload thư mục `web/` và nhận URL trực tiếp.

> Lưu ý: Tính năng đăng nhập hiện tại là demo, cho phép mọi người dùng truy cập vào dashboard. Nếu cần bảo mật thật sự, cần thêm backend xác thực.
