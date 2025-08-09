/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/GUIForms/JDialog.java to edit this template
 */
package ui;

import dao.KetQuaDAO;
import dao.KetQuaDAOImpl;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartPanel;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.data.general.DefaultPieDataset;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.List;

/**
 * Dialog to display statistics charts
 */
public class ThongKeForm extends javax.swing.JDialog {
    
    private JPanel mainPanel;
    private JTabbedPane tabbedPane;
    private KetQuaDAO ketQuaDAO;
    
    public ThongKeForm(java.awt.Frame parent) {
        super(parent, "Thống kê ngành học", true);
        ketQuaDAO = new KetQuaDAOImpl();
        initComponents();
        setupLayout();
        loadStatistics();
    }
    
    private void initComponents() {
        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);
        setSize(800, 600);
        setLocationRelativeTo(getParent());
        
        mainPanel = new JPanel();
        mainPanel.setLayout(new BorderLayout());
        mainPanel.setBorder(new EmptyBorder(20, 20, 20, 20));
        
        setContentPane(mainPanel);
    }
    
    private void setupLayout() {
        // Title
        JLabel lblTitle = new JLabel("THỐNG KÊ NGÀNH HỌC", SwingConstants.CENTER);
        lblTitle.setFont(new Font("Arial", Font.BOLD, 20));
        lblTitle.setForeground(new Color(52, 152, 219));
        mainPanel.add(lblTitle, BorderLayout.NORTH);
        
        // Tabbed pane for different chart types
        tabbedPane = new JTabbedPane();
        mainPanel.add(tabbedPane, BorderLayout.CENTER);
        
        // Close button
        JButton btnClose = new JButton("Đóng");
        btnClose.setFont(new Font("Arial", Font.BOLD, 12));
        btnClose.setBackground(new Color(231, 76, 60));
        btnClose.setForeground(Color.WHITE);
        btnClose.setPreferredSize(new Dimension(100, 35));
        btnClose.addActionListener(e -> dispose());
        
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.CENTER));
        buttonPanel.add(btnClose);
        mainPanel.add(buttonPanel, BorderLayout.SOUTH);
    }
    
    private void loadStatistics() {
        try {
            List<Object[]> statistics = ketQuaDAO.getStatistics();
            
            if (statistics.isEmpty()) {
                JOptionPane.showMessageDialog(this, 
                    "Chưa có dữ liệu thống kê!", 
                    "Thông báo", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            
            // Create pie chart
            createPieChart(statistics);
            
            // Create bar chart
            createBarChart(statistics);
            
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, 
                "Lỗi khi tải thống kê: " + e.getMessage(), 
                "Lỗi", JOptionPane.ERROR_MESSAGE);
        }
    }
    
    private void createPieChart(List<Object[]> statistics) {
        DefaultPieDataset dataset = new DefaultPieDataset();
        
        for (Object[] stat : statistics) {
            String nganhTen = (String) stat[0];
            Integer count = (Integer) stat[1];
            dataset.setValue(nganhTen, count);
        }
        
        JFreeChart chart = ChartFactory.createPieChart(
            "Thống kê ngành học được quan tâm", 
            dataset, 
            true, 
            true, 
            false
        );
        
        ChartPanel chartPanel = new ChartPanel(chart);
        chartPanel.setPreferredSize(new Dimension(700, 400));
        
        tabbedPane.addTab("Biểu đồ tròn", chartPanel);
    }
    
    private void createBarChart(List<Object[]> statistics) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        
        for (Object[] stat : statistics) {
            String nganhTen = (String) stat[0];
            Integer count = (Integer) stat[1];
            dataset.addValue(count, "Số lượng", nganhTen);
        }
        
        JFreeChart chart = ChartFactory.createBarChart(
            "Thống kê ngành học được quan tâm",
            "Ngành học",
            "Số lượng",
            dataset,
            PlotOrientation.VERTICAL,
            true,
            true,
            false
        );
        
        ChartPanel chartPanel = new ChartPanel(chart);
        chartPanel.setPreferredSize(new Dimension(700, 400));
        
        tabbedPane.addTab("Biểu đồ cột", chartPanel);
    }
}
