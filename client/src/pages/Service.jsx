import { useAuth } from "../store/auth-context";
import { useState } from 'react';

export const Service = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const serviceCategories = [
    { id: 'all', name: 'All', icon: '📋' },
    { id: 'design', name: 'Design', icon: '🎨' },
    { id: 'development', name: 'Development', icon: '💻' },
    { id: 'marketing', name: 'Marketing', icon: '📈' }
  ];
  
  const { services = [], isLoading, error } = useAuth();

  if (isLoading) {
    return <div className="loading">Loading services...</div>;
  }

  if (error) {
    return <div className="error">Error loading services: {error.message}</div>;
  }

  if (!services || services.length === 0) {
    return <div className="no-services">No services available at the moment.</div>;
  }

  // Filter services based on active filter if needed
  const filteredServices = activeFilter === 'all' 
    ? services 
    : services.filter(service => service.category === activeFilter);

  return (
    <section className="section-services">
      <div className="container">
        <h1 className="main-heading">Services </h1>
      </div>

      <div className="container grid grid-three-cols">
        <div className="service-filters">
          {serviceCategories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${activeFilter === category.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(category.id)}
            >
              <span className="filter-icon">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
        {services.map((curElem, index) => {
          const { price, description, provider, service } = curElem;

          return (
            <div className="card" key={index}>
              <div className="card-img">
                <img
                  src="/images/design.png"
                  alt="our services info"
                  width="200"
                />
              </div>

              <div className="card-details">
                <div className="grid grid-two-cols">
                  <p>{provider}</p>
                  <p>{price}</p>
                </div>
                <h2>{service}</h2>
                <p>{description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
