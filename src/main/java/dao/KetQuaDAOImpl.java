/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dao;

import model.KetQua;
import model.NganhHoc;
import util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementation of KetQuaDAO
 */
public class KetQuaDAOImpl implements KetQuaDAO {
    
    @Override
    public int save(KetQua ketQua) {
        String sql = "INSERT INTO ket_qua (ho_ten, so_thich, ky_nang, thoi_gian, ghi_chu) VALUES (?, ?, ?, ?, ?)";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setString(1, ketQua.getHoTen());
            pstmt.setString(2, ketQua.getSoThich());
            pstmt.setString(3, ketQua.getKyNang());
            pstmt.setTimestamp(4, Timestamp.valueOf(ketQua.getThoiGian()));
            pstmt.setString(5, ketQua.getGhiChu());
            
            int affectedRows = pstmt.executeUpdate();
            
            if (affectedRows > 0) {
                try (ResultSet rs = pstmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        int ketQuaId = rs.getInt(1);
                        saveNganhHoc(ketQuaId, ketQua.getNganhHocPhuHop());
                        return ketQuaId;
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println("Error saving KetQua: " + e.getMessage());
        }
        return -1;
    }
    
    private void saveNganhHoc(int ketQuaId, List<NganhHoc> nganhHocList) {
        String sql = "INSERT INTO nganh_hoc (ket_qua_id, ten, ky_nang, mo_ta, diem_phu_hop) VALUES (?, ?, ?, ?, ?)";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            for (NganhHoc nganh : nganhHocList) {
                pstmt.setInt(1, ketQuaId);
                pstmt.setString(2, nganh.getTen());
                pstmt.setString(3, String.join(",", nganh.getKyNang()));
                pstmt.setString(4, nganh.getMoTa());
                pstmt.setDouble(5, nganh.getDiemPhuHop());
                pstmt.executeUpdate();
            }
        } catch (SQLException e) {
            System.err.println("Error saving NganhHoc: " + e.getMessage());
        }
    }
    
    @Override
    public List<KetQua> getAll() {
        List<KetQua> results = new ArrayList<>();
        String sql = "SELECT * FROM ket_qua ORDER BY thoi_gian DESC";
        
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                KetQua ketQua = mapResultSetToKetQua(rs);
                ketQua.setNganhHocPhuHop(getNganhHocByKetQuaId(ketQua.getId()));
                results.add(ketQua);
            }
        } catch (SQLException e) {
            System.err.println("Error getting all KetQua: " + e.getMessage());
        }
        return results;
    }
    
    @Override
    public KetQua getById(int id) {
        String sql = "SELECT * FROM ket_qua WHERE id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    KetQua ketQua = mapResultSetToKetQua(rs);
                    ketQua.setNganhHocPhuHop(getNganhHocByKetQuaId(id));
                    return ketQua;
                }
            }
        } catch (SQLException e) {
            System.err.println("Error getting KetQua by ID: " + e.getMessage());
        }
        return null;
    }
    
    @Override
    public boolean delete(int id) {
        String sql = "DELETE FROM ket_qua WHERE id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, id);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error deleting KetQua: " + e.getMessage());
        }
        return false;
    }
    
    @Override
    public List<Object[]> getStatistics() {
        List<Object[]> statistics = new ArrayList<>();
        String sql = """
            SELECT nh.ten, COUNT(*) as count 
            FROM nganh_hoc nh 
            JOIN ket_qua kq ON nh.ket_qua_id = kq.id 
            GROUP BY nh.ten 
            ORDER BY count DESC
            """;
        
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                Object[] stat = new Object[2];
                stat[0] = rs.getString("ten");
                stat[1] = rs.getInt("count");
                statistics.add(stat);
            }
        } catch (SQLException e) {
            System.err.println("Error getting statistics: " + e.getMessage());
        }
        return statistics;
    }
    
    private KetQua mapResultSetToKetQua(ResultSet rs) throws SQLException {
        KetQua ketQua = new KetQua(
            rs.getString("ho_ten"),
            rs.getString("so_thich"),
            rs.getString("ky_nang"),
            new ArrayList<>()
        );
        ketQua.setId(rs.getInt("id"));
        ketQua.setThoiGian(rs.getTimestamp("thoi_gian").toLocalDateTime());
        ketQua.setGhiChu(rs.getString("ghi_chu"));
        return ketQua;
    }
    
    private List<NganhHoc> getNganhHocByKetQuaId(int ketQuaId) {
        List<NganhHoc> nganhHocList = new ArrayList<>();
        String sql = "SELECT * FROM nganh_hoc WHERE ket_qua_id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, ketQuaId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    NganhHoc nganh = new NganhHoc(
                        rs.getString("ten"),
                        rs.getString("ky_nang").split(","),
                        rs.getString("mo_ta")
                    );
                    nganh.setDiemPhuHop(rs.getDouble("diem_phu_hop"));
                    nganhHocList.add(nganh);
                }
            }
        } catch (SQLException e) {
            System.err.println("Error getting NganhHoc by KetQuaId: " + e.getMessage());
        }
        return nganhHocList;
    }
}
