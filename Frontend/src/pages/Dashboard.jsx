// import { useEffect, useState } from "react";

// function Dashboard() {

//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/users")
//       .then(res => res.json())
//       .then(data => {
//         setUsers(data.users);
//       });
//   }, []);

//   return (
//     <div>
//       <h1>Users</h1>
//       {users.map((u, i) => (
//         <p key={i}>{u}</p>
//       ))}
//     </div>
//   );
// }

// export default Dashboard;
import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  // --- STYLES ---
  const containerStyle = {
    display: "flex",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#f4f7fe",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    margin: 0,
    overflow: "hidden"
  };

  const sidebarStyle = {
    width: "260px",
    background: "linear-gradient(180deg, #4f46e5 0%, #764ba2 100%)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "30px 20px",
    boxShadow: "4px 0 10px rgba(0,0,0,0.1)"
  };

  const mainAreaStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto"
  };

  const topNavStyle = {
    height: "70px",
    background: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
  };

  const cardStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    border: "1px solid #eef2f6"
  };

  const sidebarItem = {
    padding: "12px 15px",
    margin: "5px 0",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
    fontSize: "16px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center"
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={containerStyle}>
      {/* SIDEBAR */}
      <aside style={sidebarStyle}>
        <h2 style={{ marginBottom: "40px", textAlign: "center", letterSpacing: "1px" }}>NutriAI</h2>
        
        <div style={{ ...sidebarItem, backgroundColor: "rgba(255,255,255,0.2)" }}> Dashboard</div>
        <div style={sidebarItem} onClick={() => navigate("/lab-reports")}> Lab Reports</div>
        <div style={sidebarItem} onClick={() => navigate("/profile")}>👤 Profile</div>
        <div style={sidebarItem}>⚙️ Settings</div>
        
        <div style={{ marginTop: "auto", ...sidebarItem, color: "#ffbaba" }} onClick={handleLogout}>
          Logout
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div style={mainAreaStyle}>
        <header style={topNavStyle}>
          <span style={{ color: "#4f46e5", fontWeight: "600", fontSize: "18px" }}>Dashboard Overview</span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#777" }}>Welcome, User! </span>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#4f46e5" }}></div>
          </div>
        </header>

        <div style={{ padding: "40px" }}>
          <h1 style={{ color: "#2d3748", marginBottom: "30px" }}>Health Insights</h1>
          
          {/* STAT CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px" }}>
            <div style={cardStyle}>
              <p style={{ color: "#888", margin: 0 }}>Overall Wellness</p>
              <h2 style={{ fontSize: "32px", margin: "10px 0", color: "#4f46e5" }}>85%</h2>
              <div style={{ height: "8px", background: "#eee", borderRadius: "4px" }}>
                <div style={{ width: "85%", height: "100%", background: "#4f46e5", borderRadius: "4px" }}></div>
              </div>
            </div>

            <div style={cardStyle}>
              <p style={{ color: "#888", margin: 0 }}>Pending Analysis</p>
              <h2 style={{ fontSize: "32px", margin: "10px 0", color: "#764ba2" }}>2 Reports</h2>
              <button style={{ color: "#764ba2", background: "none", border: "none", padding: 0, cursor: "pointer", fontWeight: "600" }}>View Details →</button>
            </div>

            <div style={cardStyle}>
              <p style={{ color: "#888", margin: 0 }}>Next Checkup</p>
              <h2 style={{ fontSize: "32px", margin: "10px 0", color: "#22c55e" }}>Mar 15</h2>
              <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>Routine blood work</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;