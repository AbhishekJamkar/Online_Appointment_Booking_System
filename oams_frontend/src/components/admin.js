import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
import '../styles/Admin.css'; // Import CSS file

const Admin = () => {
  const [users, setUsers] = useState([]);

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

  return (
    <div className="admin-container">
     
      <li>
            <Link to="/categories" className="add-cat">
            Add Category
            </Link>
          </li>
      <h2>Admin Panel</h2>
      <h3>Users</h3>

      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Full Name</th>
            <th>Address</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.email}</td>
              <td>{user.fullName}</td>
              <td>{user.address}</td>
              <td>{user.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
