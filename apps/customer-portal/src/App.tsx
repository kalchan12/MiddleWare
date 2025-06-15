import React, { useEffect, useState } from 'react';

const Header: React.FC = () => {
  return <h1>Welcome to Customer Portal</h1>;
};

const UserList: React.FC = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4000/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <UserList />
    </div>
  );
};

export default App;