import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../store/auth-context";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    isAdmin: false,
  });
  const [isCreating, setIsCreating] = useState(false);

  const { authorizationToken, API } = useAuth();

  const getAllUsersData = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/admin/users`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });
      const data = await response.json();
      console.log(`users ${data}`);
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }, [API, authorizationToken]);

  //   delelte the user on delete button
  const deleteUser = useCallback(
    async (id) => {
      try {
        const response = await fetch(`${API}/api/admin/users/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: authorizationToken,
          },
        });
        const data = await response.json();
        console.log(`users after delete:  ${data}`);

        if (response.ok) {
          getAllUsersData();
          toast.success("User deleted successfully");
        } else {
          toast.error(data.message || "Failed to delete user");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error deleting user");
      }
    },
    [API, authorizationToken, getAllUsersData]
  );

  // Create new user
  const createUser = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch(`${API}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User created successfully!");

        // Check email status
        if (data.emailStatus) {
          if (data.emailStatus.sent) {
            toast.info("Welcome email sent successfully!");
          } else {
            console.warn("Email not sent:", data.emailStatus);
            toast.warning(
              `User created, but welcome email could not be sent. ${
                data.emailStatus.error || "Check email configuration."
              }`
            );
          }
        }

        // Reset form and refresh user list
        setNewUser({
          username: "",
          email: "",
          phone: "",
          password: "",
          isAdmin: false,
        });
        setShowCreateForm(false);
        getAllUsersData();
      } else {
        toast.error(data.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error creating user");
    } finally {
      setIsCreating(false);
    }
  };

  const handleNewUserInput = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUser({
      ...newUser,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    getAllUsersData();
  }, [getAllUsersData]);
  return (
    <>
      <section className="admin-users-section">
        <div className="container">
          <h1>Admin Users Data</h1>
          <button
            className="btn"
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{ marginTop: "1rem" }}
          >
            {showCreateForm ? "Cancel" : "Create New User"}
          </button>
        </div>

        {showCreateForm && (
          <div
            className="container"
            style={{ marginTop: "2rem", maxWidth: "600px" }}
          >
            <h2>Create New User</h2>
            <form onSubmit={createUser} style={{ marginTop: "1rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={newUser.username}
                  onChange={handleNewUserInput}
                  required
                  style={{ width: "100%", padding: "0.5rem" }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={newUser.email}
                  onChange={handleNewUserInput}
                  required
                  style={{ width: "100%", padding: "0.5rem" }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={newUser.phone}
                  onChange={handleNewUserInput}
                  style={{ width: "100%", padding: "0.5rem" }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={newUser.password}
                  onChange={handleNewUserInput}
                  required
                  style={{ width: "100%", padding: "0.5rem" }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label>
                  <input
                    type="checkbox"
                    name="isAdmin"
                    checked={newUser.isAdmin}
                    onChange={handleNewUserInput}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Admin User
                </label>
              </div>

              <button
                type="submit"
                className="btn"
                disabled={isCreating}
                style={{ width: "100%" }}
              >
                {isCreating ? "Creating..." : "Create User"}
              </button>
            </form>
          </div>
        )}

        <div className="container  admin-users">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Admin</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((curUser, index) => {
                return (
                  <tr key={index}>
                    <td>{curUser.username}</td>
                    <td>{curUser.email}</td>
                    <td>{curUser.phone}</td>
                    <td>{curUser.isAdmin ? "Yes" : "No"}</td>
                    <td>
                      <Link to={`/admin/users/${curUser._id}/edit`}>Edit</Link>
                    </td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => deleteUser(curUser._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};
