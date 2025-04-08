import React , {useState} from "react";
import { useNavigate } from "react-router-dom";
import PasswordValidation from "../components/PasswordValidation";

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

    const handlePasswordChange = (event) => {
      setError("");
      const newPassword = event.target.value;
      setPassword(newPassword);
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
      
          <PasswordValidation password = {password} setIsValid = {setIsValid} setPasswordRules = {setPasswordRules} />

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

