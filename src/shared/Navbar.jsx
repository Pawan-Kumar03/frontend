import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import UserContext from "../contexts/UserContext"; // Import UserContext

export default function Navbar() {
    const { user, logout } = useContext(UserContext); // Use UserContext
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const logoStyle = {
        width: '80px',
        height: 'auto'
    };

    useEffect(() => {
        // Close dropdown if user clicks outside of it
        const handleClickOutside = (event) => {
            const dropdownElement = document.getElementById('dropdown');
            if (dropdownElement && !dropdownElement.contains(event.target) && !event.target.classList.contains('dropdown-toggle')) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <header className="bg-gray-800">
            <div className="lg:border-b lg:border-b-gray-600">
                <nav className="relative container mx-auto p-4 text-gray-100 flex items-center justify-between">
                    {/* Logo on the top left */}
                    <div className="flex items-center">
                        <Link to="/">
                            <img style={logoStyle} src={logo} alt="logo" />
                        </Link>
                    </div>

                    {/* Navigation Links on the top right */}
                    <div className="hidden sm:flex items-center space-x-6">
                        <Link to="/" className="bg-custom text-black py-2 px-4 rounded cursor-pointer">Home</Link>
                        <Link to="/about-us" className="bg-custom text-black py-2 px-4 rounded cursor-pointer">About Us</Link>

                        {user ? (
                            <div className="relative">
                                <span
                                    className="bg-custom text-black py-2 px-4 rounded cursor-pointer dropdown-toggle"
                                    onClick={toggleDropdown}
                                >
                                    {user.name} {/* Display username */}
                                </span>
                                {dropdownOpen && (
                                    <div id="dropdown" className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-48 z-50">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 hover:bg-gray-200"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            to="/get-verified"
                                            className="block px-4 py-2 hover:bg-gray-200"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Get Verified
                                        </Link>
                                        <Link
                                            to="/my-ads"
                                            className="block px-4 py-2 hover:bg-gray-200"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            My Ads
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-200"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="bg-custom text-black py-2 px-4 rounded cursor-pointer">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu for Smaller Screens */}
                    <div className="sm:hidden flex items-center">
                        <button
                            onClick={toggleDropdown}
                            className="text-gray-200 focus:outline-none"
                        >
                            {/* Hamburger Menu Icon */}
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-48 z-50">
                                <Link
                                    to="/"
                                    className="block px-4 py-2 hover:bg-gray-200"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/about-us"
                                    className="block px-4 py-2 hover:bg-gray-200"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    About Us
                                </Link>
                                {user ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 hover:bg-gray-200"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            to="/get-verified"
                                            className="block px-4 py-2 hover:bg-gray-200"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Get Verified
                                        </Link>
                                        <Link
                                            to="/my-ads"
                                            className="block px-4 py-2 hover:bg-gray-200"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            My Ads
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-200"
                                        >
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-200">
                                        Login
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
