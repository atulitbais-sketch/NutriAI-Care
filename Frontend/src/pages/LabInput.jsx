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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/labs/analyze", {
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

      if (!response.ok) {
        setError(data.detail || "Failed to analyze report.");
        return;
      }

      setSuccess("Lab report analyzed and saved successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 900);
    } catch (error) {
      console.error("Error submitting lab data:", error);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lab-container">
      <div className="lab-card">
        <h2 className="lab-title">Lab Report Analyzer</h2>
        <p className="lab-subtitle">
          Enter patient health values for AI analysis
        </p>

        <form onSubmit={handleSubmit} className="lab-form">
          <input
            className="lab-input"
            name="age"
            placeholder="Age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
          />

          <select
            className="lab-select"
            name="gender"
            value={formData.gender}
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
            value={formData.hemoglobin}
            onChange={handleChange}
            required
          />

          <input
            className="lab-input"
            name="vitamin_d"
            placeholder="Vitamin D (ng/mL)"
            type="number"
            step="0.1"
            value={formData.vitamin_d}
            onChange={handleChange}
            required
          />

          <input
            className="lab-input"
            name="fasting_sugar"
            placeholder="Fasting Sugar (mg/dL)"
            type="number"
            step="0.1"
            value={formData.fasting_sugar}
            onChange={handleChange}
            required
          />

          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
          {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}

          <button className="lab-button" type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Report"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LabInput;