/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/GUIForms/JFrame.java to edit this template
 */
package ui;

import dao.KetQuaDAO;
import dao.KetQuaDAOImpl;
import model.KetQua;
import model.NganhHoc;
import util.AIClient;
import javax.swing.*;
import javax.swing.border.BorderFactory;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.List;

/**
 * Main form for the career counseling application
 */
public class MainForm extends javax.swing.JFrame {
    
    private JTextField txtHoTen;
    private JTextArea txtSoThich;
    private JTextArea txtKyNang;
    private JButton btnTuVan;
    private JButton btnThongKe;
    private JLabel lblTitle;
    private JPanel mainPanel;
    private KetQuaDAO ketQuaDAO;
    
    public MainForm() {
        ketQuaDAO = new KetQuaDAOImpl();
        initComponents();
        setupLayout();
        setupEventHandlers();
    }
    
    private void initComponents() {
        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setTitle("EduCareerAI - Tư vấn ngành học");
        setSize(600, 500);
        setLocationRelativeTo(null);
        
        mainPanel = new JPanel();
        mainPanel.setLayout(new BorderLayout());
        mainPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        
        setContentPane(mainPanel);
    }
    
    private void setupLayout() {
        // Title
        lblTitle = new JLabel("TƯ VẤN NGÀNH HỌC THÔNG MINH", SwingConstants.CENTER);
        lblTitle.setFont(new Font("Arial", Font.BOLD, 24));
        lblTitle.setForeground(new Color(52, 152, 219));
        mainPanel.add(lblTitle, BorderLayout.NORTH);
        
        // Main content panel
        JPanel contentPanel = new JPanel();
        contentPanel.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        
        // Họ tên
        gbc.gridx = 0; gbc.gridy = 0;
        contentPanel.add(new JLabel("Họ và tên:"), gbc);
        
        gbc.gridx = 1; gbc.gridy = 0;
        gbc.weightx = 1.0;
        txtHoTen = new JTextField(20);
        contentPanel.add(txtHoTen, gbc);
        
        // Sở thích
        gbc.gridx = 0; gbc.gridy = 1;
        gbc.weightx = 0.0;
        contentPanel.add(new JLabel("Sở thích:"), gbc);
        
        gbc.gridx = 1; gbc.gridy = 1;
        gbc.weightx = 1.0;
        gbc.weighty = 1.0;
        txtSoThich = new JTextArea(4, 20);
        txtSoThich.setLineWrap(true);
        txtSoThich.setWrapStyleWord(true);
        JScrollPane scrollSoThich = new JScrollPane(txtSoThich);
        contentPanel.add(scrollSoThich, gbc);
        
        // Kỹ năng
        gbc.gridx = 0; gbc.gridy = 2;
        gbc.weightx = 0.0;
        gbc.weighty = 0.0;
        contentPanel.add(new JLabel("Kỹ năng:"), gbc);
        
        gbc.gridx = 1; gbc.gridy = 2;
        gbc.weightx = 1.0;
        gbc.weighty = 1.0;
        txtKyNang = new JTextArea(4, 20);
        txtKyNang.setLineWrap(true);
        txtKyNang.setWrapStyleWord(true);
        JScrollPane scrollKyNang = new JScrollPane(txtKyNang);
        contentPanel.add(scrollKyNang, gbc);
        
        // Buttons
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 20, 10));
        
        btnTuVan = new JButton("Tư vấn ngay");
        btnTuVan.setFont(new Font("Arial", Font.BOLD, 14));
        btnTuVan.setBackground(new Color(46, 204, 113));
        btnTuVan.setForeground(Color.WHITE);
        btnTuVan.setPreferredSize(new Dimension(150, 40));
        
        btnThongKe = new JButton("Xem thống kê");
        btnThongKe.setFont(new Font("Arial", Font.BOLD, 14));
        btnThongKe.setBackground(new Color(52, 152, 219));
        btnThongKe.setForeground(Color.WHITE);
        btnThongKe.setPreferredSize(new Dimension(150, 40));
        
        buttonPanel.add(btnTuVan);
        buttonPanel.add(btnThongKe);
        
        gbc.gridx = 0; gbc.gridy = 3;
        gbc.gridwidth = 2;
        gbc.weightx = 1.0;
        gbc.weighty = 0.0;
        contentPanel.add(buttonPanel, gbc);
        
        mainPanel.add(contentPanel, BorderLayout.CENTER);
    }
    
    private void setupEventHandlers() {
        btnTuVan.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                performConsultation();
            }
        });
        
        btnThongKe.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                showStatistics();
            }
        });
    }
    
    private void performConsultation() {
        String hoTen = txtHoTen.getText().trim();
        String soThich = txtSoThich.getText().trim();
        String kyNang = txtKyNang.getText().trim();
        
        if (hoTen.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Vui lòng nhập họ tên!", "Lỗi", JOptionPane.ERROR_MESSAGE);
            return;
        }
        
        if (soThich.isEmpty() && kyNang.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Vui lòng nhập ít nhất sở thích hoặc kỹ năng!", "Lỗi", JOptionPane.ERROR_MESSAGE);
            return;
        }
        
        // Show loading dialog
        JDialog loadingDialog = new JDialog(this, "Đang tư vấn...", true);
        loadingDialog.setLayout(new FlowLayout());
        loadingDialog.add(new JLabel("Đang phân tích thông tin..."));
        loadingDialog.pack();
        loadingDialog.setLocationRelativeTo(this);
        
        // Run consultation in background
        SwingWorker<List<NganhHoc>, Void> worker = new SwingWorker<List<NganhHoc>, Void>() {
            @Override
            protected List<NganhHoc> doInBackground() throws Exception {
                return AIClient.tuVanNganh(hoTen, soThich, kyNang);
            }
            
            @Override
            protected void done() {
                loadingDialog.dispose();
                try {
                    List<NganhHoc> nganhHocList = get();
                    if (nganhHocList != null && !nganhHocList.isEmpty()) {
                        KetQua ketQua = new KetQua(hoTen, soThich, kyNang, nganhHocList);
                        int id = ketQuaDAO.save(ketQua);
                        if (id > 0) {
                            ketQua.setId(id);
                            showResults(ketQua);
                        } else {
                            JOptionPane.showMessageDialog(MainForm.this, 
                                "Lỗi khi lưu kết quả!", "Lỗi", JOptionPane.ERROR_MESSAGE);
                        }
                    } else {
                        JOptionPane.showMessageDialog(MainForm.this, 
                            "Không thể tư vấn ngành học. Vui lòng thử lại!", "Lỗi", JOptionPane.ERROR_MESSAGE);
                    }
                } catch (Exception ex) {
                    JOptionPane.showMessageDialog(MainForm.this, 
                        "Lỗi: " + ex.getMessage(), "Lỗi", JOptionPane.ERROR_MESSAGE);
                }
            }
        };
        
        worker.execute();
        loadingDialog.setVisible(true);
    }
    
    private void showResults(KetQua ketQua) {
        KetQuaForm ketQuaForm = new KetQuaForm(this, ketQua);
        ketQuaForm.setVisible(true);
    }
    
    private void showStatistics() {
        ThongKeForm thongKeForm = new ThongKeForm(this);
        thongKeForm.setVisible(true);
    }
    
    public static void main(String args[]) {
        try {
            // Try to use system look and feel, fallback to default if not available
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeel());
            } catch (Exception e) {
                // Fallback to default look and feel
                UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                new MainForm().setVisible(true);
            }
        });
    }
}
