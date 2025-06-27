
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
      <div className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-sidebar shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <img 
              src={brandingConfig.logoUrl} 
              alt={brandingConfig.logoAlt}
              className="h-6 w-6 sm:h-8 sm:w-8 rounded-md object-cover flex-shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="h-6 w-6 sm:h-8 sm:w-8 bg-accent rounded-md hidden flex-shrink-0"></div>
            <h1 className="text-lg sm:text-xl font-bold text-sidebar-foreground truncate">{brandingConfig.appName}</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 sm:p-2 rounded-md text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent flex-shrink-0"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
        <nav className="mt-4 sm:mt-8">
          <div className="px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`
                }
              >
                <item.icon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 xl:ml-72 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="flex justify-between h-14 sm:h-16">
              <div className="flex items-center min-w-0">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-1.5 sm:p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex-shrink-0"
                >
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <h2 className="ml-2 lg:ml-0 text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {brandingConfig.description}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
