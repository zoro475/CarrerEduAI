/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

import java.util.Arrays;

/**
 * Model class representing a study major/career field
 */
public class NganhHoc {
    private String ten;
    private String[] kyNang;
    private String moTa;
    private double diemPhuHop;
    
    public NganhHoc(String ten, String[] kyNang, String moTa) {
        this.ten = ten;
        this.kyNang = kyNang;
        this.moTa = moTa;
        this.diemPhuHop = 0.0;
    }
    
    // Getters and setters
    public String getTen() {
        return ten;
    }
    
    public void setTen(String ten) {
        this.ten = ten;
    }
    
    public String[] getKyNang() {
        return kyNang;
    }
    
    public void setKyNang(String[] kyNang) {
        this.kyNang = kyNang;
    }
    
    public String getMoTa() {
        return moTa;
    }
    
    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }
    
    public double getDiemPhuHop() {
        return diemPhuHop;
    }
    
    public void setDiemPhuHop(double diemPhuHop) {
        this.diemPhuHop = diemPhuHop;
    }
    
    @Override
    public String toString() {
        return "NganhHoc{" +
                "ten='" + ten + '\'' +
                ", kyNang=" + Arrays.toString(kyNang) +
                ", moTa='" + moTa + '\'' +
                ", diemPhuHop=" + diemPhuHop +
                '}';
    }
}
