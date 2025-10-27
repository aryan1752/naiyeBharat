import { useEffect } from 'react';
import Navbar from '../components/Layout/Navbar.jsx';
import Hero from '../components/Home/Hero.jsx';
import Stats from '../components/Home/Stats.jsx';
import About from '../components/Home/About.jsx';
import Services from '../components/Home/Services.jsx';
import Contact from '../components/Home/Contact.jsx';
import Footer from '../components/Layout/Footer.jsx';
import { initializeGSAP } from '../utils/gsapAnimations';

export default function Home() {
  useEffect(() => {
    // Initialize GSAP animations when component mounts
    initializeGSAP();
  }, []);

  return (
    <div className="bg-gray-50">
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}