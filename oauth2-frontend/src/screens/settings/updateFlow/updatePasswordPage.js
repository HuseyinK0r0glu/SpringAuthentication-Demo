import { useState,useContext, useEffect } from "react";
import { Context as UserContext } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import PasswordValidation from "../../../components/PasswordValidation";
import { authFetch } from "../../../components/ApiClient";

const UpdatePasswordPage = () => {

    const {logout} = useContext(UserContext);
    const navigate = useNavigate();

    const[password,setPassword] = useState("");
    const[confirmPassword,setConfirmPassword] = useState("");
    const[message,setMessage] = useState("");  
    const[status,setStatus] = useState("");
    const[error,setError] = useState("");

    const {state} = useContext(UserContext);

    // for the password
    const [isValid,setIsValid] = useState(false);

    const [passwordRules,setPasswordRules] = useState({
      minLength : false,
      uppercase : false,
      lowercase : false,
      number : false,
      specialChar : false,
      noWhiteSpace : false
    });

    const handlePasswordChange = (event) => {
      setError("");
      const newPassword = event.target.value;
      setPassword(newPassword);
    };

    const updatePassword = async () => {

        if(!isValid){
            setMessage("");
            setError("password is not valid");
            return;
        }
  
        if (password !== confirmPassword) {
            setMessage("");
            setError("Passwords do not match!");
            return;
        }

        try{

            const data = await authFetch(`http://localhost:8080/api/users/update-password`,{
                method : 'PUT',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    password,
                    confirmPassword
                })
            },true);

            if(data.invalidToken){
                logout();
                navigate("/login?message=session-expired");
                return;
              }

            setStatus("success");
            setError("");
            setMessage("Password updated successfully!");
            setTimeout(() => navigate("/home") , 1000);

        }catch(err){
            setStatus("failed");
            setError("");
            setMessage(err.message || "Something went wrong!");
        }
    }

    return(
        <div className="container mt-5">

            <div className="card p-4 shadow-sm" style={{ maxWidth: "600px", margin: "auto" }}>
                <h3 className="text-center mb-4">Change Password</h3>

                {state.user?.provider ? (
                    <div className="alert alert-info text-center">
                        You logged in via <strong>{state.user.provider}</strong>, so you cannot change your password.
                    </div>
                ) : (
                    <div>
                        <div className="form-group mb-3">
                        <label htmlFor="password" className="form-label">New Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="New Password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        </div>

                        <div className="form-group mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        </div>

                        <PasswordValidation password={password} setIsValid={setIsValid} setPasswordRules={setPasswordRules}/>

                        {error && <p className="text-danger mt-2">{error}</p>}

                        <button
                        onClick={updatePassword}
                        className="btn btn-primary btn-lg w-100 mt-1"
                        disabled={!isValid}
                        >
                        Update Password
                        </button>

                        {status === "failed" && (
                        <p className="text-danger mt-2">{message}</p>
                        )}
                        {status === "success" && (
                        <p className="text-success mt-2">{message}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UpdatePasswordPage;