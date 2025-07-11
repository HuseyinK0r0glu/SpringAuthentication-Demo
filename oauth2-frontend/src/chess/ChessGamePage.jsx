import React from "react";
import { useNavigate } from "react-router-dom";
import chessImage from "../assets/chessImage.png";

const cardStyle = {
    background: "#fff",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
    borderRadius: "24px",
    border: "1px solid #f0f0f0",
    padding: "2.5rem 2rem",
    maxWidth: "480px",
    width: "100%",
    color: "#222"
};

const ChessGamePage = () => {
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={cardStyle} className="mx-auto text-center animate__animated animate__fadeIn">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <img
                        src={chessImage}
                        alt="Chess"
                        style={{
                            width: "140px",
                            height: "140px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
                            marginBottom: "1.5rem",
                            border: "4px solid #fff",
                            animation: "chessPulse 2.5s infinite alternate"
                        }}
                    />
                    <h1 style={{ fontWeight: 700, letterSpacing: 1, marginBottom: "0.5rem", color: "#222" }}>Welcome to <span style={{ color: "#FFD700" }}>HK Chess</span>!</h1>
                    <p style={{ color: "#555", marginBottom: "2.5rem" }}>Select a game mode to begin your chess journey.</p>
                </div>
                <div className="row g-4">
                    <div className="col-12 col-md-6">
                        <div
                            className="card h-100 shadow-sm border-0"
                            style={{
                                background: "#f8f9fa",
                                borderRadius: "18px",
                                cursor: "pointer",
                                transition: "transform 0.2s",
                                color: "#222"
                            }}
                            onClick={() => navigate("/play-chess-with-friends")}
                        >
                            <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                <i className="fas fa-users fa-2x mb-3" style={{ color: "#4A90E2" }}></i>
                                <h5 className="card-title mb-2">Play with Friends</h5>
                                <p className="card-text" style={{ fontSize: "0.97rem", color: "#555" }}>Challenge your friends online and see who is the chess master!</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div
                            className="card h-100 shadow-sm border-0"
                            style={{
                                background: "#f8f9fa",
                                borderRadius: "18px",
                                cursor: "pointer",
                                transition: "transform 0.2s",
                                color: "#222"
                            }}
                            onClick={() => navigate("/play-chess-with-computer")}
                        >
                            <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                <i className="fas fa-chess fa-2x mb-3" style={{ color: "#FFD700" }}></i>
                                <h5 className="card-title mb-2">Play vs Computer / Two People</h5>
                                <p className="card-text" style={{ fontSize: "0.97rem", color: "#555" }}>Play against the computer or share the board for a local match.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <style>{`
                    @keyframes chessPulse {
                        0% { box-shadow: 0 0 0 0 rgba(255,215,0,0.12); }
                        100% { box-shadow: 0 0 24px 8px rgba(255,215,0,0.10); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default ChessGamePage;