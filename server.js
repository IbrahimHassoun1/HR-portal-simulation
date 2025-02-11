import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config()

const app = express();
const db = new sqlite3.Database('./app/db/db.sqlite');  
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cors());

const buildQuery = (filters) => {
  let query = "SELECT * FROM employees WHERE 1=1";
  const params = []

  if (filters.search) {
    query += " AND (full_name LIKE ? OR title LIKE ?)";
    params.push(`%${filters.search}%`, `%${filters.search}%`)
  }
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  if (filters.minAge) {
    const maxBirthYear = currentYear - filters.minAge; 
    query += " AND birthday <= ?";
    params.push(`${maxBirthYear}-12-31`);
  }

  if (filters.maxAge) {
    const minBirthYear = currentYear - filters.maxAge; 
    query += " AND birthday >= ?";
    params.push(`${minBirthYear}-01-01`)
  }

  if (filters.minSalary) {
    query += " AND salary >= ?";
    params.push(filters.minSalary)
  }

  if (filters.maxSalary) {
    query += " AND salary <= ?";
    params.push(filters.maxSalary)
  }

  if (filters.sortBy) {
    if (filters.sortBy === "salary") {
      query += ` ORDER BY ${filters.sortBy} DESC` 
    } else {
      query += ` ORDER BY ${filters.sortBy} `
    }
  }
  if (filters.onlyActive){
    query += " AND end_time IS NULL";
  }
  if (filters.department){
    query += " AND department = ?";
    params.push(filters.department);
  }
  return { query, params };
};

app.get("/api/employees", (req, res) => {
  const { search, minAge, maxAge, minSalary, maxSalary, sortBy,onlyActive,department } = req.query;

  const filters = {
    search,
    minAge: minAge ? parseInt(minAge) : undefined,
    maxAge: maxAge ? parseInt(maxAge) : undefined,
    minSalary: minSalary ? parseInt(minSalary) : undefined,
    maxSalary: maxSalary ? parseInt(maxSalary) : undefined,
    sortBy,onlyActive,department
    
  };

  const { query, params } = buildQuery(filters);

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Database Query Error:", err.message)
      return res.status(500).json({ error: err.message })
    }
    res.json({ employees: rows });
  });
});

app.post('/api/employees/update', (req, res) => {
  const {
    id, full_name, birthday, email, phone, department,title, salary, start_time, end_time} = req.body;

  let query = 'UPDATE employees SET';
  const params = [];

  if (full_name) {
    query += ' full_name = ?,'
    params.push(full_name);
  }
  if (birthday) {
    query += ' birthday = ?,'
    params.push(birthday);
  }
  if (email) {
    query += ' email = ?,';
    params.push(email);
  }
  if (phone) {
    query += ' phone = ?,'
    params.push(phone);
  }
  if (department) {
    query += ' department = ?,'
    params.push(department);
  }
  if (title) {
    query += ' title = ?,'
    params.push(title);
  }
  if (salary) {
    query += ' salary = ?,';
    params.push(salary);
  }
  if (start_time) {
    query += ' start_time = ?,'
    params.push(start_time);
  }
  if (end_time) {
    query += ' end_time = ?,'
    params.push(end_time);
  }

  query = query.slice(0, -1);

  query += ' WHERE id = ?'
  params.push(id)

  db.run(query, params, function (err) {
    if (err) {
      console.error('Database Query Error:', err.message);
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Employee updated successfully',
    });
  });
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
