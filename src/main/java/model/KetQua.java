/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Model class representing consultation results
 */
public class KetQua {
    private int id;
    private String hoTen;
    private String soThich;
    private String kyNang;
    private List<NganhHoc> nganhHocPhuHop;
    private LocalDateTime thoiGian;
    private String ghiChu;
    
    public KetQua(String hoTen, String soThich, String kyNang, List<NganhHoc> nganhHocPhuHop) {
        this.hoTen = hoTen;
        this.soThich = soThich;
        this.kyNang = kyNang;
        this.nganhHocPhuHop = nganhHocPhuHop;
        this.thoiGian = LocalDateTime.now();
    }
    
    // Getters and setters
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public String getHoTen() {
        return hoTen;
    }
    
    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }
    
    public String getSoThich() {
        return soThich;
    }
    
    public void setSoThich(String soThich) {
        this.soThich = soThich;
    }
    
    public String getKyNang() {
        return kyNang;
    }
    
    public void setKyNang(String kyNang) {
        this.kyNang = kyNang;
    }
    
    public List<NganhHoc> getNganhHocPhuHop() {
        return nganhHocPhuHop;
    }
    
    public void setNganhHocPhuHop(List<NganhHoc> nganhHocPhuHop) {
        this.nganhHocPhuHop = nganhHocPhuHop;
    }
    
    public LocalDateTime getThoiGian() {
        return thoiGian;
    }
    
    public void setThoiGian(LocalDateTime thoiGian) {
        this.thoiGian = thoiGian;
    }
    
    public String getGhiChu() {
        return ghiChu;
    }
    
    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }
    
    @Override
    public String toString() {
        return "KetQua{" +
                "id=" + id +
                ", hoTen='" + hoTen + '\'' +
                ", soThich='" + soThich + '\'' +
                ", kyNang='" + kyNang + '\'' +
                ", nganhHocPhuHop=" + nganhHocPhuHop +
                ", thoiGian=" + thoiGian +
                '}';
    }
}
