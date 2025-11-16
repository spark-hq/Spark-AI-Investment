import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Menu, X, ChevronDown, Calculator, Settings, Target, CreditCard, TrendingUp, Bell, User, Brain, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMoreDropdownOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMoreDropdown = () => {
    setIsMoreDropdownOpen(!isMoreDropdownOpen);
    setIsProfileDropdownOpen(false);
  };

  const closeMoreDropdown = () => {
    setIsMoreDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsMoreDropdownOpen(false);
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    closeProfileDropdown();
    navigate('/');
  };

  // Protected route handler for unauthenticated users
  const handleProtectedRoute = (e, path) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: { pathname: path } } });
    }
  };

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMoreDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMoreDropdownOpen(false);
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  // Additional features for dropdown
  const moreItems = [
    {
      name: "AI Analysis",
      path: "/ai-analysis",
      icon: Brain,
      description: "AI-powered portfolio insights",
    },
    {
      name: "Calculator",
      path: "/calculator",
      icon: Calculator,
      description: "SIP & Investment calculators",
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: CreditCard,
      description: "View transaction history",
    },
    {
      name: "Goals",
      path: "/goals",
      icon: Target,
      description: "Financial goals tracker",
    },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-gray-100 backdrop-blur-sm bg-opacity-95" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group py-4"
            onClick={closeMobileMenu}
            aria-label="Spark Investment Home"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2.5 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-md group-hover:shadow-lg" aria-hidden="true">
              <Sparkles className="text-white" size={22} />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Spark Investment
              </span>
              <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex space-x-1 items-center">
            <Link
              to="/"
              className={`${
                isActive("/")
                  ? "text-indigo-600 bg-indigo-50 shadow-sm"
                  : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              } px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm flex items-center`}
              aria-current={isActive("/") ? "page" : undefined}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              onClick={(e) => handleProtectedRoute(e, '/dashboard')}
              className={`${
                isActive("/dashboard")
                  ? "text-indigo-600 bg-indigo-50 shadow-sm"
                  : isAuthenticated
                  ? "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                  : "text-gray-400 cursor-not-allowed opacity-60 blur-[0.5px]"
              } px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm flex items-center`}
              aria-current={isActive("/dashboard") ? "page" : undefined}
              aria-disabled={!isAuthenticated}
            >
              Dashboard
            </Link>
            <Link
              to="/investments"
              onClick={(e) => handleProtectedRoute(e, '/investments')}
              className={`${
                isActive("/investments")
                  ? "text-indigo-600 bg-indigo-50 shadow-sm"
                  : isAuthenticated
                  ? "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                  : "text-gray-400 cursor-not-allowed opacity-60 blur-[0.5px]"
              } px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm flex items-center`}
            >
              Investments
            </Link>
            <Link
              to="/live-trading"
              onClick={(e) => handleProtectedRoute(e, '/live-trading')}
              className={`${
                isActive("/live-trading")
                  ? "text-indigo-600 bg-indigo-50 shadow-sm"
                  : isAuthenticated
                  ? "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                  : "text-gray-400 cursor-not-allowed opacity-60 blur-[0.5px]"
              } px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm flex items-center space-x-1`}
            >
              <span>🎯</span>
              <span>Trading</span>
            </Link>
            <Link
              to="/auto-invest"
              onClick={(e) => handleProtectedRoute(e, '/auto-invest')}
              className={`${
                isActive("/auto-invest")
                  ? "text-indigo-600 bg-indigo-50 shadow-sm"
                  : isAuthenticated
                  ? "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                  : "text-gray-400 cursor-not-allowed opacity-60 blur-[0.5px]"
              } px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm flex items-center`}
            >
              Auto-Invest
            </Link>

            {/* More Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={isAuthenticated ? toggleMoreDropdown : undefined}
                disabled={!isAuthenticated}
                aria-haspopup="true"
                aria-expanded={isMoreDropdownOpen}
                aria-label="More options menu"
                aria-disabled={!isAuthenticated}
                className={`${
                  isMoreDropdownOpen
                    ? "text-indigo-600 bg-indigo-50 shadow-sm"
                    : isAuthenticated
                    ? "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                    : "text-gray-400 cursor-not-allowed opacity-60 blur-[0.5px]"
                } px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm flex items-center space-x-1`}
              >
                <span>More</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    isMoreDropdownOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* Dropdown Menu with improved animation */}
              {isMoreDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 py-3 z-50 transform transition-all duration-200 origin-top-right animate-fadeIn" role="menu" aria-label="More features menu">
                  <div className="px-4 py-2 border-b-2 border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center space-x-2">
                      <Sparkles size={14} aria-hidden="true" />
                      <span>More Features</span>
                    </p>
                  </div>
                  {moreItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeMoreDropdown}
                        role="menuitem"
                        aria-current={isActive(item.path) ? "page" : undefined}
                        className={`${
                          isActive(item.path)
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        } flex items-start space-x-3 px-4 py-3.5 transition-all duration-200 group`}
                      >
                        <div
                          className={`${
                            isActive(item.path)
                              ? "bg-indigo-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                          } p-2.5 rounded-xl transition-all duration-200`}
                          aria-hidden="true"
                        >
                          <Icon size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button
                  className="relative p-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200"
                  aria-label="Notifications (1 unread)"
                >
                  <Bell size={20} aria-hidden="true" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-2 p-2 pr-3 hover:bg-indigo-50 rounded-xl transition-all duration-200 group"
                    aria-haspopup="true"
                    aria-expanded={isProfileDropdownOpen}
                    aria-label={`User menu for ${user?.name || 'User'}`}
                  >
                    <div className="w-9 h-9 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-all duration-200">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full rounded-xl object-cover" />
                      ) : (
                        <span className="text-sm" aria-hidden="true">{user?.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-gray-600 transition-transform duration-300 ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 py-2 z-50 animate-fadeIn" role="menu" aria-label="User menu">
                      <div className="px-4 py-3 border-b-2 border-gray-100" role="presentation">
                        <p className="text-sm font-bold text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user?.email || ''}</p>
                      </div>
                      <Link
                        to="/settings"
                        onClick={closeProfileDropdown}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
                        role="menuitem"
                      >
                        <Settings size={18} aria-hidden="true" />
                        <span className="text-sm font-semibold">Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200"
                        role="menuitem"
                      >
                        <LogOut size={18} aria-hidden="true" />
                        <span className="text-sm font-semibold">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link
                  to="/login"
                  className="px-5 py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-200 font-bold text-sm"
                >
                  Login
                </Link>

                {/* Signup Button */}
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center space-x-2 text-sm"
                  aria-label="Sign up for Spark Investment"
                >
                  <span>Sign Up</span>
                  <Sparkles size={16} aria-hidden="true" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700 hover:text-indigo-600 transition-colors p-2.5 hover:bg-indigo-50 rounded-xl active:scale-95"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden pb-4 pt-2 space-y-2 animate-fadeIn border-t border-gray-100 mt-2" role="navigation" aria-label="Mobile navigation">
            <Link
              to="/"
              className={`${
                isActive("/")
                  ? "text-indigo-600 bg-indigo-50 shadow-sm"
                  : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              } transition-all duration-200 font-semibold px-4 py-3 min-h-[48px] rounded-xl flex items-center active:scale-95`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`${
                    isActive("/dashboard")
                      ? "text-indigo-600 bg-indigo-50 shadow-sm"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                  } transition-all duration-200 font-semibold px-4 py-3 min-h-[48px] rounded-xl flex items-center active:scale-95`}
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/investments"
                  className={`${
                    isActive("/investments")
                      ? "text-indigo-600 bg-indigo-50 shadow-sm"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                  } transition-all duration-200 font-semibold px-4 py-3 min-h-[48px] rounded-xl flex items-center active:scale-95`}
                  onClick={closeMobileMenu}
                >
                  My Investments
                </Link>
                <Link
                  to="/live-trading"
                  className={`${
                    isActive("/live-trading")
                      ? "text-indigo-600 bg-indigo-50 shadow-sm"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                  } transition-all duration-200 font-semibold px-4 py-3 min-h-[48px] rounded-xl flex items-center active:scale-95`}
                  onClick={closeMobileMenu}
                >
                  🎯 Live Trading
                </Link>
                <Link
                  to="/auto-invest"
                  className={`${
                    isActive("/auto-invest")
                      ? "text-indigo-600 bg-indigo-50 shadow-sm"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                  } transition-all duration-200 font-semibold px-4 py-3 min-h-[48px] rounded-xl flex items-center active:scale-95`}
                  onClick={closeMobileMenu}
                >
                  Auto-Invest
                </Link>

                {/* Mobile More Section */}
                <div className="border-t-2 border-gray-100 pt-3 mt-3">
                  <p className="px-4 py-2 text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center space-x-2">
                    <Sparkles size={14} />
                    <span>More Features</span>
                  </p>
                  {moreItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`${
                          isActive(item.path)
                            ? "text-indigo-600 bg-indigo-50 shadow-sm"
                            : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                        } transition-all duration-200 font-semibold px-4 py-3 min-h-[48px] rounded-xl flex items-center space-x-3 active:scale-95`}
                        onClick={closeMobileMenu}
                      >
                        <Icon size={20} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* User Info & Logout (Mobile) */}
                <div className="border-t-2 border-gray-100 pt-3 mt-3 space-y-2">
                  <div className="px-4 py-3 bg-indigo-50 rounded-xl">
                    <p className="text-sm font-bold text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user?.email || ''}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 font-bold"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Login/Signup Buttons (Mobile) */}
                <div className="space-y-2 pt-4">
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-4 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-200 font-bold active:scale-95"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-bold text-center shadow-lg flex items-center justify-center space-x-2 active:scale-95"
                    onClick={closeMobileMenu}
                  >
                    <span>Sign Up</span>
                    <Sparkles size={18} />
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
