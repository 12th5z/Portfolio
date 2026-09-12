# Portfolio — Nguyễn Quốc Khánh

Website portfolio cá nhân, xây bằng HTML5 + CSS3 + JavaScript thuần, có nền hiệu ứng mạng lưới hạt (particle network) dựng bằng Three.js, và nút chuyển giao diện sáng/tối.

## Cấu trúc thư mục

```
portfolio-khanh/
├── index.html
├── css/
│   └── style.css
└── js/
    └── script.js
```

## Cách mở bằng Visual Studio Code

1. Giải nén thư mục `portfolio-khanh` ra máy.
2. Mở Visual Studio Code → **File → Open Folder…** → chọn thư mục `portfolio-khanh`.
3. Cài extension **Live Server** (tác giả: Ritwick Dey) nếu chưa có, trong tab Extensions (biểu tượng ô vuông bên trái).
4. Chuột phải vào file `index.html` trong VS Code → chọn **Open with Live Server**.
5. Trình duyệt sẽ tự mở trang tại địa chỉ dạng `http://127.0.0.1:5500` và tự tải lại mỗi khi bạn lưu file.

Không có Live Server thì vẫn có thể mở trực tiếp: chuột phải vào `index.html` trong Explorer → **Reveal in File Explorer/Finder** → nhấp đúp để mở bằng trình duyệt.

## Những chỗ nên chỉnh lại trước khi dùng thật

- `index.html` phần **Liên hệ**: email, link GitHub, LinkedIn hiện là chỗ giữ trống (placeholder) — thay bằng thông tin thật của bạn.
- Phần **Dự án**: 3 thẻ đang để "Sắp cập nhật" — thay bằng dự án thật kèm mô tả, link demo/GitHub.
- Phần **Học vấn**: hiện chưa ghi năm nhập học/khóa — có thể bổ sung nếu muốn.
- Có thể đổi màu chủ đạo (accent) trong `css/style.css`, phần `:root` / `html[data-theme="dark"]` / `html[data-theme="light"]`.

## Ghi chú kỹ thuật

- Three.js được tải qua CDN (cdnjs) trong `index.html` — cần kết nối internet khi mở trang.
- Font chữ: **Space Grotesk** (tiêu đề) và **JetBrains Mono** (nhãn, đoạn code) tải từ Google Fonts.
- Giao diện tự tôn trọng cài đặt "Reduce motion" của hệ điều hành/trình duyệt.
- Trạng thái sáng/tối được lưu trong `localStorage`, tự nhớ lại lần truy cập sau.

## Hiệu ứng cuộn (thêm sau)

Toàn bộ nằm trong khối `CINEMATIC SCROLL LAYER` ở cuối `css/style.css` và `js/script.js`:

- **Wipe "compile-in" theo từng section** — mỗi section (`.section-veil`) được "vén màn" từ trái sang phải kèm viền phát sáng khi cuộn tới, giống terminal đang render nội dung.
- **Tiêu đề tách chữ (split-text)** — `.section-title` và tên ở Hero được tách thành từng từ, "trồi" lên theo hiệu ứng mask khi xuất hiện.
- **Reveal so le** — mono-tag, đoạn văn, các thẻ (facts/skill-card/project-card/contact-list) hiện lần lượt có độ trễ tăng dần.
- **Chuỗi mở màn ở Hero** — các phần tử hero (`.boot-in`) xuất hiện nối tiếp nhau ngay khi tải trang, không cần cuộn.
- **Parallax chiều sâu ở Hero** — khối chữ và terminal card trôi với tốc độ khác nhau khi cuộn qua Hero.
- **Thanh tiến trình cuộn**, **nav tự ẩn/hiện khi cuộn xuống/lên**, **gạch chân điều hướng trượt mượt theo mục đang active**, **nút "lên đầu trang"**.
- **Nam châm & nghiêng 3D** — nút bấm hơi hút theo chuột, các thẻ/terminal nghiêng nhẹ theo vị trí con trỏ (chỉ chạy trên thiết bị có chuột thật).

## Hiệu ứng 3D (thêm sau)

- **Khối wireframe 3D thật trong nền** (Three.js, không phải giả lập CSS) — 2 khối icosahedron xoay liên tục phía sau nội dung, xoay nhanh hơn và trôi theo % bạn đã cuộn trang, tạo cảm giác "bay xuyên qua không gian 3D" khi cuộn.
- **Nghiêng 3D toàn section** — mỗi section "ngả" ra khỏi màn hình một góc nhỏ rồi từ từ đứng thẳng lại đúng lúc màn wipe kéo qua, đồng bộ với nhau.
- **Lớp sâu 3D khi hover card** — tiêu đề và nội dung bên trong `skill-card`/`project-card`/`edu-card`/terminal "nhô" ra phía người xem (translateZ) khi rê chuột, kết hợp với nghiêng theo vị trí con trỏ.
- **Terminal card bay 3D liên tục** ở Hero — tự xoay/nổi nhẹ theo trục X/Y suốt, tách lớp riêng nên không đụng hiệu ứng nghiêng khi hover hay parallax khi cuộn.
- **Nút đổi theme lật 3D thật** (rotateY) giữa icon mặt trời/mặt trăng thay vì ẩn/hiện phẳng.

Tất cả cũng tuân thủ nguyên tắc progressive enhancement và "Reduce motion" như phần hiệu ứng cuộn ở trên — đã kiểm tra riêng từng trường hợp để đảm bảo không bị kẹt hiệu ứng khi tắt animation hoặc khi JS lỗi.
