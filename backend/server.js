const express = require('express');
const path = require('path');

const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
require('dotenv').config();
const app=express();




const port = process.env.PORT || 5000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json());



// Default route status
app.get('/api/employees/add', (req, res) => {
  res.send('Server is running. Use POST /api/employees/add to add an employee.');
});

// API to get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*');

    if (error) {
      console.error('Error fetching employees:', error.message);
      return res.status(500).json({ error: 'Error fetching employees' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching employees:', err.message);
    res.status(500).json({ error: 'Error fetching employees' });
  }
});

// API add an employee
app.post('/api/employees/add', async (req, res) => {
  const { employee_id, name, email, phone_number, department, date_of_joining, role } = req.body;

  if (!employee_id || !name || !email || !phone_number || !department || !date_of_joining || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const { data, error } = await supabase
      .from('employees')
      .insert([{ employee_id, name, email, phone_number, department, date_of_joining, role }]);

    if (error) {
      console.error('Error adding employee:', error.message);
      return res.status(500).json({ error: 'Error adding employee' });
    }

    res.status(200).json({ message: 'Employee added successfully', data });
  } catch (err) {
    console.error('Error adding employee:', err.message);
    res.status(500).json({ error: 'Error adding employee' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
