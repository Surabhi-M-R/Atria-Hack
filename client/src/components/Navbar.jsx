import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../store/auth-context";

export const Navbar = () => {
  const { isLoggedIn, canAccessAdmin, isLoading } = useAuth();
  return (
    <>
      <header>
        <div className="container">
          <div className="logo-brand">
            <NavLink to="/">Mastersilos Infotech</NavLink>
          </div>

          <nav>
            <ul>
              <li>
                <NavLink to="/"> Home </NavLink>
              </li>
              <li>
                <NavLink to="/about"> About </NavLink>
              </li>
              <li>
                <NavLink to="/service"> Services </NavLink>
              </li>
              <li>
                <NavLink to="/contact"> Contact </NavLink>
              </li>
              <li>
                <NavLink to="/blog"> Blog </NavLink>
              </li>
              <li>
                <NavLink to="/careers"> Careers </NavLink>
              </li>
              {!isLoading && (
                <li>
                  {isLoggedIn && canAccessAdmin ? (
                    <NavLink to="/admin/users"> Admin </NavLink>
                  ) : (
                    <NavLink to="/admin-login"> Admin </NavLink>
                  )}
                </li>
              )}
              {isLoggedIn ? (
                <li>
                  <NavLink to="/logout">Logout</NavLink>
                </li>
              ) : (
                <>
                  <li>
                    <NavLink to="/register"> Register </NavLink>
                  </li>
                  <li>
                    <NavLink to="/login"> Login </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};
