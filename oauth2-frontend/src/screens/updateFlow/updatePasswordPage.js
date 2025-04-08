import { useState,useContext } from "react";
import { Context as UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import PasswordValidation from "../../components/PasswordValidation";

const UpdatePasswordPage = () => {

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
    });

    const handlePasswordChange = (event) => {
      setError("");
      const newPassword = event.target.value;
      setPassword(newPassword);
    };

    const updatePassword = async () => {

        if(!isValid){
            setError("password is not valid");
            return;
          }
  
          if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
          }

        const userId = state.user.id;

        try{
            const response = await fetch(`http://localhost:8080/api/users/${userId}/update-password`,{
                method : 'PUT',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    password,
                    confirmPassword
                })
            })

            if(response.ok){
                setStatus("success");
                setMessage("Password updated successfully!");
                setTimeout(() => navigate("/home") , 1000);
            }else {
                setStatus("failed");
                const data = await response.json();
                setMessage(data.error);
            }

        }catch{
            setMessage("Something went wrong!");
        }

    }

    return(
        <div className="container mt-5">
            <h2 className="text-center mb-4">Change Password</h2>

            <div className="card p-4 shadow-sm" style={{ maxWidth: "600px", margin: "auto" }}>
                <h3 className="text-center mb-4">Change Password</h3>

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
        </div>
    );
}

export default UpdatePasswordPage;