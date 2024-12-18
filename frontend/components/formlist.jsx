import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeList.css"; // Add some styling

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]); // State for employee list
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(""); // State for error messages

  // Fetch employee list from backend
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployees(response.data); // Update state with fetched data
      setLoading(false); // Turn off loading
    } catch (err) {
      console.error(err);
      setError("Failed to fetch employee data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(); // Fetch employees on component mount
  }, []);

  return (
    <div className="employee-list-container">
      <h2 className="employee-heading">Employee List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employee_id}>
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
      )}
    </div>
  );
};

export default EmployeeList;