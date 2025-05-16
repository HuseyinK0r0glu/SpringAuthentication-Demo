import React , {useState , useContext} from "react";
import { useLocation } from "react-router-dom";
import defaultUserImage from "../../assets/defaultUserImage.jpeg"
import { useProfileImage } from "../../hooks/useProfileImage";
import { authFetch } from "../../components/ApiClient";
import { Context as UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UserPage = () => {
    
    const {logout} = useContext(UserContext);

    const navigate = useNavigate();

    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    const [users, setUsers] = useState(() => {
        return JSON.parse(localStorage.getItem("users")) || [];
    });
    
    const user = users.find(u => u.id.toString() === id);

    const imageUrl = useProfileImage({user : user});

    const handleBanChange = async (newStatus) => {

        try{
            const data = await authFetch("http://localhost:8080/api/admin/ban-user",{
                method : "PATCH",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({user_id : user.id , ban_value : newStatus}),
            },true);

            if(data.invalidToken){
                logout();
                localStorage.clear();
                navigate("/login?message=session-expired");
                return;  
            }

            const updatedUsers = users.map( u => {
                if(u.id === user.id || u.id.toString() === user.id.toString()){
                    return { ...u, banned : newStatus };
                }
                return u;
            });

            localStorage.setItem("users", JSON.stringify(updatedUsers));
            setUsers(updatedUsers);
            
            console.log(data);

        }catch(error){
            Swal.fire({
                title: 'Oops!',
                text: error?.message || 'Something went wrong.',
                icon: 'error',
                confirmButtonColor: '#d33'
            });
            console.error("Error changing the status of the user:", error);
        }

    };

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
                <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light" style={{ maxWidth: "400px" }}>
                    <div className="d-flex flex-column">
                        <span className="fw-bold">User Status</span>
                        <span 
                        className={`badge mt-1 ${user.banned ? 'bg-danger' : 'bg-success'}`}
                        style={{ fontSize: "0.85rem", width: "fit-content" }}
                        >
                        {user.banned ? "Banned" : "Active"}
                        </span>
                    </div>

                    <button
                        className={`btn btn-sm ${user.banned ? 'btn-success' : 'btn-danger'}`}
                        onClick={() => handleBanChange(!user.banned)}
                    >
                        {user.banned ? "Unban" : "Ban"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserPage;