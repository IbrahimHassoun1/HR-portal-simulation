import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, '../database.yaml');
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, 'utf8'));

const {
  'sqlite_path': sqlitePath,
} = dbConfig;

const db = new sqlite3.Database(sqlitePath);

const employees = [
  {
    "id": 1,
    "full_name": "Layla Ali",
    "email": "Layla@gmail.com",
    "phone": "12345678",
    "department": "HR",
    "title": "Junior HR",
    "birthday": "2003-06-18",
    "start_time": "2022-02-08",
    "end_time": null,
    "salary": 1500,
    "image": "1739301429516_360_F_279669366_Lk12QalYQKMczLEa4ySjhaLtx1M2u7e6.jpg",
    "cv": null
  },
  {
    "id": 2,
    "full_name": "Ibrahim Hassoun",
    "email": "ihassoun73@gmail.com",
    "phone": "81014323",
    "department": "Tech",
    "title": "Junior Full Stack dev",
    "birthday": "2001-10-01",
    "start_time": "2025-02-15",
    "end_time": null,
    "salary": 1400,
    "image": "1739301469275_1733436721338.jpg",
    "cv": "1739301469275_CV Ibrahim Hassoun (1) (2).pdf"
  },
  {
    "id": 3,
    "full_name": "John Doe",
    "email": "johnDoe@gmail.com",
    "phone": "12345678",
    "department": "Accounting",
    "title": "Junior Accountant",
    "birthday": "2004-07-15",
    "start_time": "2022-12-15",
    "end_time": "2024-03-06",
    "salary": 2100,
    "image": "1739301538472_images (2).png",
    "cv": null
  },
  {
    "id": 4,
    "full_name": "Ahmad Ahmad",
    "email": "ahmad@gmail.com",
    "phone": "12345678",
    "department": "Tech",
    "title": "Tech Lead",
    "birthday": "1955-03-10",
    "start_time": "1995-02-14",
    "end_time": null,
    "salary": 9000,
    "image": "1739301590755_images (1).png",
    "cv": null
  },
  {
    "id": 5,
    "full_name": "Josh Brownhill",
    "email": "IamJosh@gmail.com",
    "phone": "12345678",
    "department": "Tech",
    "title": "Senior Back-end Developer",
    "birthday": "1990-06-07",
    "start_time": "2018-02-07",
    "end_time": null,
    "salary": 7000,
    "image": "1739302500179_48.png",
    "cv": "1739302500180_CV Ibrahim Hassoun (1) (2).pdf"
  },
  {
    "id": 6,
    "full_name": "Rodayna Chris",
    "email": "Rod@gmail.com",
    "phone": "53453455",
    "department": "Accounting",
    "title": "Accounting Manager",
    "birthday": "1982-12-08",
    "start_time": "2006-07-13",
    "end_time": null,
    "salary": 5000,
    "image": "1739302637918_5.png",
    "cv": "1739302637919_CV Ibrahim Hassoun (1) (2).pdf"
  }
]

const timesheets = [
  {
    "id": 1,
    "employee_id": 1,
    "description": "conducted 3 interviews",
    "start_time": "2025-02-11T21:25",
    "end_time": "2025-02-13T21:25"
  },
  {
    "id": 2,
    "employee_id": 2,
    "description": "Implemented the HR portal",
    "start_time": "2025-02-11T21:25",
    "end_time": "2025-02-13T21:25"
  },
  {
    "id": 3,
    "employee_id": 6,
    "description": "Preparing Crew Payroll",
    "start_time": "2025-02-01T09:38",
    "end_time": "2025-02-03T14:30"
  }
  
];


const insertData = (table, data) => {
  const columns = Object.keys(data[0]).join(', ');
  const placeholders = Object.keys(data[0]).map(() => '?').join(', ');

  const insertStmt = db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`);

  data.forEach(row => {
    insertStmt.run(Object.values(row));
  });

  insertStmt.finalize();
};

db.serialize(() => {
  insertData('employees', employees);
  insertData('timesheets', timesheets);
});

db.close(err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Database seeded successfully.');
  }
});

