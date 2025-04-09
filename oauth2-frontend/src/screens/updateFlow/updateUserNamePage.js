import {useState , useContext} from "react";
import { Context as UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../components/ApiClient";

const UpdateUsernamePage = () => {

    const navigate = useNavigate();

    const {state,setUser} = useContext(UserContext);  

    const[username,setUsername] = useState("");  
    const[message,setMessage] = useState("");  
    const[status,setStatus] = useState("");

    const updateUsername = async () => {

        const userId = state.user.id;

        try{

            const data = await authFetch(`http://localhost:8080/api/users/${userId}/update-username`,{
              method : 'PUT',
              headers : {
                  'Content-Type' : 'application/json',
              },
              body : JSON.stringify({username})
            },true);

            setStatus("success");
            setMessage("Username updated successfully!");
            // after calling the api and getting succesfull result update user 
            const updatedUser = {...state.user,name: username};
            setUser(updatedUser);
            localStorage.setItem("user",JSON.stringify(updatedUser));
            setTimeout(() => navigate("/home") , 1000);
            
        }catch(error){
            setStatus("failed");
            setMessage(error.message || "Something went wrong!");
        }
    }

    return(
        <div className="container mt-5">
        <h2 className="text-center mb-4">Edit Username</h2>
  
        <div className="card p-4 shadow-sm" style={{ maxWidth: "600px", margin: "auto" }}>
          <h3 className="text-center mb-4">Change Username</h3>
  
          <div className="form-group">
            <label htmlFor="username" className="form-label">New Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="New Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
  
          <button
            onClick={updateUsername}
            className="btn btn-primary btn-lg w-100 mt-3"
          >
            Update Username
          </button>

          {status === "failed" && (
            <p className="text-danger mt-2">{message}</p>
          )}
          {status === "success" && (
            <p className="text-success mt-2">{message}</p>
          )}

        </div>
      </div>
    );
}

export default UpdateUsernamePage;