import { useState , useContext , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../components/ApiClient";
import { Context as UserContext } from "../../context/UserContext";
import defaultUserImage from "../../assets/defaultUserImage.jpeg";
import { useProfileImage } from "../../hooks/useProfileImage";
import useAuthSync from "../../hooks/useAuthSync";

const UserCard = ({user}) => {

    const navigate = useNavigate();

    const {state,setUser,logout} = useContext(UserContext);
    const [isAuthenticated,setIsAuthenticated] = useState(false);

    useAuthSync({user : state.user, setUser, setIsAuthenticated});

    const sendFriendRequest = async () => {

        try{
    
            const data = await authFetch(`http://localhost:8080/api/friends/request?senderId=${state.user.id}&receiverId=${user.id}`,{
                method : 'POST',
                headers : {
                    "Content-Type" : "application/json"
                },
            },true);
    
            if(data.invalidToken){
                logout();
                navigate("/login?message=session-expired");
                return;
            }

            console.log(data);
    
        }catch(error){
            console.log(error.message || "something went wrong");
        }
    
    };

    const imageUrl = useProfileImage({user : user});

    return(
        <div key={user.id} className="user-card">
            <div className="card shadow-sm" style={{ maxWidth: '300px', borderRadius: '10px' }}>
                <div className="card-body d-flex align-items-center p-2">

                    <img
                        src={
                            user.profilePictureVisible
                            ? user.local_picture
                                ? imageUrl
                                : user.picture
                                ? user.picture
                                : defaultUserImage
                            : defaultUserImage
                        }
                        alt="Profile"
                        className="rounded-circle border"
                        style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                        }}
                    />

                    {/* Username and Button Row */}
                    <div className="ms-3 d-flex justify-content-between align-items-center flex-grow-1">
                        <h2 className="h6 mb-0">{user.username}</h2>

                        <button
                            className="btn btn-sm"
                            style={{
                                backgroundColor: "#4A90E2",
                                color: "white",
                                border: "none",
                                borderRadius: "20px",
                                padding: "5px 12px",
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px"
                            }}
                            onClick={() => sendFriendRequest()}
                            title="Send Friend Request"
                        >
                            <i className="fas fa-user-plus"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FriendsPage = () => {

    const navigate = useNavigate();

    const [query,setQuery] = useState("");
    const [results,setResults] = useState([]);

    const {state,logout} = useContext(UserContext);
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    // getting friends when we first open the site and put them in localStorage could be choosen based on the performance and space trade of !!  
    const [friends,setFriends] = useState([])

    useEffect(() => {
        getFriends();
    }, [isAuthenticated,state.user]);

    useEffect(() => {
        getFriends();
    },[]);

    const getFriends = async () => {
        
        const data = await authFetch(`http://localhost:8080/api/friends/friends-list?userId=${state.user.id}`,{
            method : 'GET',
        },true);

        console.log("get the friends" , data)

    };


    const handleChange = async (e) => {
        e.preventDefault();

        const value = e.target.value;

        setQuery(value);

        if(value.trim() === ''){
            setResults([]);
            return;
        }

        try{    

            const data = await authFetch(`http://localhost:8080/api/users/search?name=${value}`,{
                method : 'GET',
                headers : {
                    "Content-Type" : "application/json"
                },
            },true);

            if(data.invalidToken){
                logout();
                navigate("/login?message=session-expired");
                return;
            }

            setResults(data);
            
        }catch(error){
            console.log(error);
        }

    };

    const [messageForGemini,setMessageForGemini] = useState("");
    const [geminiResponse,setGeminiResponse] = useState("");
    const [loading,setLoading] = useState(false);

    const handleGeminiSubmit = async (e) => {
        e.preventDefault();

        if (!messageForGemini.trim()) return;

        setLoading(true);
        setGeminiResponse("");

        try{
            const data = await authFetch('http://localhost:8080/api/ai/ask',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({message : messageForGemini}),
            },true);

            if(data.invalidToken){
                logout();
                navigate("/login?message=session-expired");
                return;
            }
    
            setGeminiResponse(data.response);
        }catch(error){
            console.log("Error while talking to Gemini");
            setGeminiResponse("Something went wrong!");                
        }finally{
            setLoading(false);
        }

    };

    return (
        <div className="d-flex" style={{ height: '100vh' }}>
            <div
                className="border-end p-3"
                style={{
                width: '320px',
                minWidth: '320px',
                backgroundColor: '#f8f9fa',
                overflowY: 'auto'
                }}
            >
                {/* Friend Search Section */}
                <div className="mb-2">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Search Friend"
                    value={query}
                    onChange={handleChange}
                />

                <ul className="list-group">
                    {results?.map(user => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </ul>

                </div>

                {/* Gemini Message Input */}
                <form onSubmit={handleGeminiSubmit} className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Send Message To Gemini"
                    value={messageForGemini}
                    onChange={(e) => setMessageForGemini(e.target.value)}
                />
                </form>

                {/* Gemini Response Block */}
                {loading ? (
                    <div className="alert alert-warning">Please wait, Gemini is thinking...</div>
                    ) : geminiResponse && (
                    <div className="alert alert-info" style={{ whiteSpace: 'pre-wrap' }}>
                        {geminiResponse}
                    </div>
                )}
            </div>
        </div>
      );
};

export default FriendsPage;