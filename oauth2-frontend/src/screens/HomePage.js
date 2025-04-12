import React , {useContext, useEffect, useState} from "react";
import {Context as UserContext} from "../context/UserContext";
import AdminPage from "./AdminPage";
import defaultUserImage from "../assets/defaultUserImage.jpeg"
import { authFetch } from "../components/ApiClient";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  
    const navigate = useNavigate();

    const {state,setUser,logout} = useContext(UserContext);
    const[isAuthenticated,setIsAuthenticated] = useState(false);

    useEffect(() => {

      const checkToken = async () => {
        const token = localStorage.getItem("token");

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

      if(setIsAuthenticated){

        const token = localStorage.getItem("token");

        if(!token){
          logout();
          localStorage.clear();
          navigate("/login?message=session-expired");
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