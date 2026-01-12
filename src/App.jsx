import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Music from './components/Music'
import Shows from './components/Shows'
import Gallery from './components/Gallery'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <Router basename="/rat-paws">
      <CustomCursor />
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/music" element={<Music />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App
