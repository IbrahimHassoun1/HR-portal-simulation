-- This file contains the SQL schema, it drops all tables and recreates them
DROP TABLE IF EXISTS employees;

DROP TABLE IF EXISTS timesheets;

-- Create employees table
CREATE TABLE
    employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        birthday DATE,
        email TEXT,
        phone TEXT,
        department TEXT,
        title TEXT,
        salary REAL,
        start_time DATE,
        end_time DATE,
        image TEXT,
        cv TEXT
    );

CREATE TABLE
    timesheets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        employee_id INTEGER NOT NULL,
        description TEXT NULL,
        FOREIGN KEY (employee_id) REFERENCES employees (id)
    );