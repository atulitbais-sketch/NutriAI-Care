import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <h1 className="title"> Medi-Flow AI Dashboard</h1>

      <div className="card-grid">
        <div className="card">
          <h2>Patient Info</h2>
          <p><b>Name:</b> John Doe</p>
          <p><b>Age:</b> 35</p>
          <p><b>Gender:</b> Male</p>
        </div>

        <div className="card">
          <h2>Lab Results</h2>
          <p>Hemoglobin: <span className="low">10.5 g/dL</span></p>
          <p>Blood Sugar: <span className="high">160 mg/dL</span></p>
          <p>Cholesterol: <span className="high">220 mg/dL</span></p>
        </div>

        <div className="card">
          <h2>AI Interpretation</h2>
          <p className="warning"> Possible Anemia</p>
          <p className="warning"> Diabetes Risk</p>
        </div>

        <div className="card">
          <h2>Diet Recommendation</h2>
          <ul>
            <li> Iron-rich foods</li>
            <li> Reduce sugar</li>
            <li> Nuts & whole grains</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;