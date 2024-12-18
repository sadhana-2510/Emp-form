import React from "react";
import "./App.css";
import AddEmployeeForm from "../components/AddEmployeeForm"; // Import the AddEmployeeForm component

function App() {
  return (
    <div className="App">
      <h1>Employee Management System</h1>
      <AddEmployeeForm />
    </div>
  );
}

export default App;