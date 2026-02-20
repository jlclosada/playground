import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import ChallengeView from './pages/ChallengeView'
import FreePlayground from './pages/FreePlayground'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a25',
            color: '#f0f0f5',
            border: '1px solid #2a2a3a',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#0a0a0f' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0a0a0f' },
          },
        }}
      />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/challenge/:id" element={<ChallengeView />} />
          <Route path="/playground" element={<FreePlayground />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

