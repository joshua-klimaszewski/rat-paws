import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Navigation.css'

function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'RAT PAWS' },
    // { path: '/about', label: 'ABOUT' }, // under construction
    { path: '/shows', label: 'SHOWS' },
    { path: '/music', label: 'MUSIC' },
    // { path: '/gallery', label: 'GALLERY' }, // under construction
  ]

  return (
    <motion.nav
      className="navigation"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              aria-label={`Navigate to ${item.label}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.nav>
  )
}

export default Navigation
