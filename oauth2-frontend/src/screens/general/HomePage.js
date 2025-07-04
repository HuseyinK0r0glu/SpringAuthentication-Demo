import React , {useContext, useEffect, useState} from "react";
import {Context as UserContext} from "../../context/UserContext";
import AdminPage from "../admin/AdminPage";
import defaultUserImage from "../../assets/defaultUserImage.jpeg"
import { authFetch } from "../../components/ApiClient";
import { useNavigate } from "react-router-dom";
import useAuthSync from "../../hooks/useAuthSync";
import { useProfileImage } from "../../hooks/useProfileImage";

const HomePage = () => {
  
    const navigate = useNavigate();

    const {state,setUser,logout} = useContext(UserContext);
    const[isAuthenticated,setIsAuthenticated] = useState(false);

    useAuthSync({user : state.user, setUser, setIsAuthenticated});

    const imageUrl = useProfileImage({user : state.user});

    useEffect(() => {

      const checkToken = async () => {
        const token = localStorage.getItem("token");
        
        if(!token){
          return;
        }

        try{
          
          const data = await authFetch("http://localhost:8080/api/auth/validate-token",{
            method : 'GET'
          },true);

          if(data.invalidToken){
            logout();
            navigate("/login?message=session-expired");
            return;
          }

        }catch(error){
          console.log(error.message);
        }

      };

      if(setIsAuthenticated){

        const token = localStorage.getItem("token");

        if(!token){
          logout();
          localStorage.clear();
          return;
        }

        checkToken();

      }      

    },[]);
 
    return (
      <div className="container text-center mt-5">
        {isAuthenticated && state.user ? 
          (state.user?.roles || []).includes("ROLE_ADMIN") ? (
            <AdminPage/>
          ) : ( 
              <div>
                <h1 className="mb-4">Home Page</h1>
                <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", margin: "auto" }}>

                  {state.user.local_picture
                    ? 
                    <img 
                      src={imageUrl} 
                      alt="Profile" 
                      className="rounded-circle border mb-3"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    :
                    state.user.picture 
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
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  }
                  
                  <h2 className="h4">Welcome, {state.user.name}</h2>
                  <p className="text-muted">Email: {state.user.email}</p>
                  
                  <button
                      className="btn btn-primary btn-lg w-100 mt-3"
                      onClick={() => navigate("/content")}
                    >
                      <i className="fas fa-pen-nib me-2"></i> Create content
                  </button>

                  {state.user.phone && state.user.phone_verified === false ? (
                    <button
                      className="btn btn-info btn-lg w-100 mt-3"
                      onClick={() => navigate("/verify-phone-number")}
                    >
                      <i className="fas fa-check-circle me-2"></i> Verify your phone number
                    </button>
                  ) : (
                    <button
                      className="btn btn-info btn-lg w-100 mt-3"
                      onClick={() => navigate("/add-phone-number")}
                    >
                      <i className="fas fa-phone me-2"></i> Add your phone number
                    </button>
                  )}

                  <button
                    className="btn btn-success btn-lg w-100 mt-3"
                    onClick={() => navigate("/playchess")}
                  >
                    <i className="fas fa-chess me-2"></i> Play Chess
                  </button>

                </div>
              </div>
        ) : (
          <div>
            <h1 className="mb-4">Home Page</h1>
            <p className="alert alert-warning">No user logged in</p>
          </div>
        )}
        
      </div>
    );
}

export default HomePage;