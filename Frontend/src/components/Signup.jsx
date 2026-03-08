import { useState } from "react";
import { signup } from "../services/api";

function Signup() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signup(form);

    console.log(result);
    alert("User created!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        onChange={(e) => setForm({...form, name: e.target.value})}
      />

      <input
        placeholder="Email"
        onChange={(e) => setForm({...form, email: e.target.value})}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({...form, password: e.target.value})}
      />

      <button type="submit">Signup</button>
    </form>
  );
}

export default Signup;