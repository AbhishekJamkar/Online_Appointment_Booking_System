import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [showProviders, setShowProviders] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    navigate("/home");
  };


  const deleteUser = async (email) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/deleteProvider/${email}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log(`Doctor with email ${email} deleted successfully`);
        setUsers(prevUsers => prevUsers.filter(user => user.email !== email));
      } else {
        console.error(`Failed to delete doctor with email ${email}`);
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  return (
    <div className="admin-container" style={{ background: "linear-gradient(to right, #A9f1df, #FFBBBB)", minHeight: "100vh" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <ul className="navbar-links">
          <Link to="/categories" style={{ backgroundColor: "#007bff", border: "none", color: "#fff", cursor: "pointer", padding: "5px 10px", borderRadius: "50px" }} >
            Add Specialization
          </Link>
          <button 
            style={{ 
              backgroundColor: "#007bff", 
              border: "none", 
              color: "#fff", 
              cursor: "pointer", 
              padding: "5px 10px", 
              borderRadius: "50px" 
            }} 
            onClick={() => setShowProviders(true)}
          >
            Doctors
          </button>
          <button 
            style={{ 
              backgroundColor: "#007bff", 
              border: "none", 
              color: "#fff", 
              cursor: "pointer", 
              padding: "5px 10px", 
              borderRadius: "50px",
              marginLeft: "10px" 
            }} 
            onClick={() => setShowAllUsers(true)}
          >
            All Users
          </button>
        </ul>
        
        <div style={{ display: "flex", alignItems: "center" }}>
          <b className="navbar-item welcome-admin" style={{ marginRight: "10px" }}>
            Welcome, Admin
          </b>
          <button style={{ backgroundColor: "red", border: "none", color: "#fff", cursor: "pointer", padding: "5px 10px", borderRadius: "50px" }} onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      {showProviders && (
        <div className="user-table-container">
          <h2>Doctors</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr>
                <th style={{ border: "2px solid #000000", padding: "8px" }}>Email</th>
                <th style={{ border: "2px solid #000000", padding: "8px" }}>Full Name</th>
                <th style={{ border: "2px solid #000000", padding: "8px" }}>Address</th>
                <th style={{ border: "2px solid #000000", padding: "8px" }}>Contact</th>
                <th style={{ border: "2px solid #000000", padding: "8px" }}>Delete Doctor</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(user => user.isProvider).map(provider => (
                <tr key={provider.email}>
                  <td style={{ border: "2px solid #000000", padding: "8px" }}>{provider.email}</td>
                  <td style={{ border: "2px solid #000000", padding: "8px" }}>{provider.fullName}</td>
                  <td style={{ border: "2px solid #000000", padding: "8px" }}>{provider.address}</td>
                  <td style={{ border: "2px solid #000000", padding: "8px" }}>{provider.contact}</td>
                  <td style={{ border: "2px solid #000000", padding: "8px" }}>
                    <button style={{ backgroundColor: "red", border: "none", color: "#fff", cursor: "pointer", padding: "5px 10px", borderRadius: "8px" }} onClick={() => deleteUser(provider.email)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button style={{ backgroundColor: "#007bff", border: "none", color: "#fff", cursor: "pointer", padding: "10px 20px", borderRadius: "8px", marginTop: "20px" }} onClick={() => setShowProviders(false)}>Back</button>
        </div>
      )}
      {showAllUsers && (
        <div className="user-table-container">
          <h2>All Users</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr>
                <th style={{ border: "2px solid #000000", padding: "8px" }}>Email</th>
                <th style={{ border: "2px solid #000000", padding: "8px" }}>Full Name</th>
                <th style={{ border: "2px solid #000000", padding: "8px" }}>Address</th>
                <th style={{ border: "2px solid #000000", padding: "8px" }}>Contact</th>
                <th style={{ border: "2px solid #000000", padding: "8px" }}>Delete User</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.email}>
                  <td style={{ border: "2px solid #000000", padding: "8px" }}>{user.email}</td>
                  <td style={{ border: "2px solid #000000", padding: "8px" }}>{user.fullName}</td>
                  <td style={{ border: "2px solid #000000", padding: "8px" }}>{user.address}</td>
                  <td style={{ border: "2px solid #000000", padding: "8px" }}>{user.contact}</td>
                  <td style={{ border: "2px solid #000000", padding: "8px" }}>
                    <button style={{ backgroundColor: "red", border: "none", color: "#fff", cursor: "pointer", padding: "5px 10px", borderRadius: "8px" }} onClick={() => deleteUser(user.email)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button style={{ backgroundColor: "#007bff", border: "none", color: "#fff", cursor: "pointer", padding: "10px 20px", borderRadius: "8px", marginTop: "20px" }} onClick={() => setShowAllUsers(false)}>Back</button>
        </div>
      )}
    </div>
  );
};

export default Admin;
