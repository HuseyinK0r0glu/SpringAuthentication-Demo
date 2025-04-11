import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../components/ApiClient";

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
        
        const formData = new FormData();
        formData.append("image", file);

        try{

            const data = await authFetch("http://localhost:8080/api/users/upload-profile-picture",{
                method : 'POST',
                body : formData,
                credentials : "include"
            },true);

            if(data.invalidToken){
                navigate("/login?message=session-expired");
                return;
              }

            setError("");
            console.log(data);
            setTimeout(() => navigate("/settings") , 2000);

        }catch(err){
            console.error(err.message || "Upload failed:", err);
            setError(error.message || "Something went wrong!");
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