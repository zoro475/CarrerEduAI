/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Utility class for database connection
 */
public class DBConnection {
    private static final String URL = "jdbc:sqlite:educareer.db";
    private static Connection connection = null;
    
    /**
     * Get database connection
     */
    public static Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            try {
                Class.forName("org.sqlite.JDBC");
                connection = DriverManager.getConnection(URL);
                createTablesIfNotExist();
            } catch (ClassNotFoundException e) {
                throw new SQLException("SQLite JDBC driver not found", e);
            }
        }
        return connection;
    }
    
    /**
     * Create tables if they don't exist
     */
    private static void createTablesIfNotExist() throws SQLException {
        String createKetQuaTable = """
            CREATE TABLE IF NOT EXISTS ket_qua (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ho_ten TEXT NOT NULL,
                so_thich TEXT,
                ky_nang TEXT,
                thoi_gian DATETIME DEFAULT CURRENT_TIMESTAMP,
                ghi_chu TEXT
            )
            """;
        
        String createNganhHocTable = """
            CREATE TABLE IF NOT EXISTS nganh_hoc (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ket_qua_id INTEGER,
                ten TEXT NOT NULL,
                ky_nang TEXT,
                mo_ta TEXT,
                diem_phu_hop REAL DEFAULT 0.0,
                FOREIGN KEY (ket_qua_id) REFERENCES ket_qua(id)
            )
            """;
        
        try (var stmt = connection.createStatement()) {
            stmt.execute(createKetQuaTable);
            stmt.execute(createNganhHocTable);
        }
    }
    
    /**
     * Close database connection
     */
    public static void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                System.err.println("Error closing connection: " + e.getMessage());
            }
        }
    }
}
