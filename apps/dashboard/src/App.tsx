import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import './App.css'

const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Analytics', href: '#' },
  { label: 'Settings', href: '#' },
]

function App() {
  const [count, setCount] = useState(0)
  const [recentActivity, setRecentActivity] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch('http://localhost:3000/api/activity')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch activity')
        return res.json()
      })
      .then((data) => {
        setRecentActivity(data.activities || [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <Header title="Welcome to Your Dashboard" />
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
          <DashboardCard title="Recent API Activity">
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && (
              <ul>
                {recentActivity.length === 0 && <li>No recent activity.</li>}
                {recentActivity.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </DashboardCard>
        </section>
      </main>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Sidebar">
      <h2>Dashboard</h2>
      <nav aria-label="Main navigation">
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.label}><a href={link.href}>{link.label}</a></li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

function Header({ title }: { title: string }) {
  return (
    <header className="header">
      <h1>{title}</h1>
    </header>
  )
}

function DashboardCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="card dashboard-card">
      <h3>{title}</h3>
      {children}
    </div>
  )
}

export default App
