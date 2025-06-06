import React , {useContext, useEffect, useState} from "react";
import {Context as UserContext} from "../../context/UserContext";
import defaultUserImage from "../../assets/defaultUserImage.jpeg"
import { useNavigate } from "react-router-dom";
import { useProfileImage } from "../../hooks/useProfileImage";
import useAuthSync from "../../hooks/useAuthSync";
import { authFetch } from "../../components/ApiClient";
import Swal from "sweetalert2"; // for better alerts and confirms 

const SettingsPage = () => {

    const navigate = useNavigate();

    const {state,setUser,logout} = useContext(UserContext);

    const[isAuthenticated,setIsAuthenticated] = useState(false);

    const imageUrl = useProfileImage({user : state.user});

    useAuthSync({user : state.user , setUser , setIsAuthenticated});

    const[hasImage,setHasImage] = useState(false);

    useEffect(() => {
      if(state.user === null){
        return;
      }

      if(state.user.local_picture !== null){
        setHasImage(true);
      }

    } , [state.user]);

    const handleLogOut = () => {
        setIsAuthenticated(false); 
        localStorage.removeItem("user");
        // remove jwt too
        localStorage.removeItem("token");
        localStorage.clear();
        logout();
        navigate("/home");
    };

    const handleDeletePicture = async () => {

      const result = await Swal.fire({
        title : 'Are you sure?',
        text : 'Do you really want to delete your profile picture?',
        icon : 'warning',
        showCancelButton : true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });

      if(!result.isConfirmed) return;

      try{

        const data = await authFetch("http://localhost:8080/api/users/delete-profile-picture",{
          method : 'DELETE',
        },true);

        if(data.invalidToken){
          logout();
          navigate("/login?message=session-expired");
          return;
        }
        
        const updatedUser = {...state.user,local_picture : null};
        setUser(updatedUser);
        localStorage.setItem("user",JSON.stringify(updatedUser));
        setHasImage(false);

        await Swal.fire({
          title: 'Deleted!',
          text: 'Your profile picture has been removed.',
          icon: 'success',
          confirmButtonColor: '#3085d6'
        });

      }catch(error){
        Swal.fire({
          title: 'Oops!',
          text: error?.message || "Something went wrong while deleting the picture.",
          icon: 'error',
          confirmButtonColor: '#d33'
        });
        console.error("Error deleting account:", error);
      }

    };

    const[isVisible,setIsVisible] = useState(state.user?.picture_visible ?? true);

    const handleVisibilityChange = async (newValue) => {

      try{
        const data = await authFetch("http://localhost:8080/api/users/profile-picture-visibility",{
          method : 'PATCH',
          headers: {
            "Content-Type": "application/json",
          },
          body : JSON.stringify({isVisible : newValue}),
        },true);

        if (data.invalidToken) {
          logout();
          navigate("/login?message=session-expired");
          return;
        }

        console.log(data);

        const updatedUser = {...state.user,picture_visible : newValue};
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsVisible(newValue);

      }catch(error){
        Swal.fire({
          title: 'Oops!',
          text: error?.message || 'Something went wrong.',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
        console.error("Error deleting account:", error);
      }


    };

    return(
        <div className="container text-center mt-5">
            <h1 className="mb-4">Settings</h1>
            {isAuthenticated ? ( 
            <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", margin: "auto" }}>

                {state.user.local_picture
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
                  state.user.picture 
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
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                }

                <h2 className="h4">{state.user.name}</h2>
                <p className="text-muted">Email: {state.user.email}</p>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="visibilitySwitch"
                    checked={isVisible}
                    onChange={(e) => handleVisibilityChange(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="visibilitySwitch">
                    Show my profile picture to others
                  </label>
                </div>

                <div className="d-flex flex-column align-items-center">
                  <button
                    className="btn btn-primary btn-lg w-100 mt-3"
                    onClick={() => navigate("/update-username")}
                  >
                    <i className="fas fa-user-edit me-2"></i> Update Username
                  </button>

                  {!state.user?.provider && (
                      <button
                        className="btn btn-secondary btn-lg w-100 mt-3"
                        onClick={() => navigate("/update-password")}
                      >
                        <i className="fas fa-key me-2"></i> Update Password
                      </button>
                  )}

                  <button
                      className="btn btn-info btn-lg w-100 mt-3"
                      onClick={() => navigate("/upload-profile-picture")}
                    >
                      <i className="fas fa-image me-2"></i> Change Profile Picture
                  </button>

                  {hasImage 
                    ?
                    <button className="btn btn-outline-warning btn-lg w-100 mt-3" onClick = {handleDeletePicture}>
                      <i className="fas fa-code me-2"></i> Delete Picture
                    </button>
                    :
                    null 
                  }

                  <button 
                    className="btn btn-danger btn-lg w-100 mt-3"
                    onClick={() => handleLogOut()}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i> Log Out
                  </button> 

                  <button
                    className="btn btn-outline-danger btn-lg w-100 mt-3"
                    onClick={() => navigate("/delete-account")}
                  >
                    <i className="fas fa-trash-alt me-2"></i> Delete Account
                  </button>
                </div>
            </div>
            ) : (
            <p className="alert alert-warning">No user logged in</p>
            )}
        
        </div>
    );
}

export default SettingsPage;