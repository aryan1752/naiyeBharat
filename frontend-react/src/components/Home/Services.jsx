 function Services() {
  const services = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
        </svg>
      ),
      title: 'Civil Law',
      description: 'Expert representation in civil disputes, property matters, and contract issues.',
      features: ['Property Disputes', 'Contract Law', 'Personal Injury', 'Consumer Rights'],
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      ),
      title: 'Criminal Law',
      description: 'Aggressive defense and prosecution in criminal matters with proven track record.',
      features: ['Criminal Defense', 'Bail Applications', 'White Collar Crime', 'Appeals'],
      gradient: 'from-red-500 to-red-600'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      ),
      title: 'Corporate Law',
      description: 'Complete corporate legal solutions for businesses of all sizes.',
      features: ['Company Formation', 'Mergers & Acquisitions', 'Compliance', 'Commercial Contracts'],
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      ),
      title: 'Family Law',
      description: 'Compassionate handling of sensitive family matters and disputes.',
      features: ['Divorce Proceedings', 'Child Custody', 'Adoption', 'Domestic Violence'],
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      ),
      title: 'Property Law',
      description: 'Expert guidance on property transactions and real estate matters.',
      features: ['Property Purchase', 'Title Verification', 'Property Disputes', 'Registration'],
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
      ),
      title: 'Tax Law',
      description: 'Comprehensive tax planning and dispute resolution services.',
      features: ['Tax Planning', 'GST Compliance', 'Income Tax', 'Tax Appeals'],
      gradient: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 gsap-fade services-header">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Legal Services</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive legal solutions tailored to meet your specific needs across various practice areas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12 services-grid">
          {services.map((service, index) => (
            <div key={index} className="text-center p-8 bg-white rounded-xl shadow-lg card-hover gsap-scale">
              <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-full flex items-center justify-center mx-auto mb-6 animate-float`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="text-sm text-gray-500 space-y-1">
                {service.features.map((feature, i) => (
                  <li key={i}>• {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default Services;