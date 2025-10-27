import Logo from '../UI/Logo';

function Hero() {
  return (
    <section id="home" className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 parallax-bg relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-float absolute top-20 left-10 w-4 h-4 bg-white/10 rounded-full" style={{animationDelay: '0s'}}></div>
        <div className="animate-float absolute top-40 right-20 w-2 h-2 bg-white/20 rounded-full" style={{animationDelay: '1s'}}></div>
        <div className="animate-float absolute bottom-32 left-1/4 w-3 h-3 bg-white/15 rounded-full" style={{animationDelay: '2s'}}></div>
        <div className="animate-float absolute top-1/2 right-1/3 w-2 h-2 bg-white/10 rounded-full" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Logo className="w-16 h-16 md:w-20 md:h-20 hero-logo" />
          <h1 className="text-4xl md:text-6xl font-bold animate-cascade gradient-text hero-title" style={{animationDelay: '1.2s'}}>
            NaiyeBharat
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-cascade hero-subtitle" style={{animationDelay: '1.5s'}}>
          Your Trusted Legal Partner
        </p>
        
        <p className="text-lg md:text-xl mb-8 text-blue-200 max-w-3xl mx-auto animate-cascade hero-description" style={{animationDelay: '1.8s'}}>
          Providing comprehensive legal solutions with integrity, expertise and dedication. 
          We are committed to protecting your rights and delivering justice.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-cascade hero-buttons" style={{animationDelay: '2.1s'}}>
          <a href="#contact" className="bg-white text-blue-700 px-8 py-3 rounded-md font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            Book Consultation
          </a>
          <a href="#services" className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300 transform hover:scale-105">
            Our Services
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;