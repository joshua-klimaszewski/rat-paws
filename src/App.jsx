import { useState } from 'react'
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Music from './components/Music'
import Shows from './components/Shows'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import './App.css'

function App() {
  return (
    <>
      <CustomCursor />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Music />
        <Shows />
        <Gallery />
        <Contact />
      </main>
      <footer className="footer">
        <div className="container">
          <p>© 2026 RAT PAWS</p>
          <div className="footer-links">
            <a href="#hero">BACK TO TOP</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
