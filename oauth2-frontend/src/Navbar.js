import { useContext , useEffect, useState} from "react";
import { NavLink } from "react-router-dom";
import { Context as UserContext } from "./context/UserContext";
import useAuthSync from "./hooks/useAuthSync";
import { useProfileImage } from "./hooks/useProfileImage";
import defaultUserImage from "./assets/defaultUserImage.jpeg"

export const Navbar = () => {

  const[isAuthenticated , setIsAuthenticated] = useState(false);

  const {state , setUser} = useContext(UserContext);

  useAuthSync({user : state.user , setUser , setIsAuthenticated});

  const imageUrl = useProfileImage({user : state.user});

  return (
    <nav className="navbar navbar-expand-lg navbar-dark py-3" style={{ backgroundColor: "#2c3e50" }}>
      <div className="container-fluid">
        <span className="navbar-brand fw-bold fs-4" style={{ color: "#f8f9fa" }}>HK</span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
          <ul className="navbar-nav d-flex align-items-center gap-3">
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center" to="/home">
                <i className="fas fa-home me-2"></i>
                Home
              </NavLink>
            </li>
            {isAuthenticated ? (
                <li className="nav-item">
                  <NavLink className="nav-link d-flex align-items-center" to="/friends">
                    <i className="fas fa-user-friends me-2"></i>
                    Friends
                  </NavLink>
                </li>
            ) : (null)}
          </ul>

          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item dropdown">
                  <button 
                    className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2" 
                    id="userDropdown" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >

                    {state.user?.local_picture
                      ? 
                      <img
                      src={imageUrl}
                      alt="Profile"
                      className="rounded-circle border"
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                      }}
                    />
                    :
                    state.user?.picture 
                      ?
                      <img 
                        src={state.user.picture} 
                        alt="Profile" 
                        className="rounded-circle border"
                        style={{
                          width: "30px",
                          height: "30px",
                          objectFit: "cover",
                        }}
                      />
                      :
                      <img 
                        src={defaultUserImage} 
                        alt="Profile" 
                        className="rounded-circle border"
                        style={{
                          width: "30px",
                          height: "30px",
                          objectFit: "cover",
                        }}  
                      />
                    }
                    <span>{state.user?.name || "User"}</span>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                      <NavLink className="dropdown-item" to="/home">Home</NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/settings">Settings</NavLink>
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