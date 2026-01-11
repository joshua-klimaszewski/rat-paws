import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './Shows.css'

function Shows() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const shows = [
    {
      date: '2026-03-15',
      venue: 'THE UNDERGROUND',
      location: 'NEW YORK, NY',
      tickets: '#',
    },
    {
      date: '2026-04-02',
      venue: 'BASEMENT COLLECTIVE',
      location: 'LOS ANGELES, CA',
      tickets: '#',
    },
    {
      date: '2026-04-20',
      venue: 'NOISE FACTORY',
      location: 'CHICAGO, IL',
      tickets: '#',
    },
    {
      date: '2026-05-10',
      venue: 'WAREHOUSE 23',
      location: 'BROOKLYN, NY',
      tickets: '#',
    },
  ]

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <section id="shows" className="shows section" ref={ref}>
      <div className="container">
        <h2 className="shows-title">SHOWS</h2>

        <div className="shows-table-container">
          <table className="shows-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>VENUE</th>
                <th>LOCATION</th>
                <th>TICKETS</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((show, i) => (
                <motion.tr
                  key={show.date}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  whileHover={{
                    backgroundColor: 'var(--color-black)',
                    color: 'var(--color-white)',
                    scale: 1.01,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="show-date">{show.date}</td>
                  <td className="show-venue">{show.venue}</td>
                  <td className="show-location">{show.location}</td>
                  <td className="show-tickets">
                    <a href={show.tickets} className="tickets-button">
                      GET TICKETS
                    </a>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="no-shows-message">
          <p>MORE SHOWS COMING SOON</p>
        </div>
      </div>
    </section>
  )
}

export default Shows
