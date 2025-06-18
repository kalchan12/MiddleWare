// Import necessary modules and hooks from React
import React, { useEffect, useState } from 'react';

// Header component displays the title of the portal
const Header: React.FC = () => {
  return <h1>Welcome to Customer Portal</h1>;
};

// WelcomeMessage component displays a dynamic welcome message with the current date and time
const WelcomeMessage: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update the current date and time every second
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Welcome to the Customer Portal!</h2>
      <p>Current Date and Time: {currentDateTime.toLocaleString()}</p>
    </div>
  );
};

// UserList component fetches and displays a list of users with a search functionality
const UserList: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch users from the API
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

  // Filter users based on the search term
  const filteredUsers = users.filter((user: any) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>User List</h2>
      {/* Input field for searching users */}
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* Display the filtered list of users */}
      <ul>
        {filteredUsers.map((user: any) => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

// App component serves as the main entry point for the application
const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Toggle dark mode class on the document element
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="App">
      <header>
        {/* Button to toggle dark mode */}
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </header>
      <main>
        {/* Render the WelcomeMessage, Header, and UserList components */}
        <WelcomeMessage />
        <Header />
        <UserList />
      </main>
    </div>
  );
};

export default App;