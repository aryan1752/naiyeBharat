function Stats() {
  const stats = [
    { target: 20, label: 'Years of Experience', suffix: '+' },
    { target: 500, label: 'Cases Won', suffix: '+' },
    { target: 80, label: 'Success Rate', suffix: '%' },
    { target: 150, label: 'Happy Clients', suffix: '+' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="gsap-scale stat-item">
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-baseline space-x-1">
                  <div className="counter-number text-blue-600 text-4xl font-bold" data-target={stat.target}>
                    0
                  </div>
                  <span className="text-blue-600 text-4xl font-bold">{stat.suffix}</span>
                </div>
                <p className="text-gray-600 font-medium text-lg mt-2">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default Stats;
