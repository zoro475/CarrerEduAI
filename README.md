# 🎓 EduCareerAI - Tư vấn Ngành học FPT Polytechnic

Ứng dụng tư vấn ngành học thông minh sử dụng AI để giúp học sinh chọn ngành học phù hợp tại FPT Polytechnic.

## ✨ Tính năng chính

### 🤖 AI Copilot Chat
- **Trợ lý AI thông minh** - Tư vấn ngành học 24/7
- **8 câu hỏi nhanh** được thiết kế sẵn cho các chủ đề phổ biến
- **Chat real-time** với giao diện thân thiện
- **Lưu trữ lịch sử** chat để tham khảo
- **Hỗ trợ đa ngôn ngữ** (Tiếng Việt)

### 📝 Khảo sát thông minh
- **Form khảo sát chi tiết** với 15+ câu hỏi
- **Đánh giá năng lực** qua điểm số các môn học
- **Phân tích sở thích** với thang điểm 1-10
- **Tư vấn cá nhân hóa** dựa trên thông tin thực tế

### 🎯 Kết quả tư vấn
- **Top 3 ngành học** phù hợp nhất
- **Phân tích chi tiết** về mức độ phù hợp
- **Lý do đề xuất** cụ thể cho từng ngành
- **Triển vọng nghề nghiệp** và kỹ năng cần thiết

### 📊 Infographic & Xuất bản
- **Infographic cá nhân hóa** với thiết kế đẹp mắt
- **Biểu đồ kỹ năng** trực quan
- **Xuất PDF/Ảnh** để chia sẻ
- **Chia sẻ trực tuyến** qua Web Share API

## 🚀 Cài đặt và Sử dụng

### 1. Tải về
```bash
git clone https://github.com/your-username/EduCareerAI.git
cd EduCareerAI
```

### 2. Cấu hình AI (Tùy chọn)
Để sử dụng AI thực thay vì chế độ demo:

```javascript
// Trong file ai.js, thay đổi:
const API_CONFIG = {
    provider: 'openai', // Thay đổi từ 'demo' thành 'openai'
    apiKey: 'sk-your-openai-api-key-here' // Thêm API key thực
};
```

**Lưu ý:** 
- Chế độ demo hoạt động hoàn hảo mà không cần API key
- Chỉ cần API key nếu muốn sử dụng OpenAI GPT thực

### 3. Chạy ứng dụng
```bash
# Mở file ai.html trong trình duyệt
# Hoặc sử dụng local server:
python -m http.server 8000
# Sau đó truy cập: http://localhost:8000/ai.html
```

## 🔧 Cấu hình AI Copilot

### Chế độ Demo (Mặc định)
- ✅ **Không cần API key**
- ✅ **8 câu hỏi nhanh** với câu trả lời được thiết kế sẵn
- ✅ **Tư vấn thông minh** dựa trên thuật toán phân tích
- ✅ **Hoạt động offline** hoàn toàn

### Chế độ OpenAI
- 🔑 **Yêu cầu API key** OpenAI
- 🤖 **AI thực** với khả năng tư vấn không giới hạn
- 💬 **Chat tự nhiên** với context awareness
- 🌐 **Cần kết nối internet**

### Chế độ Gemini (Sắp tới)
- 🔮 **Hỗ trợ Google Gemini** trong tương lai
- 🌟 **Tích hợp AI đa nền tảng**

## 📱 Giao diện người dùng

### Desktop
- **Layout responsive** với grid system
- **AI Copilot** ở góc phải dưới
- **Navigation tabs** cho các chức năng chính

### Mobile
- **Mobile-first design**
- **Touch-friendly** interface
- **AI Copilot** full-screen trên mobile
- **Quick replies** tối ưu cho màn hình nhỏ

## 🎨 Thiết kế và UX

### Color Scheme
- **Primary**: Gradient xanh-tím (#667eea → #764ba2)
- **Secondary**: Xanh lá (#28a745), Đỏ (#dc3545)
- **Neutral**: Xám (#6c757d), Trắng (#ffffff)

### Typography
- **Font chính**: System fonts (Arial, Helvetica, sans-serif)
- **Headings**: Bold với gradient
- **Body text**: Regular với line-height tối ưu

### Animations
- **Hover effects** mượt mà
- **Loading spinners** với progress bar
- **Smooth transitions** cho tất cả interactions

## 🔒 Bảo mật và Quyền riêng tư

- **Không lưu trữ** thông tin cá nhân lên server
- **Local storage** cho lịch sử và preferences
- **API calls** chỉ khi cần thiết (nếu sử dụng OpenAI)
- **Không tracking** hoặc analytics

## 📚 Tài liệu API

### OpenAI Integration
```javascript
// Gửi request tới OpenAI
const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [...],
        temperature: 0.8,
        max_tokens: 400
    })
});
```

### Demo Mode Algorithm
- **Academic scoring** dựa trên điểm số các môn
- **Interest matching** với thang điểm 1-10
- **Career alignment** theo định hướng nghề nghiệp
- **Skills assessment** dựa trên kỹ năng hiện tại

## 🚧 Tính năng đang phát triển

- [ ] **Export PDF** với jsPDF
- [ ] **Export Image** với html2canvas
- [ ] **Gemini API** integration
- [ ] **Multi-language** support
- [ ] **Dark mode** theme
- [ ] **Offline PWA** capabilities

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Hãy:

1. **Fork** repository
2. **Tạo branch** cho feature mới
3. **Commit** thay đổi
4. **Push** lên branch
5. **Tạo Pull Request**

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 📞 Hỗ trợ

- **Email**: support@educareerai.com
- **GitHub Issues**: [Tạo issue mới](https://github.com/your-username/EduCareerAI/issues)
- **Documentation**: [Wiki](https://github.com/your-username/EduCareerAI/wiki)

## 🙏 Cảm ơn

- **FPT Polytechnic** - Đối tác giáo dục
- **OpenAI** - Công nghệ AI
- **Cộng đồng** - Đóng góp và phản hồi

---

**Made with ❤️ for Vietnamese students**
