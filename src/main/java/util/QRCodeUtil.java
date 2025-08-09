/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.BitMatrix;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import model.KetQua;
import model.NganhHoc;

/**
 * Utility class for generating QR codes
 */
public class QRCodeUtil {
    
    /**
     * Generate QR code for consultation result
     */
    public static String generateQRCode(KetQua ketQua) throws Exception {
        String content = createQRContent(ketQua);
        String fileName = "ketqua_" + System.currentTimeMillis() + ".png";
        String filePath = "qr_codes/" + fileName;
        
        // Create directory if it doesn't exist
        Path directory = FileSystems.getDefault().getPath("qr_codes");
        if (!java.nio.file.Files.exists(directory)) {
            java.nio.file.Files.createDirectories(directory);
        }
        
        generateQRCode(content, filePath);
        return filePath;
    }
    
    /**
     * Generate QR code from text content
     */
    public static void generateQRCode(String text, String filePath) throws Exception {
        try {
            BitMatrix matrix = new MultiFormatWriter()
                    .encode(text, BarcodeFormat.QR_CODE, 200, 200);
            Path path = FileSystems.getDefault().getPath(filePath);
            MatrixToImageWriter.writeToPath(matrix, "PNG", path);
        } catch (WriterException | IOException e) {
            throw new Exception("Error generating QR code: " + e.getMessage());
        }
    }
    
    /**
     * Create content for QR code
     */
    private static String createQRContent(KetQua ketQua) {
        StringBuilder content = new StringBuilder();
        content.append("=== KẾT QUẢ TƯ VẤN NGÀNH HỌC ===\n\n");
        content.append("Họ tên: ").append(ketQua.getHoTen()).append("\n");
        content.append("Sở thích: ").append(ketQua.getSoThich()).append("\n");
        content.append("Kỹ năng: ").append(ketQua.getKyNang()).append("\n");
        content.append("Thời gian: ").append(ketQua.getThoiGian().format(
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))).append("\n\n");
        
        content.append("=== NGÀNH HỌC PHÙ HỢP ===\n");
        for (int i = 0; i < ketQua.getNganhHocPhuHop().size(); i++) {
            NganhHoc nganh = ketQua.getNganhHocPhuHop().get(i);
            content.append(i + 1).append(". ").append(nganh.getTen()).append("\n");
            content.append("   Điểm phù hợp: ").append(String.format("%.1f%%", nganh.getDiemPhuHop() * 100)).append("\n");
            content.append("   Kỹ năng cần: ").append(String.join(", ", nganh.getKyNang())).append("\n");
            content.append("   Mô tả: ").append(nganh.getMoTa()).append("\n\n");
        }
        
        return content.toString();
    }
}
