import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAlert } from "../../context/AlertContext";

const AdminUsers = () => {
  const { showAlert } = useAlert();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/users");

        // ✅ ADMIN USERS EXCLUDED
        const normalUsers = data.filter(
          (user) => !user.isAdmin
        );

        setUsers(normalUsers);
      } catch (err) {
        showAlert(
          err.response?.data?.message ||
            "Failed to load users",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [showAlert]);

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h1>Users</h1>

      <table width="100%" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Email</th>
            <th>Admin</th>
            <th>Joined</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td align="center">No</td>
              <td>
                {user.createdAt
                  ? new Date(
                      user.createdAt
                    ).toLocaleDateString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
