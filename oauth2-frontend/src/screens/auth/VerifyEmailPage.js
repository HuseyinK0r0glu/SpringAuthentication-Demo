import React, { useEffect, useState } from "react";
import { useNavigate , useLocation } from "react-router-dom";

const VerifyEmailPage = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const [message , setMessage] = useState('');
    const [status , setStatus] = useState('');

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    useEffect(() => {

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

    return(
    <div className="container text-center mt-5">
        <h1 className="mb-4">Verify Your Email</h1>
        <p>Please check your email to verify your account.</p>
        {status === "failed" && (
            <p className="text-danger">{message}</p>
        )}
        {status === "success" && (
            <p className="text-success">{message}</p>
        )}
        {status === "error" && <p className="text-danger">{message}</p>}
    </div>
    );
}

export default VerifyEmailPage;