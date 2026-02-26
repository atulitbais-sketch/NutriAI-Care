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
  const patient = {
    name: "John Doe",
    age: 35,
    gender: "Male",
  };

  const labs = [
    { label: "Hemoglobin", value: "10.5 g/dL", status: "low", icon: Droplet },
    { label: "Blood Sugar", value: "160 mg/dL", status: "high", icon: Heart },
    { label: "Cholesterol", value: "220 mg/dL", status: "high", icon: Activity },
  ];

  const warnings = [
    "Possible Anemia – consider iron supplementation",
    "Elevated Diabetes Risk – monitor HbA1c",
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Medi-Flow AI Dashboard</h1>
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
              <span className="info-value">{patient.age} years</span>
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
                Significantly reduce refined sugars & processed carbs
              </li>
              <li>
                <UtensilsCrossed size={18} className="diet-icon emerald" />
                Add nuts, seeds, whole grains & fiber-rich vegetables
              </li>
            </ul>
          </div>
        </div>
      </div>

      <footer className="dashboard-footer">
        Medi-Flow AI • Confidential • Updated real-time
      </footer>
    </div>
  );
}

export default Dashboard;