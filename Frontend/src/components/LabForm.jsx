import { useState } from "react";
import { analyzeLabs } from "../services/api";

function LabForm() {

  const [labs, setLabs] = useState({
    age: "",
    gender: "male",
    hemoglobin: "",
    vitamin_d: "",
    fasting_sugar: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await analyzeLabs(labs);

    console.log(result);

    alert(result.analysis);
  };

  return (
    <form onSubmit={handleSubmit}>

      <input
        placeholder="Age"
        onChange={(e) => setLabs({...labs, age: Number(e.target.value)})}
      />

      <select
        onChange={(e) => setLabs({...labs, gender: e.target.value})}
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <input
        placeholder="Hemoglobin"
        onChange={(e) => setLabs({...labs, hemoglobin: Number(e.target.value)})}
      />

      <input
        placeholder="Vitamin D"
        onChange={(e) => setLabs({...labs, vitamin_d: Number(e.target.value)})}
      />

      <input
        placeholder="Fasting Sugar"
        onChange={(e) => setLabs({...labs, fasting_sugar: Number(e.target.value)})}
      />

      <button type="submit">
        Analyze Labs
      </button>

    </form>
  );
}

export default LabForm;