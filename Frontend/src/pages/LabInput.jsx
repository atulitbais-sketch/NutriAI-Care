import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LabInput.css";

function LabInput() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    hemoglobin: "",
    vitamin_d: "",
    fasting_sugar: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/labs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          age: Number(formData.age),
          gender: formData.gender,
          hemoglobin: Number(formData.hemoglobin),
          vitamin_d: Number(formData.vitamin_d),
          fasting_sugar: Number(formData.fasting_sugar)
        })
      });

      const data = await response.json();

      console.log("Lab analysis result:", data);

      // redirect to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Error submitting lab data:", error);
    }

    setLoading(false);
  };

  return (
    <div className="lab-container">

      <div className="lab-card">

        <h2 className="lab-title">Lab Report Analyzer</h2>
        <p className="lab-subtitle">
          Enter your health test values for AI analysis
        </p>

        <form onSubmit={handleSubmit} className="lab-form">

          <input
            className="lab-input"
            name="age"
            placeholder="Age"
            type="number"
            onChange={handleChange}
            required
          />

          <select
            className="lab-select"
            name="gender"
            onChange={handleChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <input
            className="lab-input"
            name="hemoglobin"
            placeholder="Hemoglobin (g/dL)"
            type="number"
            step="0.1"
            onChange={handleChange}
            required
          />

          <input
            className="lab-input"
            name="vitamin_d"
            placeholder="Vitamin D (ng/mL)"
            type="number"
            onChange={handleChange}
            required
          />

          <input
            className="lab-input"
            name="fasting_sugar"
            placeholder="Fasting Sugar (mg/dL)"
            type="number"
            onChange={handleChange}
            required
          />

          <button className="lab-button" type="submit">
            {loading ? "Analyzing..." : "Analyze Report"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default LabInput;