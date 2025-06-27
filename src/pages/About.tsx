
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Globe, Users, Award, Zap } from 'lucide-react';
import { brandingConfig } from '../config/branding';

const About = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "contact@vistaexplorer.com",
      href: "mailto:contact@vistaexplorer.com"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567"
    },
    {
      icon: MapPin,
      title: "Address",
      value: "123 Tech Street, Innovation City, IC 12345",
      href: "https://maps.google.com"
    },
    {
      icon: Globe,
      title: "Website",
      value: "www.vistaexplorer.com",
      href: "https://www.vistaexplorer.com"
    }
  ];

  const values = [
    {
      icon: Users,
      title: "User-Centric Design",
      description: "We prioritize user experience in every feature we build"
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description: "Committed to delivering high-quality, reliable solutions"
    },
    {
      icon: Zap,
      title: "Innovation First",
      description: "Constantly evolving with the latest technologies and trends"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img 
                src={brandingConfig.logoUrl} 
                alt={brandingConfig.logoAlt}
                className="h-8 w-8 rounded-md object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="h-8 w-8 bg-primary rounded-md hidden flex-shrink-0"></div>
              <h1 className="text-xl font-bold text-gray-900">{brandingConfig.appName}</h1>
            </Link>
            
            <nav className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-primary transition-colors flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
              <Link 
                to="/portal" 
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Enter Portal
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About Vista Explorer
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We're dedicated to building innovative portal management solutions that 
            empower organizations to streamline their operations and enhance productivity.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At Vista Explorer, we believe that efficient portal management shouldn't be 
                complicated. Our mission is to provide intuitive, powerful tools that help 
                organizations manage their data, streamline workflows, and make informed decisions.
              </p>
              <p className="text-lg text-gray-600">
                We're committed to continuous innovation, ensuring our platform evolves with 
                the changing needs of modern businesses while maintaining the simplicity and 
                reliability our users depend on.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {values.map((value, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <value.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600">
              Have questions or need support? We're here to help you succeed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((contact, index) => (
              <a
                key={index}
                href={contact.href}
                className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center group"
                target={contact.href.startsWith('http') ? '_blank' : undefined}
                rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary/20 transition-colors">
                  <contact.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{contact.title}</h3>
                <p className="text-gray-600 text-sm">{contact.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Team</h2>
          <p className="text-lg text-gray-600 mb-8">
            Vista Explorer is built by a passionate team of developers, designers, and 
            product experts who are committed to creating exceptional user experiences.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">
              <strong>Development Team:</strong> Full-stack developers specializing in React, Node.js, and modern web technologies
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Design Team:</strong> UX/UI designers focused on creating intuitive and accessible interfaces
            </p>
            <p className="text-gray-600">
              <strong>Product Team:</strong> Product managers and analysts ensuring we build what our users need
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Experience Vista Explorer?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join us in revolutionizing portal management. Get started today!
          </p>
          <Link 
            to="/portal" 
            className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Enter Portal
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <img 
              src={brandingConfig.logoUrl} 
              alt={brandingConfig.logoAlt}
              className="h-8 w-8 rounded-md object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="h-8 w-8 bg-white rounded-md hidden flex-shrink-0"></div>
            <h3 className="text-xl font-bold">{brandingConfig.appName}</h3>
          </div>
          <p className="text-gray-400 mb-4">
            {brandingConfig.description}
          </p>
          <p className="text-gray-500">
            Version {brandingConfig.version} • Built with ❤️ for modern workflows
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
