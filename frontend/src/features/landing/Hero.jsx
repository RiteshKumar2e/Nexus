import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import '../../styles/Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container-page hero-content">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="eyebrow hero-eyebrow"
        >
          Adaptive Disaster Response
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="hero-headline"
        >
          Disasters change by the minute.
          <br />
          Your response should too.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hero-subtext"
        >
          NEXUS helps emergency teams monitor evolving conditions, coordinate resources, and
          continuously adapt response plans through AI-assisted decision support.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="hero-actions"
        >
          <Link to="/register" className="btn btn-primary">
            Launch Command Center <ArrowRight style={{ width: 16, height: 16 }} />
          </Link>
          <a href="#capabilities" className="btn btn-secondary">
            Explore the Platform
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="hero-meta"
        >
          <span>Simulation Mode</span>
          <span className="hero-meta-dot" />
          <span>Human-in-the-loop</span>
          <span className="hero-meta-dot" />
          <span>Decision Support</span>
        </motion.div>
      </div>
    </section>
  )
}
