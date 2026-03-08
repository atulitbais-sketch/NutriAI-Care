import React from "react";

function Layout({ children }) {
  return (
    <div>
      <header style={{padding: "10px", background: "#0f172a", color: "white"}}>
        <h2>NutriAI Care</h2>
      </header>

      <main style={{padding: "20px"}}>
        {children}
      </main>
    </div>
  );
}

export default Layout;