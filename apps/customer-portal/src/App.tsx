import React from 'react';

const Header: React.FC = () => {
  return <h1>Welcome to Customer Portal</h1>;
};

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
    </div>
  );
};

export default App;