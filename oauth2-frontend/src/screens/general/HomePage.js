import React , {useContext, useEffect, useState} from "react";
import {Context as UserContext} from "../../context/UserContext";
import AdminPage from "../admin/AdminPage";
import defaultUserImage from "../../assets/defaultUserImage.jpeg"
import { authFetch } from "../../components/ApiClient";
import { useNavigate } from "react-router-dom";
import useAuthSync from "../../hooks/useAuthSync";

const HomePage = () => {
  
    const navigate = useNavigate();

    const {state,setUser,logout} = useContext(UserContext);
    const[isAuthenticated,setIsAuthenticated] = useState(false);

    const[imageUrl,setImageUrl] = useState(null); 

    useAuthSync({user : state.user, setUser, setIsAuthenticated});

    // for checking the profile picture
    useEffect(() => {

      const checkImage = async () => {

        try{
          
          const response = await fetch(`http://localhost:8080/${state.user.local_picture}`,{ 
            method : "HEAD",
          });

          if(response.ok){
            setImageUrl(`http://localhost:8080/${state.user.local_picture}`);
          }else {
            setImageUrl(defaultUserImage);
          }

        }catch(error){
          setImageUrl(defaultUserImage);
        }

      }

      if(state.user?.local_picture){
        checkImage();
      }else {
        setImageUrl(defaultUserImage);
      }

    }, [state.user?.local_picture]);

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


      // const userFromStorage = localStorage.getItem("user");
      // if(userFromStorage){
      //   const parsedUser = JSON.parse(userFromStorage);
      //   if(!state.user || state.user.id !== parsedUser.id){
      //     setUser(parsedUser);
      //   }
      //   setIsAuthenticated(true);
      // }else {
      //   setIsAuthenticated(false);
      // }

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