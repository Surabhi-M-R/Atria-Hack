import { NavLink, Outlet, Navigate } from "react-router-dom";
import { FaUser, FaHome, FaBriefcase } from "react-icons/fa";
import { FaMessage, FaNewspaper } from "react-icons/fa6";
import { useAuth } from "../../store/auth-context";

export const AdminLayout = () => {
  const { user, isLoading, canAccessAdmin } = useAuth();
  console.log("admin layout ", user);

  if (isLoading) {
    return <h1>Loading ...</h1>;
  }

  if (!canAccessAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <header>
        <div className="container">
          <nav>
            <ul>
              <li>
                <NavLink to="/admin/users">
                  <FaUser /> users
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/contacts">
                  <FaMessage /> Contact
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/blogs">
                  <FaNewspaper /> Blogs
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/careers">
                  <FaBriefcase /> Careers
                </NavLink>
              </li>

            </ul>
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  );
};
