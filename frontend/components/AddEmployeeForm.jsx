import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddEmployeeForm.css";

const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    email: "",
    phone_number: "",
    department: "HR",
    date_of_joining: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    phone_number: "",
    email: "",
  });

  const [employees, setEmployees] = useState([]); // State to hold table data

  useEffect(() => {
    // Fetch existing employees when component mounts
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("https://emp-form-1.onrender.com/api/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []); // Empty dependency array means this only runs once after the component mounts

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      if (!/^\d{0,10}$/.test(value)) {
        setErrors({
          ...errors,
          phone_number: "Phone number can only have 10 digits.",
        });
        return;
      } else {
        setErrors({
          ...errors,
          phone_number: "",
        });
      }

      // Check for duplicate phone numbers
      if (employees.some((employee) => employee.phone_number === value)) {
        setErrors({
          ...errors,
          phone_number: "Phone number already exist.",
        });
        return;
      } else {
        setErrors({
          ...errors,
          phone_number: "",
        });
      }
    }

    if (name === "email") {
      if (employees.some((employee) => employee.email === value)) {
        setErrors({
          ...errors,
          email: "Email already exist.",
        });
        return;
      } else {
        setErrors({
          ...errors,
          email: "",
        });
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone_number.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    if (employees.some((employee) => employee.phone_number === formData.phone_number)) {
      alert("Phone number must be unique.");
      return;
    }

    try {
      const response = await axios.post(
        "https://emp-form-1.onrender.com/api/employees/add",
        formData
      );
      alert(response.data.message);

      // Add new employee to the table
      setEmployees([...employees, formData]);

      // Reset form data
      setFormData({
        employee_id: "",
        name: "",
        email: "",
        phone_number: "",
        department: "HR",
        date_of_joining: "",
        role: "",
      });
    } catch (error) {
      alert(error.response?.data?.error || "An error occurred.");
    }
  };

  const handleReset = () => {
    setFormData({
      employee_id: "",
      name: "",
      email: "",
      phone_number: "",
      department: "HR",
      date_of_joining: "",
      role: "",
    });
    setErrors({ phone_number: "", email: "" });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="form-heading">Add New Employee</h2>

        <div className="form-group">
          <label htmlFor="employee_id">Employee ID</label>
          <input
            type="text"
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            placeholder="Enter Employee ID"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => {
              if (!/^[a-zA-Z\s]*$/.test(e.target.value)) return;
              handleChange(e);
            }}
            placeholder="Enter Name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone_number">Phone Number</label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Enter Phone Number"
            pattern="\d{10}"
            title="Phone number must be exactly 10 digits."
            required
          />
          {errors.phone_number && (
            <span className="error-message">{errors.phone_number}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="Select department">Select department</option>
            <option value="Human Resources (HR)">Human Resources (HR)</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="IT (Information Technology)">
              IT (Information Technology)
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date_of_joining">Date of Joining</label>
          <input
            type="date"
            id="date_of_joining"
            name="date_of_joining"
            value={formData.date_of_joining}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="Choose Role">Choose Role</option>
            <option value="Intern">Intern</option>
            <option value="Fresher">Fresher</option>
            <option value="Manager">Manager</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Team Leader">Team Leader</option>
            <option value="Accountant">Accountant</option>
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-button">
            Submit
          </button>
          <button
            type="button"
            className="reset-button"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>

      {/* Table to display employees */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Department</th>
            <th>Date of Joining</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td>{employee.employee_id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.phone_number}</td>
              <td>{employee.department}</td>
              <td>{employee.date_of_joining}</td>
              <td>{employee.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddEmployeeForm;
