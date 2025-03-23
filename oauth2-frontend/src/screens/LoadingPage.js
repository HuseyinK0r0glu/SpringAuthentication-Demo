import { useEffect , useContext } from "react";
import { Context as UserContext} from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const LoadingPage = () => {

    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);

    const handleResponse = (data) => {
        if(data && data.id){
          setUser(data);
          localStorage.setItem("user" , JSON.stringify(data));
          navigate("/home");
        }
      };

    useEffect(() => {

        const getUserData = async () => {
    
          try{
    
            const response = await fetch("http://localhost:8080/api/auth/oauth2/login" , {
              method : "GET",
              credentials : "include"
            });
    
            if(response.ok){
              const data = await response.json();
              handleResponse(data);
            }else {
              console.log("Failed to fetch user data");
              navigate("/login");
            }
    
          }catch(error){
            console.error("Error fetching user data:", error);
            navigate("/login");
          }
    
        }
    
        getUserData();
    
      },[]);
    

    return (
        <h2>Loading ...</h2>
    );
};

export default LoadingPage;