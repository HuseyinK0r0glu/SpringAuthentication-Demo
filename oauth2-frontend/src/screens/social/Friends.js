import React, { useState , useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../components/ApiClient";
import { Context as UserContext } from "../../context/UserContext";
import defaultUserImage from "../../assets/defaultUserImage.jpeg";
import { useProfileImage } from "../../hooks/useProfileImage";
import { Link } from "react-router-dom";

const UserCard = ({user}) => {

    const navigate = useNavigate();

    const imageUrl = useProfileImage({user : user});

    return(
        <div key={user.id} className="user-card">
            <div className="card shadow-sm" style={{ maxWidth: '300px', borderRadius: '10px' }}>
                <div className="card-body d-flex align-items-center p-2">

                    {/* Profile Picture */}
                    {user.local_picture ? (
                        <img
                            src={imageUrl}
                            alt="Profile"
                            className="rounded-circle border"
                            style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                            }}
                        />
                    ) : user.picture ? (
                        <img
                            src={user.picture}
                            alt="Profile"
                            className="rounded-circle border"
                            style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <img
                            src={defaultUserImage}
                            alt="Profile"
                            className="rounded-circle border"
                            style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                            }}
                        />
                    )}

                    {/* User Info (Username) */}
                    <div className="ms-3">
                        <h2 className="h6 mb-1">{user.username}</h2>
                    </div>

                </div>
            </div>
        </div>
    );
};

const FriendsPage = () => {

    const navigate = useNavigate();

    const {logout} = useContext(UserContext);

    const [query,setQuery] = useState("");
    const [results,setResults] = useState([]);

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


    return (
        <div className="d-flex">
            <div className="container mt-3" style={{ maxWidth: '300px'}}>
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search Friend"
                    value={query}
                    onChange={handleChange}
                />
                
                {query ? (
                    <ul className="list-group">
                        {results?.map(user => (
                            <Link
                                to = "" // fill this part 
                                key={user.id}
                                className="text-decoration-none"
                            >
                                <UserCard key={user.id} user={user} />
                            </Link>
                        ))}
                    </ul>
                ) : (
                    <div className="text-muted">Add friends here</div>
                )}
            </div>

            <div className="flex-grow-1 p-3">
                {/* You can put more stuff here later */}
            </div>

        </div>
      );
};

export default FriendsPage;