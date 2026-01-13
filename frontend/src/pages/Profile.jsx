import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <h1>profile page</h1>

      <p>
        <strong>Name:</strong> {user?.name}
      </p>
      <p>
        <strong>Email:</strong> {user?.email}
      </p>
      <p>
        <strong>Admin:</strong> {user?.isAdmin ? "Yes" : "No"}
      </p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;
