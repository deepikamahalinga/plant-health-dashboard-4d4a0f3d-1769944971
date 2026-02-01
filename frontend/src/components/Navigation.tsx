import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, Search } from 'lucide-react';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  
  // Mock user data - replace with actual auth context
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const NavLink: React.FC<NavLinkProps> = ({ to, children, onClick }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`px-4 py-2 rounded-md transition-colors duration-200
          ${isActive 
            ? 'bg-green-100 text-green-800' 
            : 'text-gray-700 hover:bg-gray-100'
          }`}
      >
        {children}
      </Link>
    );
  };

  const handleLogout = () => {
    // Implement logout logic
    setIsAuthenticated(false);
    setUserData(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-8 mr-2"
                src="/logo.svg"
                alt="Logo"
              />
              <span className="text-xl font-bold text-green-600">
                PlantCare
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/plant-data">Plant Data</NavLink>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>

          {/* Authentication Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <User className="h-6 w-6" />
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/plant-data" onClick={() => setIsOpen(false)}>
              Plant Data
            </NavLink>
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mt-3">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>

            {/* Mobile Authentication */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;