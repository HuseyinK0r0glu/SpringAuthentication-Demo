import React, { useEffect } from "react";

const useAuthSync = ({user , setUser , setIsAuthenticated}) => {

    useEffect(() => {
        const userFromStorage = localStorage.getItem("user");
        if(userFromStorage){
          const parsedUser = JSON.parse(userFromStorage);
          if(!user || user.id !== parsedUser.id){
            setUser(parsedUser);
          }
          if(setIsAuthenticated) setIsAuthenticated(true);
        }else {
          if(setIsAuthenticated) setIsAuthenticated(false);
        }
    } , [user]);

};

export default useAuthSync;