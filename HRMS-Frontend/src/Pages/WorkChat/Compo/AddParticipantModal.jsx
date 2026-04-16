import { useState, useEffect } from "react";
import { FaTimes, FaSearch, FaUserPlus } from "react-icons/fa";
import { fetchEmployeesAsUsers } from "../../../api/employeeApi";
import "./AddParticipantModal.css";

export default function AddParticipantModal({ isOpen, onClose, onAddParticipant, currentUser }) {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadEmployees();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = employees.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(query) ||
          emp.email?.toLowerCase().includes(query) ||
          emp.department?.toLowerCase().includes(query) ||
          emp.designation?.toLowerCase().includes(query)
      );
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  const loadEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEmployeesAsUsers();
      
      // Filter out current user
      const filtered = data.filter(emp => emp.email !== currentUser?.email);
      setEmployees(filtered);
      setFilteredEmployees(filtered);
    } catch (err) {
      console.error("Failed to load employees:", err);
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddParticipant = (employee) => {
    onAddParticipant(employee);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="add-participant-modal-overlay" onClick={onClose}>
      <div className="add-participant-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Participant</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="modal-content">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading employees...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={loadEmployees}>Retry</button>
            </div>
          )}

          {!loading && !error && filteredEmployees.length === 0 && (
            <div className="empty-state">
              <p>No employees found</p>
            </div>
          )}

          {!loading && !error && filteredEmployees.length > 0 && (
            <div className="employee-list">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="employee-item"
                  onClick={() => handleAddParticipant(employee)}
                >
                  <div className="employee-avatar">
                    {employee.name?.charAt(0).toUpperCase() || employee.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="employee-info">
                    <div className="employee-name">{employee.name || employee.email}</div>
                    <div className="employee-details">
                      {employee.designation && <span>{employee.designation}</span>}
                      {employee.department && <span> • {employee.department}</span>}
                    </div>
                    <div className="employee-email">{employee.email}</div>
                  </div>
                  <button className="add-btn">
                    <FaUserPlus />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}