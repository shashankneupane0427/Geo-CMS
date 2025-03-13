import { Link } from "react-router-dom";
// Navbar component
const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <div className="flex-shrink-0 flex items-center">
                <svg
                  className="h-8 w-8 text-red-600" // Changed text-blue-600 to text-red-600
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-800">
                  Geo CMS
                </span>
              </div>
            </Link>
          </div>
          <div className="flex items-center">
            <Link to="/login">
              <button className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 ">
                CMS Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
