import { useEffect, useState } from "react";

function Dashboard() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data.users);
      });
  }, []);

  return (
    <div>
      <h1>Users</h1>
      {users.map((u, i) => (
        <p key={i}>{u}</p>
      ))}
    </div>
  );
}

export default Dashboard;