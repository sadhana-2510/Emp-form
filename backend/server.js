const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'S@du2510',
  database: process.env.DB_NAME || 'employee_db',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve React frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  });
}

// Default route status
app.get('/api/employees/add', (req, res) => {
  res.send('Server is running. Use POST /api/employees/add to add an employee.');
});

// API to get all employees
app.get('/api/employees', (req, res) => {
  const query = 'SELECT * FROM employees';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err.message);
      return res.status(500).json({ error: 'Error fetching employees' });
    }
    res.status(200).json(results);
  });
});

// API add an employee
app.post('/api/employees/add', (req, res) => {
  const { employee_id, name, email, phone_number, department, date_of_joining, role } = req.body;

  if (!employee_id || !name || !email || !phone_number || !department || !date_of_joining || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `INSERT INTO employees (employee_id, name, email, phone_number, department, date_of_joining, role) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [employee_id, name, email, phone_number, department, date_of_joining, role], (err, result) => {
    if (err) {
      console.error('Error adding employee:', err.message);
      return res.status(500).json({ error: 'Error adding employee' });
    }
    return res.status(200).json({ message: 'Employee added successfully', data: result });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
