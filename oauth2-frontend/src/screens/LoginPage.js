import React, { use, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context as UserContext } from "../context/UserContext";
import { authFetch } from "../components/ApiClient";

function LoginPage() {

  const {setUser} = useContext(UserContext);
  const navigate = useNavigate();

  // for traditional login form 
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState(null);

  // oauth2 login
  const handleLogin = (provider) => {   
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  const handleTraditionalLogin = async (e) => {
    e.preventDefault();

    try{

      const data = await authFetch('http://localhost:8080/api/auth/login',{
        method : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        }),
        credentials: 'include'
      },false);

      console.log(data);
      const { token, ...userInfo } = data;
      setUser(userInfo);
      setError("");

      // add local storage to store the user  
      localStorage.setItem("user", JSON.stringify(userInfo));

      // save the jwt to local storage
      localStorage.setItem("token",token);

      navigate("/home");
      
    }catch(error){
      console.log(error.message);
      setError('Invalid username or password');
    }

  };

return (
  <div className="container text-center mt-5">
    <h1 className="mb-4">Login</h1>

    <div className="d-flex flex-column align-items-center justify-content-center">
      {/* Traditional Login Form */}
      <form onSubmit={handleTraditionalLogin} className="w-50 mb-4">
        <div className="form-group text-start">
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

        <div className="form-group text-start mt-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="text-end mt-1">
            <button 
              type="button" 
              className="btn btn-link p-0"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg mt-4 w-100">
          Login with Email
        </button>
      </form>

      {error && <p className="text-danger mt-2">{error}</p>}

      {/* OAuth2 Login Buttons */}
      <div className="d-flex flex-column align-items-center w-50">
        <button 
          className="btn btn-danger btn-lg mb-3 w-100" 
          onClick={() => handleLogin("google")}
        >
          <i className="fab fa-google me-2"></i> Login with Google
        </button>
        <button 
          className="btn btn-dark btn-lg w-100" 
          onClick={() => handleLogin("github")}
        >
          <i className="fab fa-github me-2"></i> Login with GitHub
        </button>
      </div>

      {/* Sign Up Option */}
      <div className="mt-4">
        <p>
          Don't have an account?{" "}
          <button 
            className="btn btn-link p-0" 
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  </div>
);

}

export default LoginPage;
