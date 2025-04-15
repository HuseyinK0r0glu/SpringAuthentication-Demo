import React, { useEffect, useState } from "react";
import { useNavigate , useLocation } from "react-router-dom";
import { authFetch } from "../../components/ApiClient";

const VerifyEmailPage = () => {

    const[cooldown,setCooldown] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();

    const [message , setMessage] = useState('');
    const [status , setStatus] = useState('');

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const handleResendEmail = async () => {
        const signupRequest = JSON.parse(localStorage.getItem("signupRequest"));
        const email = signupRequest?.email;

        if (!email) {
            setStatus("error");
            setMessage("Email not found. Please sign up again.");
            return;
          }

        try{
            const data = await authFetch('http://localhost:8080/api/auth/resend-verification',{
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({email : email})
            },false);

            console.log(data.message);
            setCooldown(60);
            const expiresAt = new Date().getTime() + 60 * 1000;
            localStorage.setItem("cooldownEnd", expiresAt);

        }catch(error){
            console.log(error);
            setStatus('error');
            setMessage('Error occurred while verifying your email.');
        }

    };

    useEffect(() => {

        const cooldownEnd = localStorage.getItem("cooldownEnd");
        if(cooldownEnd){
            const now = new Date().getTime();
            const remaining = Math.floor((parseInt(cooldownEnd) - now) / 1000);
            if (remaining > 0) {
                setCooldown(remaining);
            } else {
                localStorage.removeItem("cooldownEnd");
                setCooldown(0);
            }
        }


        if(token){
            const verifyToken = async () => {
                try{
                    const response = await fetch(`http://localhost:8080/api/auth/verify?token=${token}`,{
                        method : 'POST'
                    });
                    const result = response.text();

                    if(response.ok){
                        setStatus('success');
                        setMessage('Your email has been verified! You can now log in. You will be directed to login page.');
                        localStorage.removeItem("signupRequest");
                        localStorage.removeItem("cooldownEnd");
                        setTimeout(() => navigate("/login") , 2000);
                    }else {
                        setStatus("failed");
                        setMessage(result.message || 'Failed to verify email. Please try again.');
                    }

                }catch(error){
                    setStatus('error');
                    setMessage('Error occurred while verifying your email.');
                }
            
            }

            verifyToken();

        }

    },[location,token]);

    useEffect(() => {
        if(cooldown > 0){
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }else {
            localStorage.removeItem("cooldownEnd");
        }
    },[cooldown]);

    return(
    <div className="container text-center mt-5">
        <h1 className="mb-4">Verify Your Email</h1>
        <p>Please check your email to verify your account.</p>

        {!token && status !== "success" ? (
            <div>
                {cooldown > 0 ? (
                    <p>If you don't receive any email you can reqeust now one in {cooldown} seconds.</p>
                ) : (
                    <p>If you don't receive any email you can reqeust new one.</p>
                )}
                <button 
                    type="button"
                    onClick={handleResendEmail} 
                    className="btn btn-primary btn-lg mt-3 w-100"
                    disabled={cooldown > 0}
                    >
                    {cooldown > 0 ? `Wait ${cooldown}s` : "Send Reset Link"}
                </button>
            </div>
        ) : (
            <div>
                {status === "failed" && (
                    <p className="text-danger">{message}</p>
                )}
                {status === "success" && (
                    <p className="text-success">{message}</p>
                )}
            </div>
        )}

        {status === "error" && <p className="text-danger mt-2">{message}</p>}

    </div>
    );
}

export default VerifyEmailPage;