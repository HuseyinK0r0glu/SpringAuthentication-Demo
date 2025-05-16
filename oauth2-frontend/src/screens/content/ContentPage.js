import React , {useState,useContext,useEffect} from "react";
import { Context as UserContext } from "../../context/UserContext";
import useAuthSync from "../../hooks/useAuthSync";
import { authFetch } from "../../components/ApiClient";
import { useNavigate } from "react-router-dom";

const ContentPage = () => {

    const[isAuthenticated , setIsAuthenticated] = useState(false);

    const {state , setUser , logout} = useContext(UserContext);
  
    const navigate = useNavigate();

    useAuthSync({user : state.user , setUser , setIsAuthenticated});

    useEffect(() => {
        const checkIfBanned = async () => {
            try{
                const data = await authFetch("http://localhost:8080/api/users/me",{
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                },true);

                if(data.invalidToken){
                    logout();
                    localStorage.clear();
                    navigate("/login?message=session-expired");
                    return;  
                }

                const mergedUser = {...state.user , ...data};

                setUser(mergedUser);
                localStorage.setItem("user",JSON.stringify(mergedUser));

                console.log(data);

            }catch(error){
                
            }
        };
        checkIfBanned();
    },[]);

    return(
        <div className="container py-4">
            <h1 className="mb-4">Content Page</h1>

            {state.user?.is_banned ? (
                <div className="alert alert-danger d-flex align-items-center gap-3" role="alert">
                    <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "1.5rem" }}></i>
                    <div>
                        <strong>Your account has been banned.</strong><br />
                        Please contact the admin for further details.
                    </div>
                </div>
            ) : (
                <div className="alert alert-success" role="alert">
                    Welcome! You are allowed to create and view content.
                </div>
            )}

        </div>
    );
};

export default ContentPage;