/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/GUIForms/JDialog.java to edit this template
 */
package ui;

import model.KetQua;
import model.NganhHoc;
import util.QRCodeUtil;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.util.List;
import java.awt.Desktop;

/**
 * Dialog to display consultation results
 */
public class KetQuaForm extends javax.swing.JDialog {
    
    private KetQua ketQua;
    private JPanel mainPanel;
    private JTextArea resultArea;
    private JButton btnQRCode;
    private JButton btnSave;
    private JButton btnClose;
    
    public KetQuaForm(java.awt.Frame parent, KetQua ketQua) {
        super(parent, "Kết quả tư vấn", true);
        this.ketQua = ketQua;
        initComponents();
        setupLayout();
        setupEventHandlers();
        displayResults();
    }
    
    private void initComponents() {
        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);
        setSize(700, 600);
        setLocationRelativeTo(getParent());
        
        mainPanel = new JPanel();
        mainPanel.setLayout(new BorderLayout());
        mainPanel.setBorder(new EmptyBorder(20, 20, 20, 20));
        
        setContentPane(mainPanel);
    }
    
    private void setupLayout() {
        // Title
        JLabel lblTitle = new JLabel("KẾT QUẢ TƯ VẤN NGÀNH HỌC", SwingConstants.CENTER);
        lblTitle.setFont(new Font("Arial", Font.BOLD, 20));
        lblTitle.setForeground(new Color(52, 152, 219));
        mainPanel.add(lblTitle, BorderLayout.NORTH);
        
        // Results area
        resultArea = new JTextArea();
        resultArea.setEditable(false);
        resultArea.setFont(new Font("Arial", Font.PLAIN, 12));
        resultArea.setLineWrap(true);
        resultArea.setWrapStyleWord(true);
        JScrollPane scrollPane = new JScrollPane(resultArea);
        scrollPane.setPreferredSize(new Dimension(600, 400));
        mainPanel.add(scrollPane, BorderLayout.CENTER);
        
        // Buttons
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 20, 10));
        
        btnQRCode = new JButton("Tạo QR Code");
        btnQRCode.setFont(new Font("Arial", Font.BOLD, 12));
        btnQRCode.setBackground(new Color(155, 89, 182));
        btnQRCode.setForeground(Color.WHITE);
        btnQRCode.setPreferredSize(new Dimension(120, 35));
        
        btnSave = new JButton("Lưu kết quả");
        btnSave.setFont(new Font("Arial", Font.BOLD, 12));
        btnSave.setBackground(new Color(46, 204, 113));
        btnSave.setForeground(Color.WHITE);
        btnSave.setPreferredSize(new Dimension(120, 35));
        
        btnClose = new JButton("Đóng");
        btnClose.setFont(new Font("Arial", Font.BOLD, 12));
        btnClose.setBackground(new Color(231, 76, 60));
        btnClose.setForeground(Color.WHITE);
        btnClose.setPreferredSize(new Dimension(120, 35));
        
        buttonPanel.add(btnQRCode);
        buttonPanel.add(btnSave);
        buttonPanel.add(btnClose);
        
        mainPanel.add(buttonPanel, BorderLayout.SOUTH);
    }
    
    private void setupEventHandlers() {
        btnQRCode.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                generateQRCode();
            }
        });
        
        btnSave.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                saveResults();
            }
        });
        
        btnClose.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dispose();
            }
        });
    }
    
    private void displayResults() {
        StringBuilder sb = new StringBuilder();
        sb.append("=== THÔNG TIN NGƯỜI DÙNG ===\n");
        sb.append("Họ tên: ").append(ketQua.getHoTen()).append("\n");
        sb.append("Sở thích: ").append(ketQua.getSoThich()).append("\n");
        sb.append("Kỹ năng: ").append(ketQua.getKyNang()).append("\n");
        sb.append("Thời gian tư vấn: ").append(ketQua.getThoiGian().toString()).append("\n\n");
        
        sb.append("=== NGÀNH HỌC PHÙ HỢP ===\n\n");
        
        List<NganhHoc> nganhHocList = ketQua.getNganhHocPhuHop();
        for (int i = 0; i < nganhHocList.size(); i++) {
            NganhHoc nganh = nganhHocList.get(i);
            sb.append(i + 1).append(". ").append(nganh.getTen()).append("\n");
            sb.append("   Điểm phù hợp: ").append(String.format("%.1f%%", nganh.getDiemPhuHop() * 100)).append("\n");
            sb.append("   Kỹ năng cần thiết: ").append(String.join(", ", nganh.getKyNang())).append("\n");
            sb.append("   Mô tả: ").append(nganh.getMoTa()).append("\n\n");
        }
        
        resultArea.setText(sb.toString());
        resultArea.setCaretPosition(0);
    }
    
    private void generateQRCode() {
        try {
            String qrPath = QRCodeUtil.generateQRCode(ketQua);
            JOptionPane.showMessageDialog(this, 
                "QR Code đã được tạo thành công!\nĐường dẫn: " + qrPath, 
                "Thành công", JOptionPane.INFORMATION_MESSAGE);
            
            // Open the QR code file
            File qrFile = new File(qrPath);
            if (qrFile.exists()) {
                Desktop.getDesktop().open(qrFile);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, 
                "Lỗi khi tạo QR Code: " + e.getMessage(), 
                "Lỗi", JOptionPane.ERROR_MESSAGE);
        }
    }
    
    private void saveResults() {
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Lưu kết quả tư vấn");
        fileChooser.setSelectedFile(new File("ket_qua_tu_van.txt"));
        
        if (fileChooser.showSaveDialog(this) == JFileChooser.APPROVE_OPTION) {
            try {
                File file = fileChooser.getSelectedFile();
                java.nio.file.Files.write(file.toPath(), resultArea.getText().getBytes());
                JOptionPane.showMessageDialog(this, 
                    "Kết quả đã được lưu thành công!", 
                    "Thành công", JOptionPane.INFORMATION_MESSAGE);
            } catch (Exception e) {
                JOptionPane.showMessageDialog(this, 
                    "Lỗi khi lưu file: " + e.getMessage(), 
                    "Lỗi", JOptionPane.ERROR_MESSAGE);
            }
        }
    }
}
