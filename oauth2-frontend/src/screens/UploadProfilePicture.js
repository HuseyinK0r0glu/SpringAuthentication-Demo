import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadProfilePicture = () => {

    const navigate = useNavigate();
    const [file,setFile] = useState(null);
    const [error,setError] = useState("");

    const handleFileChange = (e) => {
        if(e.target.files  && e.target.files[0]){
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const userFromStorage = localStorage.getItem("user");
        const parsedUser = JSON.parse(userFromStorage);

        const formData = new FormData();
        formData.append("image", file);
        formData.append("email", parsedUser.email);
        formData.append("password", parsedUser.password);

        try{
            const response = await fetch("http://localhost:8080/api/users/upload-profile-picture",{
                method : 'POST',
                body : formData,
                credentials : "include"
            });

            const result = await response.json();
            
            if(response.ok){
                console.log(result);
                setTimeout(() => navigate("/settings") , 2000);
            }else {
                console.log(result.error);
                setError(result.error);
            }

        }catch(err){
            console.error("Upload failed:", err);
        }

    };

    return (
        <div className="card p-3 mb-4 shadow">
          <h2>Upload Profile Picture</h2>
          <input type="file" accept="image/*" className="form-control mb-2" onChange={handleFileChange} />
          <button className="btn btn-primary" onClick={handleUpload}>
            Upload
          </button>
          {error && <p className="text-danger mt-2">{error}</p>}
        </div>
      );
};

export default UploadProfilePicture;