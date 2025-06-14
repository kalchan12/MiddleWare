import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="dashboard-container">
      <aside className="sidebar" aria-label="Sidebar">
        <h2>Dashboard</h2>
        <nav aria-label="Main navigation">
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
          <DashboardCard title="API Requests">
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>
              Simulate Request
            </button>
          </DashboardCard>
          <DashboardCard title="Status">
            <p>All systems operational</p>
          </DashboardCard>
          <DashboardCard title="Quick Links">
            <ul>
              <li><a href="#">Docs</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </DashboardCard>
        </section>
      </main>
    </div>
  )
}

function DashboardCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card dashboard-card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default App
