import { specialChars } from "@testing-library/user-event";
import React , {use, useState} from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
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

    const handleSignUp = async (e) => {
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

            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  username,
                  email,
                  password,
                  confirmPassword
                }),
              });

            const data = await response.json();

            if(response.ok){
                alert(data.message || "Verification link is send! Please check your email!");
                navigate("/verify");
            }else{
                setError(data.error || "Sign up failed. Please try again.")
            }

        }catch(error){
            setError('Error occurred during sign up');
        }
    };

    return (
      <div className="container text-center mt-5">
        <h1 className="mb-4">Sign Up</h1>
  
        <form onSubmit={handleSignUp} className="w-50 mb-4 mx-auto">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
  
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
  
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
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
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
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
            type="submit"
            className="btn btn-primary btn-lg mt-3 w-100"
            disabled={!isValid}
          >
            Sign Up
          </button>
        </form>
      </div>
    );
}

export default SignUpPage;

