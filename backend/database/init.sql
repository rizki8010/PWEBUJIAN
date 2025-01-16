-- Create database if not exists
CREATE DATABASE IF NOT EXISTS ktm_db;
USE ktm_db;

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nim VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    faculty VARCHAR(100) NOT NULL,
    major VARCHAR(100) NOT NULL,
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Query to check data (can be used for testing)
-- SELECT * FROM students ORDER BY created_at DESC;
