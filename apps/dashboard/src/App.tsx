import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Analytics</a></li>
            <li><a href="#">Settings</a></li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header className="header">
          <h1>Welcome to Your Dashboard</h1>
        </header>
        <section className="card-grid">
          <div className="card dashboard-card">
            <h3>API Requests</h3>
            <p>{count}</p>
            <button onClick={() => setCount((count) => count + 1)}>
              Simulate Request
            </button>
          </div>
          <div className="card dashboard-card">
            <h3>Status</h3>
            <p>All systems operational</p>
          </div>
          <div className="card dashboard-card">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">Docs</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
