/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dao;

import model.KetQua;
import java.util.List;

/**
 * Data Access Object interface for KetQua
 */
public interface KetQuaDAO {
    
    /**
     * Save consultation result
     */
    int save(KetQua ketQua);
    
    /**
     * Get all consultation results
     */
    List<KetQua> getAll();
    
    /**
     * Get consultation result by ID
     */
    KetQua getById(int id);
    
    /**
     * Delete consultation result
     */
    boolean delete(int id);
    
    /**
     * Get statistics data
     */
    List<Object[]> getStatistics();
}
