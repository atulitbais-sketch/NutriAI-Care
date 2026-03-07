import { useEffect, useState } from "react";
import { 
  Activity, 
  Droplet, 
  Heart, 
  AlertTriangle, 
  Apple, 
  UtensilsCrossed 
} from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const [patient, setPatient] = useState({});
  const [labs, setLabs] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const userId = 1; // later take from login token

  useEffect(() => {
   fetch(`http://127.0.0.1:8000/api/labs/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const report = data[0];

          setPatient({
            age: report.age,
            gender: report.gender,
            name: "User " + report.user_id
          });

          setLabs([
            { label: "Hemoglobin", value: report.hemoglobin + " g/dL", status: report.hemoglobin < 12 ? "low" : "normal", icon: Droplet },
            { label: "Vitamin D", value: report.vitamin_d + " ng/mL", status: report.vitamin_d < 20 ? "low" : "normal", icon: Activity },
            { label: "Fasting Sugar", value: report.fasting_sugar + " mg/dL", status: report.fasting_sugar > 140 ? "high" : "normal", icon: Heart },
          ]);

          setWarnings([report.ai_explanation]);
        }
      })
      .catch(err => console.error("API error:", err));
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">NutriAI-Care Dashboard</h1>
        <p className="dashboard-subtitle">
          Real-time insights • {new Date().toLocaleDateString()}
        </p>
      </header>

      <div className="card-grid">

        {/* Patient Profile */}
        <div className="card card-patient">
          <div className="card-header">
            <div className="card-icon-wrapper blue">
              <Activity size={24} />
            </div>
            <h2>Patient Profile</h2>
          </div>
          <div className="card-content">
            <div className="info-row">
              <span className="info-label">Name</span>
              <span className="info-value">{patient.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Age</span>
              <span className="info-value">{patient.age}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Gender</span>
              <span className="info-value">{patient.gender}</span>
            </div>
          </div>
        </div>

        {/* Lab Results */}
        <div className="card card-labs">
          <div className="card-header">
            <div className="card-icon-wrapper amber">
              <Droplet size={24} />
            </div>
            <h2>Key Lab Results</h2>
          </div>
          <div className="card-content lab-list">
            {labs.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="lab-item">
                  <div className="lab-left">
                    <Icon size={18} className="lab-icon" />
                    <span>{item.label}</span>
                  </div>
                  <span className={`lab-value ${item.status}`}>
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insights */}
        <div className="card card-insights">
          <div className="card-header">
            <div className="card-icon-wrapper red">
              <AlertTriangle size={24} />
            </div>
            <h2>AI Insights</h2>
          </div>
          <div className="card-content">
            <ul className="warning-list">
              {warnings.map((warning, index) => (
                <li key={index} className="warning-item">
                  <AlertTriangle size={18} className="warning-icon" />
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Diet Recommendations */}
        <div className="card card-diet">
          <div className="card-header">
            <div className="card-icon-wrapper green">
              <Apple size={24} />
            </div>
            <h2>Diet Recommendations</h2>
          </div>
          <div className="card-content">
            <ul className="diet-list">
              <li>
                <UtensilsCrossed size={18} className="diet-icon green" />
                Increase iron-rich foods (spinach, lentils, red meat)
              </li>
              <li>
                <UtensilsCrossed size={18} className="diet-icon amber" />
                Reduce refined sugars
              </li>
              <li>
                <UtensilsCrossed size={18} className="diet-icon emerald" />
                Eat fiber-rich vegetables
              </li>
            </ul>
          </div>
        </div>

      </div>

      <footer className="dashboard-footer">
        NutriAI-Care • Confidential • Updated real-time
      </footer>
    </div>
  );
}

export default Dashboard;