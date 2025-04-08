import { useState,useContext } from "react";
import { Context as UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

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

    // regex expression for password validation
    const validations = {
      minLength : /.{8,30}/,
      uppercase : /[A-Z]/,
      lowercase : /[a-z]/,
      number : /[0-9]/,
      specialChar : /[!@#$%^&*(),.?":{}|<>]/,
    };

    const checkPasswordStrength = (newPassword) => {

      const newRules = {...passwordRules};

      newRules.minLength = validations.minLength.test(newPassword);
      newRules.uppercase = validations.uppercase.test(newPassword);
      newRules.lowercase = validations.lowercase.test(newPassword);
      newRules.number = validations.number.test(newPassword);
      newRules.specialChar = validations.specialChar.test(newPassword);

      setPasswordRules(newRules);

      const isPasswordValid = Object.values(newRules).every((
        rule => rule === true
      ));
      setIsValid(isPasswordValid);

    };

    const handlePasswordChange = (event) => {
      setError("");
      const newPassword = event.target.value;
      setPassword(newPassword);
      checkPasswordStrength(newPassword);
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

                <ul className="mt-2 text-left">
                    {!passwordRules.minLength && (
                    <li style={{ color: 'red' }}>
                        Password must be between 8 and 30 characters
                    </li>
                    )}
                    {!passwordRules.uppercase && (
                    <li style={{ color: 'red' }}>
                        Must contain at least one uppercase letter
                    </li>
                    )}
                    {!passwordRules.lowercase && (
                    <li style={{ color: 'red' }}>
                        Must contain at least one lowercase letter
                    </li>
                    )}
                    {!passwordRules.number && (
                    <li style={{ color: 'red' }}>
                        Must contain at least one number
                    </li>
                    )}
                    {!passwordRules.specialChar && (
                    <li style={{ color: 'red' }}>
                        Must contain at least one special character
                    </li>
                    )}
                </ul>

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