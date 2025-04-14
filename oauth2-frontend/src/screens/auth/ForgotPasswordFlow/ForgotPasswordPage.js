import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../../components/ApiClient";

const ForgotPasswordPage = () => {

    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [message,setMessage] = useState("");
    const [cooldown,setCoolDown] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{

            const data = await authFetch("http://localhost:8080/api/auth/forgot-password",{
              method : 'POST',
              headers : {
                  "Content-Type" : "application/json",
              },
              body : JSON.stringify({email}),
            });

            setMessage("Reset mail has been sent. Please check your inbox.");
            setEmail("");
            const time = 60;
            localStorage.setItem("forgotPasswordCooldown" , (Date.now() + time * 1000).toString());
            setCoolDown(time);

        }catch(error){
            setMessage(error.message || "Failed to send reset email.");
        }
    };

    useEffect(() => {
        const storedExpiry = localStorage.getItem("forgotPasswordCooldown");
        if(storedExpiry){
            const now = Date.now();
            const remaining = Math.floor((parseInt(storedExpiry) - now) / 1000);
            if(remaining > 0){
                setCoolDown(remaining);
                setMessage(`Reset email has been sent. You can request another one in ${remaining} seconds.`);
            }else{
                localStorage.removeItem("forgotPasswordCooldown");
            }
        }
    },[]);

    useEffect(() => {
        if(cooldown > 0){
            const timer = setTimeout(() => setCoolDown(cooldown-1),1000);
            return () => clearTimeout(timer);
        }else {
            localStorage.removeItem("forgotPasswordCooldown");
            setMessage("");
        }
    } , [cooldown]);

    return (
        <div className="container text-center mt-5">
          <h1 className="mb-4">Forgot Password</h1>
          <div className="d-flex flex-column align-items-center justify-content-center">
            <form onSubmit={handleSubmit} className="w-50 mb-4">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Enter your email address</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={cooldown > 0}
                />
              </div>
    
              <button 
                type="submit" 
                className="btn btn-primary btn-lg mt-3 w-100"
                disabled={cooldown > 0}
              >
                {cooldown > 0 ? `Wait ${cooldown}s` : "Send Reset Link"}
              </button>
            </form>
    
            {message && <p className="mt-2 text-info">{message}</p>}
    
            <div className="mt-3">
              <button className="btn btn-link" onClick={() => navigate("/login")}>
                Back to Login
              </button>
            </div>
          </div>
        </div>
      );
};

export default ForgotPasswordPage;