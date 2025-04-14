import { useEffect , useContext } from "react";
import { Context as UserContext} from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../components/ApiClient";

const LoadingPage = () => {

    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);

    const handleResponse = (data) => {
        if(data && data.id){
          const { token, ...userInfo } = data;
          setUser(userInfo);
          localStorage.setItem("user" , JSON.stringify(userInfo));
          localStorage.setItem("token", token);
          navigate("/home");
        }
      };

    useEffect(() => {

        const getUserData = async () => {
    
          try{

            const data = await authFetch("http://localhost:8080/api/auth/oauth2/login",{
              method : "GET",
              credentials : "include"
            },false);
    
            handleResponse(data);
                
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