import React , {useContext, useEffect, useState} from "react";
import {Context as UserContext} from "../context/UserContext";
import defaultUserImage from "../assets/defaultUserImage.jpeg"
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
        logout();
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
                <img 
                    src={defaultUserImage} 
                    alt="Profile" 
                    className="rounded-circle border mb-3"
                    width="100" 
                    height="100" 
                />
                }

                <h2 className="h4">Welcome, {state.user.name}</h2>
                <p className="text-muted">Email: {state.user.email}</p>

                <button
                className="btn btn-primary btn-lg mb-3 w-100"
                onClick={() => navigate("/update-username")}
                >
                Update Username
                </button>

                <button
                className="btn btn-secondary btn-lg mb-3 w-100"
                onClick={() => navigate("/update-password")}
                >
                Update Password
                </button>

                <button 
                className="btn btn-danger btn-lg mb-3 w-100" 
                onClick={() => handleLogOut()}
                >
                <i className="fab fa-google"></i> Log Out
                </button>

            </div>
            ) : (
            <p className="alert alert-warning">No user logged in</p>
            )}
        
        </div>
    );
}

export default SettingsPage;