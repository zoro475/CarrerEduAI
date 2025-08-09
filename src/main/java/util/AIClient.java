/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import java.io.IOException;
import java.util.List;
import java.util.ArrayList;
import model.NganhHoc;

/**
 * Utility class for handling AI API calls
 */
public class AIClient {
    private static final String API_KEY = "YOUR_OPENAI_API_KEY"; // Replace with your actual API key
    private static final String API_URL = "https://api.openai.com/v1/chat/completions";
    private static final OkHttpClient client = new OkHttpClient();
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    // Predefined list of majors for fallback
    private static final List<NganhHoc> DEFAULT_NGANH_HOC = List.of(
        new NganhHoc("Công nghệ thông tin", 
            new String[]{"Logic", "Toán", "Tư duy hệ thống", "Lập trình"}, 
            "Học lập trình, mạng, AI, bảo mật, phát triển phần mềm..."),
        new NganhHoc("Thiết kế đồ họa", 
            new String[]{"Sáng tạo", "Mỹ thuật", "Photoshop", "Thiết kế"}, 
            "Thiết kế logo, UI/UX, quảng cáo, đồ họa kỹ thuật số..."),
        new NganhHoc("Marketing", 
            new String[]{"Giao tiếp", "Sáng tạo", "Phân tích", "Quản lý"}, 
            "Marketing số, quảng cáo, PR, nghiên cứu thị trường..."),
        new NganhHoc("Kinh tế", 
            new String[]{"Toán", "Phân tích", "Logic", "Quản lý"}, 
            "Tài chính, ngân hàng, kế toán, quản trị kinh doanh..."),
        new NganhHoc("Y khoa", 
            new String[]{"Sinh học", "Hóa học", "Chăm sóc", "Kiên nhẫn"}, 
            "Bác sĩ, điều dưỡng, dược sĩ, y tế công cộng..."),
        new NganhHoc("Luật", 
            new String[]{"Logic", "Giao tiếp", "Phân tích", "Công bằng"}, 
            "Luật dân sự, hình sự, thương mại, quốc tế..."),
        new NganhHoc("Giáo dục", 
            new String[]{"Giao tiếp", "Kiên nhẫn", "Sáng tạo", "Lãnh đạo"}, 
            "Giáo viên, quản lý giáo dục, tâm lý học..."),
        new NganhHoc("Kiến trúc", 
            new String[]{"Sáng tạo", "Toán", "Mỹ thuật", "Kỹ thuật"}, 
            "Thiết kế công trình, quy hoạch đô thị, nội thất...")
    );
    
    /**
     * Get career advice based on user preferences and skills
     */
    public static List<NganhHoc> tuVanNganh(String hoTen, String soThich, String kyNang) {
        try {
            String prompt = String.format(
                "Tư vấn ngành học cho học sinh có tên %s với sở thích: %s và kỹ năng: %s. " +
                "Trả về danh sách 3-5 ngành học phù hợp nhất với định dạng JSON: " +
                "[{\"ten\": \"Tên ngành\", \"kyNang\": [\"Kỹ năng 1\", \"Kỹ năng 2\"], \"moTa\": \"Mô tả ngành\", \"diemPhuHop\": 0.95}]",
                hoTen, soThich, kyNang
            );
            
            String response = callOpenAI(prompt);
            return parseAIResponse(response);
            
        } catch (Exception e) {
            System.err.println("Error calling AI API: " + e.getMessage());
            return getDefaultRecommendations(soThich, kyNang);
        }
    }
    
    /**
     * Call OpenAI API
     */
    private static String callOpenAI(String prompt) throws IOException {
        String json = String.format(
            "{\"model\": \"gpt-3.5-turbo\", \"messages\": [{\"role\": \"user\", \"content\": \"%s\"}]}",
            prompt.replace("\"", "\\\"")
        );
        
        RequestBody body = RequestBody.create(json, MediaType.parse("application/json"));
        Request request = new Request.Builder()
                .url(API_URL)
                .addHeader("Authorization", "Bearer " + API_KEY)
                .post(body)
                .build();
        
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected response: " + response);
            }
            return response.body().string();
        }
    }
    
    /**
     * Parse AI response and convert to NganhHoc objects
     */
    private static List<NganhHoc> parseAIResponse(String response) {
        List<NganhHoc> results = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode choices = root.get("choices");
            if (choices != null && choices.isArray() && choices.size() > 0) {
                String content = choices.get(0).get("message").get("content").asText();
                // Try to extract JSON from the response
                int start = content.indexOf('[');
                int end = content.lastIndexOf(']') + 1;
                if (start >= 0 && end > start) {
                    String jsonArray = content.substring(start, end);
                    JsonNode nganhArray = objectMapper.readTree(jsonArray);
                    
                    for (JsonNode nganh : nganhArray) {
                        String ten = nganh.get("ten").asText();
                        JsonNode kyNangArray = nganh.get("kyNang");
                        String[] kyNang = new String[kyNangArray.size()];
                        for (int i = 0; i < kyNangArray.size(); i++) {
                            kyNang[i] = kyNangArray.get(i).asText();
                        }
                        String moTa = nganh.get("moTa").asText();
                        double diemPhuHop = nganh.has("diemPhuHop") ? nganh.get("diemPhuHop").asDouble() : 0.8;
                        
                        NganhHoc nganhHoc = new NganhHoc(ten, kyNang, moTa);
                        nganhHoc.setDiemPhuHop(diemPhuHop);
                        results.add(nganhHoc);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error parsing AI response: " + e.getMessage());
        }
        
        if (results.isEmpty()) {
            return getDefaultRecommendations("", "");
        }
        
        return results;
    }
    
    /**
     * Get default recommendations based on preferences
     */
    private static List<NganhHoc> getDefaultRecommendations(String soThich, String kyNang) {
        List<NganhHoc> recommendations = new ArrayList<>();
        
        // Simple keyword matching for default recommendations
        String input = (soThich + " " + kyNang).toLowerCase();
        
        for (NganhHoc nganh : DEFAULT_NGANH_HOC) {
            double score = 0.0;
            
            // Check if skills match
            for (String skill : nganh.getKyNang()) {
                if (input.contains(skill.toLowerCase())) {
                    score += 0.3;
                }
            }
            
            // Check if description matches
            if (input.contains("lập trình") || input.contains("máy tính")) {
                if (nganh.getTen().contains("Công nghệ")) {
                    score += 0.5;
                }
            }
            
            if (input.contains("thiết kế") || input.contains("sáng tạo")) {
                if (nganh.getTen().contains("Thiết kế") || nganh.getTen().contains("Kiến trúc")) {
                    score += 0.5;
                }
            }
            
            if (input.contains("kinh tế") || input.contains("kinh doanh")) {
                if (nganh.getTen().contains("Kinh tế") || nganh.getTen().contains("Marketing")) {
                    score += 0.5;
                }
            }
            
            if (score > 0.2) {
                nganh.setDiemPhuHop(score);
                recommendations.add(nganh);
            }
        }
        
        // If no matches, return top 3 default majors
        if (recommendations.isEmpty()) {
            recommendations.addAll(DEFAULT_NGANH_HOC.subList(0, Math.min(3, DEFAULT_NGANH_HOC.size())));
        }
        
        return recommendations.subList(0, Math.min(3, recommendations.size()));
    }
}
