import React , {useContext, useEffect, useState} from "react";
import {Context as UserContext} from "../../context/UserContext";
import defaultUserImage from "../../assets/defaultUserImage.jpeg"
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {

    const navigate = useNavigate();

    const {state,setUser,logout} = useContext(UserContext);

    const[isAuthenticated,setIsAuthenticated] = useState(false);

    useEffect(() => {
      const userFromStorage = localStorage.getItem("user");
      if(userFromStorage){
        const parsedUser = JSON.parse(userFromStorage);
        if(!state.user || state.user.id !== parsedUser.id){
          setUser(parsedUser);
        }
        setIsAuthenticated(true);
      }else {
        setIsAuthenticated(false);
      }
    },[]);

    const handleLogOut = () => {
        setIsAuthenticated(false); 
        localStorage.removeItem("user");
        // remove jwt too
        localStorage.removeItem("token");
        localStorage.clear();
        logout();
        navigate("/home");
    };

    return(
        <div className="container text-center mt-5">
            <h1 className="mb-4">Settings</h1>
            {isAuthenticated ? ( 
            <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", margin: "auto" }}>

                {state.user.picture 
                ? 
                <img 
                    src={state.user.picture} 
                    alt="Profile" 
                    className="rounded-circle border mb-3"
                    width="100" 
                    height="100" 
                />
                :
                state.user.local_picture 
                ?
                <img 
                  src={`http://localhost:8080/${state.user.local_picture}`} 
                  alt="Profile" 
                  className="rounded-circle border mb-3"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                : 
                <img 
                  src={defaultUserImage} 
                  alt="Profile" 
                  className="rounded-circle border mb-3"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                }

                <h2 className="h4">{state.user.name}</h2>
                <p className="text-muted">Email: {state.user.email}</p>

                <div className="d-flex flex-column align-items-center">
                  <button
                    className="btn btn-primary btn-lg w-100 mt-3"
                    onClick={() => navigate("/update-username")}
                  >
                    <i className="fas fa-user-edit me-2"></i> Update Username
                  </button>

                  {!state.user?.provider && (
                      <button
                        className="btn btn-secondary btn-lg w-100 mt-3"
                        onClick={() => navigate("/update-password")}
                      >
                        <i className="fas fa-key me-2"></i> Update Password
                      </button>
                  )}

                  <button
                      className="btn btn-info btn-lg w-100 mt-3"
                      onClick={() => navigate("/upload-profile-picture")}
                    >
                      <i className="fas fa-image me-2"></i> Change Profile Picture
                  </button>

                  <button 
                    className="btn btn-danger btn-lg w-100 mt-3"
                    onClick={() => handleLogOut()}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i> Log Out
                  </button> 

                  <button
                    className="btn btn-outline-danger btn-lg w-100 mt-3"
                    onClick={() => navigate("/delete-account")}
                  >
                    <i className="fas fa-trash-alt me-2"></i> Delete Account
                  </button>
                </div>
            </div>
            ) : (
            <p className="alert alert-warning">No user logged in</p>
            )}
        
        </div>
    );
}

export default SettingsPage;