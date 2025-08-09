# EduCareerAI - Ứng dụng Tư vấn Ngành học Thông minh

## Mô tả
EduCareerAI là một ứng dụng Java Swing được thiết kế để tư vấn ngành học cho học sinh dựa trên sở thích và kỹ năng của họ. Ứng dụng sử dụng AI để phân tích và đưa ra các gợi ý ngành học phù hợp.

## Tính năng chính

### 1. Tư vấn ngành học
- Nhập thông tin cá nhân (họ tên, sở thích, kỹ năng)
- Phân tích thông tin bằng AI (OpenAI GPT-3.5)
- Hiển thị danh sách ngành học phù hợp với điểm phù hợp
- Lưu kết quả tư vấn vào cơ sở dữ liệu

### 2. Tạo QR Code
- Tạo QR code chứa thông tin kết quả tư vấn
- Lưu QR code dưới dạng file ảnh PNG
- Tự động mở file QR code sau khi tạo

### 3. Thống kê
- Hiển thị biểu đồ tròn và cột về ngành học được quan tâm
- Thống kê số lượng tư vấn theo từng ngành
- Giao diện tabbed để xem nhiều loại biểu đồ

### 4. Lưu trữ
- Lưu kết quả tư vấn vào cơ sở dữ liệu SQLite
- Xuất kết quả ra file text
- Quản lý lịch sử tư vấn

## Cấu trúc dự án

```
EduCareerAI/
├── src/
│   └── main/
│       └── java/
│           ├── dao/                 # Data Access Objects
│           │   ├── KetQuaDAO.java
│           │   └── KetQuaDAOImpl.java
│           ├── model/               # Model classes
│           │   ├── KetQua.java
│           │   └── NganhHoc.java
│           ├── ui/                  # User Interface
│           │   ├── MainForm.java
│           │   ├── KetQuaForm.java
│           │   └── ThongKeForm.java
│           └── util/                # Utility classes
│               ├── AIClient.java
│               ├── DBConnection.java
│               └── QRCodeUtil.java
├── pom.xml                         # Maven configuration
└── README.md                       # Documentation
```

## Yêu cầu hệ thống

- Java 17 hoặc cao hơn
- Maven 3.6+
- Kết nối internet (để gọi OpenAI API)

## Cài đặt và chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd EduCareerAI
```

### 2. Cấu hình OpenAI API
Mở file `src/main/java/util/AIClient.java` và thay thế `YOUR_OPENAI_API_KEY` bằng API key thực của bạn:
```java
private static final String API_KEY = "your-actual-openai-api-key";
```

### 3. Build và chạy
```bash
# Build project
mvn clean compile

# Run application
mvn exec:java -Dexec.mainClass="ui.MainForm"
```

Hoặc có thể chạy trực tiếp từ IDE:
- Mở project trong IDE (IntelliJ IDEA, Eclipse, NetBeans)
- Chạy class `ui.MainForm`

## Sử dụng

### 1. Tư vấn ngành học
1. Mở ứng dụng
2. Nhập họ tên
3. Nhập sở thích (ví dụ: lập trình, thiết kế, kinh doanh)
4. Nhập kỹ năng (ví dụ: logic, sáng tạo, giao tiếp)
5. Nhấn "Tư vấn ngay"
6. Xem kết quả và chọn ngành học phù hợp

### 2. Tạo QR Code
1. Sau khi có kết quả tư vấn
2. Nhấn "Tạo QR Code"
3. QR code sẽ được tạo và lưu trong thư mục `qr_codes/`
4. File QR code sẽ tự động mở

### 3. Xem thống kê
1. Nhấn "Xem thống kê" từ menu chính
2. Xem biểu đồ tròn hoặc cột
3. Phân tích xu hướng ngành học được quan tâm

## Cơ sở dữ liệu

Ứng dụng sử dụng SQLite với 2 bảng chính:

### Bảng `ket_qua`
- `id`: Khóa chính
- `ho_ten`: Họ tên người dùng
- `so_thich`: Sở thích
- `ky_nang`: Kỹ năng
- `thoi_gian`: Thời gian tư vấn
- `ghi_chu`: Ghi chú

### Bảng `nganh_hoc`
- `id`: Khóa chính
- `ket_qua_id`: Khóa ngoại đến bảng ket_qua
- `ten`: Tên ngành học
- `ky_nang`: Kỹ năng cần thiết
- `mo_ta`: Mô tả ngành học
- `diem_phu_hop`: Điểm phù hợp (0-1)

## Công nghệ sử dụng

- **Java Swing**: Giao diện người dùng
- **OpenAI GPT-3.5**: AI tư vấn ngành học
- **SQLite**: Cơ sở dữ liệu
- **JFreeChart**: Biểu đồ thống kê
- **ZXing**: Tạo QR code
- **OkHttp**: HTTP client cho API calls
- **Jackson**: JSON processing
- **Maven**: Build tool

## Lưu ý

1. **API Key**: Cần có OpenAI API key hợp lệ để sử dụng tính năng AI
2. **Kết nối internet**: Cần kết nối internet để gọi OpenAI API
3. **Quyền ghi file**: Ứng dụng cần quyền ghi file để tạo QR code và lưu kết quả
4. **Database**: SQLite database sẽ được tạo tự động khi chạy lần đầu

## Đóng góp

Để đóng góp vào dự án:
1. Fork repository
2. Tạo branch mới cho feature
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## License

Dự án này được phát hành dưới MIT License.
# CarrerEduAI
