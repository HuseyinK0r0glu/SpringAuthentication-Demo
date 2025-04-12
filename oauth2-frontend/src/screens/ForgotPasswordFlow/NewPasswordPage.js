import React, { useState } from "react";
import { useNavigate , useLocation } from "react-router-dom";
import PasswordValidation from "../../components/PasswordValidation";
import { authFetch } from "../../components/ApiClient";

const NewPasswordPage = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [error,setError] = useState("");
    const [message,setMessage] = useState("");

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    // for the password
    const [isValid,setIsValid] = useState(false);

    const [passwordRules,setPasswordRules] = useState({
      minLength : false,
      uppercase : false,
      lowercase : false,
      number : false,
      specialChar : false,
      noWhiteSpace : false,
    });

    const handlePasswordChange = (event) => {
      setError("");
      const newPassword = event.target.value;
      setPassword(newPassword);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if(!isValid){
            setError("password is not valid");
            return;
          }
  
          if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
          }

        try{

            const data = await authFetch(`http://localhost:8080/api/auth/reset-password?token=${token}`,{
                method : 'POST',
                headers : {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify({password}),
            },false);

            setMessage("Your password has been successfully reset. You can now log in with your new password.");

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        }catch(err){
            setError(err.message || "Failed to reset password. Please try again.");
        }

    };

    return(
        <div className="container text-center mt-5">
            <h1 className="mb-4">Reset Your Password</h1>
            <div className="d-flex flex-column align-items-center justify-content-center">
                <form onSubmit={handleSubmit} className="w-50 mb-4">
                <div className="form-group">
                    <label htmlFor="password" className="form-label">New Password</label>
                    <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Enter new password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    />
                </div>

                <PasswordValidation password={password} setIsValid={setIsValid} setPasswordRules={setPasswordRules}/>

                {error && <p className="text-danger mt-2">{error}</p>}
                {message && <p className="text-success mt-2">{message}</p>}

                <button type="submit" className="btn btn-primary btn-lg mt-1 w-100">
                    Reset Password
                </button>
                </form>

                <div>
                <button className="btn btn-link" onClick={() => navigate("/login")}>
                    Back to Login
                </button>
                </div>
            </div>
            </div>
        );
};

export default NewPasswordPage;