import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import UserContext from "../contexts/UserContext";

export default function Navbar() {
    const { user, logout } = useContext(UserContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdownElement = document.getElementById("dropdown");
            if (
                dropdownElement &&
                !dropdownElement.contains(event.target) &&
                !event.target.classList.contains("dropdown-toggle")
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className="bg-primary font-primary shadow-md sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto font-primary px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
                {/* Logo */}
                <div className="flex items-center h-16"> {/* Fixed navbar height */}
    <Link to="/">
        <img
            src={logo}
            alt="logo"
            className="h-20 w-auto object-contain" // Adjust logo height independently
        />
    </Link>
</div>

                {/* Desktop Navigation */}
                <div className="hidden sm:flex items-center space-x-6">
                    <Link to="/" className="px-4 py-2 text-primary rounded-full bg-primary-dark hover:bg-banner">
                        Home
                    </Link>
                    <Link to="/about-us" className="px-4 py-2 text-primary rounded-full bg-primary-dark hover:bg-banner">
                        About Us
                    </Link>
                    <Link to="/ConsultancyPage" className="px-4 py-2 text-primary rounded-full bg-primary-dark hover:bg-banner">
                    Consultation
                    </Link>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={toggleDropdown}
                                className="px-4 py-2 text-button rounded-full bg-button  dropdown-toggle"
                            >
                                {user.name}
                            </button>
                            {dropdownOpen && (
                                <div
                                    id="dropdown"
                                    className="absolute right-0 mt-2 bg-white   rounded-lg shadow-lg w-48"
                                >
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-primary "
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/get-verified"
                                        className="block px-4 py-2 text-primary hover:bg-primary-dark"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Get Verified
                                    </Link>
                                    <Link
                                        to="/my-ads"
                                        className="block px-4 py-2 text-primary hover:bg-primary-dark"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        My Ads
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-primary hover:bg-primary-dark"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="px-4 py-2 bg-button text-button rounded-lg hover:bg-primary-dark"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Navigation */}
                <div className="sm:hidden flex items-center">
                    <button
                        onClick={toggleMobileMenu}
                        className="text-primary hover:bg-primary-dark focus:outline-none"
                    >
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

                    {mobileMenuOpen && (
                        <div className="absolute top-16 right-4 bg-white  rounded-lg shadow-lg w-48">
                            <Link
                                to="/"
                                className="block px-4 py-2 text-primary rounded-full hover:bg-primary-dark"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/about-us"
                                className="block px-4 py-2 text-primary rounded-full hover:bg-primary-dark"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                About Us
                            </Link>
                            <Link
                                to="/ConsultancyPage"
                                className="block px-4 py-2 text-primary rounded-full hover:bg-primary-dark"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Consultation
                            </Link>
                            {user ? (
                                <>
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-primary rounded-full hover:bg-primary-dark"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/get-verified"
                                        className="block px-4 py-2 text-primary rounded-full hover:bg-primary-dark"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Get Verified
                                    </Link>
                                    <Link
                                        to="/my-ads"
                                        className="block px-4 py-2 text-primary rounded-full hover:bg-primary-dark"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Ads
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-primary rounded-full hover:bg-primary-dark"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="block px-4 py-2 text-button bg-button rounded-lg "
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
