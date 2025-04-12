import React from "react";
import { useLocation } from "react-router-dom";
import defaultUserImage from "../assets/defaultUserImage.jpeg"

const UserPage = () => {
    
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    if(!users){
        return <p>Users is empty</p>
    }

    const user = users.find(u => u.id.toString() === id);

    if(!user){
        return <p>User not found</p>
    }

    return(
        <div className="container text-center mt-5">
            <h1 className="mb-4">User Profile</h1>
            <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", margin: "auto" }}>
                {user.picture 
                ? 
                <img 
                    src={user.picture} 
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
                <h2 className="h4">{user.username}</h2>
                <p className="text-muted">Email: {user.email}</p>
            </div>
        </div>
    );
};

export default UserPage;