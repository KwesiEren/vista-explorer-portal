
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Database, Users, BarChart3 } from 'lucide-react';
import { brandingConfig } from '../config/branding';

const Landing = () => {
  const features = [
    {
      icon: Database,
      title: "Category Management",
      description: "Organize and manage your data categories with ease"
    },
    {
      icon: Shield,
      title: "Secure Access",
      description: "Enterprise-grade security for your portal management"
    },
    {
      icon: Users,
      title: "User-Friendly Interface",
      description: "Intuitive design built for modern workflows"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive insights and reporting capabilities"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
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
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
                About Us
              </Link>
              <Link 
                to="/portal" 
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <span>Enter Portal</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>

            {/* Mobile menu */}
            <div className="md:hidden flex space-x-2">
              <Link to="/about" className="text-sm text-gray-600 hover:text-primary px-3 py-2">
                About
              </Link>
              <Link 
                to="/portal" 
                className="bg-primary text-white px-3 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                Portal
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <img 
              src={brandingConfig.logoUrl} 
              alt={brandingConfig.logoAlt}
              className="h-20 w-20 rounded-2xl object-cover shadow-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="h-20 w-20 bg-primary rounded-2xl hidden flex-shrink-0 shadow-lg"></div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {brandingConfig.appName}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {brandingConfig.description}
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Streamline your workflow with our comprehensive portal management system. 
            Manage categories, points of interest, and events all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/portal" 
              className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              to="/about" 
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              System Overview
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the powerful features that make our portal management system 
              the perfect solution for your organization.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of organizations already using our portal management system 
            to streamline their operations.
          </p>
          <Link 
            to="/portal" 
            className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center space-x-2"
          >
            <span>Enter Portal Now</span>
            <ArrowRight className="h-5 w-5" />
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

export default Landing;
