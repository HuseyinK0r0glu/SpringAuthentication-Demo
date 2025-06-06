import React , {useContext, useState, useEffect} from "react";
import { Context as UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../components/ApiClient";
import useAuthSync from "../../hooks/useAuthSync";
import Swal from "sweetalert2";

const DeleteAccountPage = () => {

    const {state , setUser ,logout} = useContext(UserContext);
    const [password,setPassword] = useState("");

    useAuthSync({user : state.user , setUser})

    const user = state.user || {};

    const navigate = useNavigate();

    const handleDelete = async () => {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: 'Do you really want to delete your account? This action is irreversible!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) return;

        const requestBody = user.provider ? {} : {password};

        try{

            let data;

            if(user.provider){
              data = await authFetch(`http://localhost:8080/api/users/oauth`,{
                method : "DELETE",
                headers : {
                    "Content-Type" : "application/json"
                },
              },true);
            }else {
              data = await authFetch(`http://localhost:8080/api/users/traditional`,{
                method : "DELETE",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(requestBody) 
              },true);
            }

            if(data.invalidToken){
              logout();
              navigate("/login?message=session-expired");
              return;
            }

            Swal.fire({
              title: 'Account Deleted',
              text: 'Your account has been deleted.',
              icon: 'success',
              confirmButtonColor: '#d33'
            });
            localStorage.clear();
            logout(); 
            navigate("/home"); 

        }catch(error){
            Swal.fire({
              title: 'Oops!',
              text: error?.message || 'Something went wrong.',
              icon: 'error',
              confirmButtonColor: '#d33'
            });
            console.error("Error deleting account:", error);
        }
    }

    return(
        <div className="container text-center mt-5">
        <h2>Delete Your Account</h2>
  
        {user.provider ? (
          <div>
            <p>Your account will be permanently deleted.</p>
            <button className="btn btn-danger" onClick={handleDelete}>
              Confirm Delete
            </button>
          </div>
        ) : (
          <div>
            <p>Please confirm your password to delete your account.</p>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-danger mt-3" onClick={handleDelete}>
              Delete Account
            </button>
          </div>
        )}
      </div>
    ); 
}

export default DeleteAccountPage;