import { useEffect,useState } from "react";

function Dashboard(){

  const [labs,setLabs] = useState([]);

  const userId = 1; // temporary

  useEffect(()=>{

    fetch(`http://127.0.0.1:8000/api/labs/user/${userId}`)
    .then(res=>res.json())
    .then(data=>{

      console.log("Lab data:",data);

      setLabs(data);

    })
    .catch(err=>console.log(err));

  },[]);

  return(

    <div style={{padding:"40px"}}>

      <h1>Dashboard</h1>

      {labs.length === 0 && <p>No lab data found</p>}

      {labs.map((lab,index)=>(

        <div key={index} style={{border:"1px solid black",margin:"10px",padding:"10px"}}>

          <p>Hemoglobin: {lab.hemoglobin}</p>
          <p>Vitamin D: {lab.vitamin_d}</p>
          <p>Fasting Sugar: {lab.fasting_sugar}</p>
          <p>AI Insight: {lab.ai_explanation}</p>

        </div>

      ))}

    </div>

  );

}

export default Dashboard;