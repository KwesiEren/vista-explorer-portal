
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { MapPin, Calendar, FolderOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { brandingConfig } from '../config/branding';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Categories', href: '/categories', icon: FolderOpen },
    { name: 'Places of Interest', href: '/pois', icon: MapPin },
    { name: 'Events of Interest', href: '/events', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <img 
              src={brandingConfig.logoUrl} 
              alt={brandingConfig.logoAlt}
              className="h-8 w-8 rounded-md object-cover"
              onError={(e) => {
                // Fallback to a simple colored div if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="h-8 w-8 bg-accent rounded-md hidden flex-shrink-0"></div>
            <h1 className="text-xl font-bold text-sidebar-foreground">{brandingConfig.appName}</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-8">
          <div className="px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <h2 className="ml-2 text-lg font-semibold text-gray-900 lg:ml-0">
                  {brandingConfig.description}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
