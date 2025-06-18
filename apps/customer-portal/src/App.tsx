import React, { useEffect, useState } from 'react';

const Header: React.FC = () => {
  return <h1>Welcome to Customer Portal</h1>;
};

const WelcomeMessage: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Welcome to the Customer Portal!</h2>
      <p>Current Date and Time: {currentDateTime.toLocaleString()}</p>
    </div>
  );
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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="App">
      <header>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </header>
      <main>
        <WelcomeMessage />
        <Header />
        <UserList />
      </main>
    </div>
  );
};

export default App;