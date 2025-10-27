import Logo from '../ui/logo';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="gsap-fade footer-brand">
            <div className="flex items-center space-x-3 mb-4">
              <Logo className="w-10 h-10" />
              <h3 className="text-2xl font-bold">NaiyeBharat</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted legal partner for over two decades, providing comprehensive legal solutions with integrity and expertise.
            </p>
          </div>

          <div className="gsap-fade footer-links">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="gsap-fade footer-services">
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#civil" className="text-gray-400 hover:text-white transition-colors">Civil Law</a></li>
              <li><a href="#criminal" className="text-gray-400 hover:text-white transition-colors">Criminal Law</a></li>
              <li><a href="#corporate" className="text-gray-400 hover:text-white transition-colors">Corporate Law</a></li>
              <li><a href="#family" className="text-gray-400 hover:text-white transition-colors">Family Law</a></li>
            </ul>
          </div>

          <div className="gsap-fade footer-contact">
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <p className="text-gray-400">Chamber number-, Saket District Court, New Delhi</p>
              <p className="text-gray-400">+91 96436 42462</p>
              <p className="text-gray-400">naiyebharat@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center gsap-fade footer-bottom">
          <p className="text-gray-400">&copy; 2024 NyayBharat. All rights reserved. | Designed with excellence for justice.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;