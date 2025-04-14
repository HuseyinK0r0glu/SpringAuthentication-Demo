import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context as UserContext } from "../../context/UserContext";
import { authFetch } from "../../components/ApiClient";

function LoginPage() {

  const message = new URLSearchParams(window.location.search).get("message");

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
      setError(error.message || 'Invalid username or password');
    }

  };

return (
  <div className="container d-flex justify-content-center align-items-center mt-5">
    <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '500px' }}>
      <h2 className="text-center mb-4">Login</h2>

      {message === "session-expired" && (
        <div className="alert alert-warning text-center" role="alert">
          <strong>Your session has timed out:</strong> Please log in again to continue.
        </div>
      )}

      {/* Traditional Login Form */}
      <form onSubmit={handleTraditionalLogin}>
        <div className="mb-3">
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

        <div className="mb-3">
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

        {error && <p className="text-danger mt-2">{error}</p>}

        <button type="submit" className="btn btn-primary w-100 mt-3">
          Login with Email
        </button>
      </form>

      <div className="text-center my-3">
        <span>or</span>
      </div>

      {/* OAuth2 Login Buttons */}
      <div className="d-flex justify-content-center gap-3">
        <button 
          className="btn btn-outline-danger rounded-circle p-3" 
          onClick={() => handleLogin("google")} 
          title="Login with Google"
        >
          <i className="fab fa-google fa-lg"></i>
        </button>

        <button 
          className="btn btn-outline-dark rounded-circle p-3" 
          onClick={() => handleLogin("github")} 
          title="Login with GitHub"
        >
          <i className="fab fa-github fa-lg"></i>
        </button>
      </div>

      {/* Sign Up Option */}
      <div className="text-center mt-4">
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
