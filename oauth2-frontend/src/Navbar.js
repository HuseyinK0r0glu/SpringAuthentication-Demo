import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Context as UserContext } from "./context/UserContext";

export const Navbar = () => {

  const {state : {user}} = useContext(UserContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark py-3" style={{ backgroundColor: "#2c3e50" }}>
      <div className="container-fluid">
        <span className="navbar-brand" style={{ color: "#f8f9fa" }}>HK</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle Navigation"
        >
          <span className="navbar-toggler-icon" style={{ backgroundColor: "#f8f9fa" }}></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/home" style={{ color: "#f8f9fa" }}>Home</NavLink>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item dropdown">
                  <button 
                    className="btn btn-outline-light dropdown-toggle" 
                    id="userDropdown" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    {user.name || "User"}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                      <NavLink className="dropdown-item" to="/home">Profile</NavLink>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item m-1">
                  <NavLink className="btn btn-outline-light" to="/login">Log in</NavLink>
                </li>
                <li className="nav-item m-1">
                  <NavLink className="btn btn-outline-light" to="/signup">Sign up</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};