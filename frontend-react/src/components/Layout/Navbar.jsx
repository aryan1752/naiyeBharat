import { useState, useEffect } from 'react';
import Logo from '../UI/Logo';

 function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const services = [
    { name: 'Civil Law', href: '#civil' },
    { name: 'Criminal Law', href: '#criminal' },
    { name: 'Corporate Law', href: '#corporate' },
    { name: 'Family Law', href: '#family' },
    { name: 'Property Law', href: '#property' },
    { name: 'Tax Law', href: '#tax' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
        : 'bg-white shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 justify-between">
          
          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>

          {/* Logo and Brand */}
          <div className="flex-1 flex justify-center md:justify-start">
            <div className="flex items-center space-x-3">
              <div onClick={scrollToTop} className="cursor-pointer">
                <Logo className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <a 
                href="#" 
                className="text-xl md:text-2xl font-bold text-gray-800 hover:text-blue-600 transition-all duration-300 animate-emerge hover:scale-105"
              >
                NaiyeBharat
              </a>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center space-x-6">
            <a href="#home" className="nav-link text-gray-700 hover:text-blue-600 font-medium transition-all duration-300">Home</a>
            <a href="#about" className="nav-link text-gray-700 hover:text-blue-600 font-medium transition-all duration-300">About Us</a>
            
            {/* Services Dropdown */}
            <div className="relative group">
              <a href="#services" className="nav-link text-gray-700 hover:text-blue-600 font-medium flex items-center py-2 transition-colors">
                Services
                <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </a>
              <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-xl rounded-md border border-gray-100 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                {services.map(service => (
                  <a 
                    key={service.name}
                    href={service.href} 
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {service.name}
                  </a>
                ))}
              </div>
            </div>

            <a href="#contact" className="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
            <a href="#appointment" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 animate-pulse-glow">
              Book Appointment
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white shadow-md border-t border-gray-100">
          <a href="#home" className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">Home</a>
          <a href="#about" className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">About Us</a>
          
          {/* Mobile Services Dropdown */}
          <div>
            <button 
              onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
              className="w-full text-left flex justify-between items-center text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
            >
              Services
              <svg className={`w-4 h-4 transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            {isMobileServicesOpen && (
              <div className="pl-4 mt-1 space-y-1">
                {services.map(service => (
                  <a 
                    key={service.name}
                    href={service.href} 
                    className="block text-gray-600 hover:text-blue-600 py-1 transition-colors"
                  >
                    {service.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="#contact" className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">Contact</a>
          <a href="#appointment" className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center shadow-md mt-3">
            Book Consultation
          </a>
        </div>
      )}
    </nav>
  );
}
export default Navbar;