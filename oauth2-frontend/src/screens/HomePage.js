import React , {useContext, useEffect, useState} from "react";
import {Context as UserContext} from "../context/UserContext";
import defaultUserImage from "../assets/defaultUserImage.jpeg"

const HomePage = () => {

    const {state,setUser} = useContext(UserContext);

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
 
    return (
      <div className="container text-center mt-5">
        <h1 className="mb-4">Home Page</h1>
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

          </div>
        ) : (
          <p className="alert alert-warning">No user logged in</p>
        )}
        
      </div>
    );
}

export default HomePage;