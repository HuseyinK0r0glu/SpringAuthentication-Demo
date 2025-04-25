import React, { useContext, useEffect, useState } from "react";
import { Context as UserContext } from "../../context/UserContext";
import { authFetch } from "../../components/ApiClient";
import { useNavigate } from "react-router-dom";
import defaultUserImage from "../../assets/defaultUserImage.jpeg"
import { useProfileImage } from "../../hooks/useProfileImage";

const UserCard = ({user}) => {

    const navigate = useNavigate();

    const imageUrl = useProfileImage({user : user});

    return(
        <div key={user.id} className="user-card">   
            <div className="card shadow-lg">
                <div className="card-body d-flex flex-column align-items-center">

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

                    <h2 className="h5 mb-1">{user.username}</h2>
                    <p className="text-muted mb-3">{user.email}</p>

                    <button className="btn btn-primary btn-sm" 
                        onClick={() => navigate(`/user-profile?id=${user.id}`)}
                    >
                        View Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminPage = () => {

    const {logout} = useContext(UserContext);

    const [users,setUsers] = useState([]);
    const [error,setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        
        const getAllUsers = async () => {
            try{
                const data = await authFetch("http://localhost:8080/api/admin/users",{
                    method : 'GET',
                },true);

                if(data.invalidToken){
                    logout();
                    localStorage.clear();
                    navigate("/login?message=session-expired");
                    return;  
                }

                localStorage.setItem("users",JSON.stringify(data));
                setUsers(data);

            }catch(error){
                console.error("Failed to fetch users", error);
                setError(error.message || "Failed to fetch users");
            }
        }

        getAllUsers();

    },[]);

    return(
        <div className="admin-page">
            <h1 className="text-center mb-4">Admin Page</h1>

            <div className="user-list">
                {users.map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>

            {error && <p className="text-danger text-center mt-4">{error}</p>}
        </div>
    );
};

export default AdminPage;
