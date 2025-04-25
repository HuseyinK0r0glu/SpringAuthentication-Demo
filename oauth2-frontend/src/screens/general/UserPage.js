import React from "react";
import { useLocation } from "react-router-dom";
import defaultUserImage from "../../assets/defaultUserImage.jpeg"
import { useProfileImage } from "../../hooks/useProfileImage";

const UserPage = () => {
    
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    const user = users.find(u => u.id.toString() === id);

    const imageUrl = useProfileImage({user : user});

    return(
        <div className="container text-center mt-5">
            <h1 className="mb-4">User Profile</h1>
            <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", margin: "auto" }}>
                {user.local_picture
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
                    user.picture 
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
                        style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        }}
                    />
                    }
                <h2 className="h4">{user.username}</h2>
                <p className="text-muted">Email: {user.email}</p>
            </div>
        </div>
    );
};

export default UserPage;