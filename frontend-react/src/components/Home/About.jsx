 function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 gsap-fade about-header">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 gradient-text">About NaiyeBharat</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 about-line"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            With over two decades of experience, we stand as pillars of justice in the legal landscape of India.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="gsap-slide-left about-content">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Legacy of Excellence</h3>
            <p className="text-gray-600 mb-4">
              Since our establishment, NaiyeBharat has been at the forefront of legal innovation, 
              combining traditional values with modern legal practices.
            </p>
            <p className="text-gray-600 mb-6">
              Our team of expert attorneys has successfully handled over 500+ cases, 
              ensuring justice and legal protection for individuals and businesses alike.
            </p>
            
            <div className="space-y-4 stagger-container about-features">
              {['20+ Years of Experience', '500+ Successful Cases', '80% Client Satisfaction'].map((feature, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="gsap-slide-right about-card">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl shadow-lg">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">Certified Excellence</h4>
                <p className="text-gray-600">
                  Recognized by the Bar Council of India and certified by leading legal institutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default About;