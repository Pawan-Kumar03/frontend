import React, { useEffect, useState } from "react";
import axios from "axios";
import logoDark from "../assets/logo.png";
import Card from "../components/Card/Card";
import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/swiper-bundle.min.css"; // Import Swiper styles

export default function Footer() {
    const [properties, setProperties] = useState([]);
    const [selectedCity, setSelectedCity] = useState('Dubai'); // Default city
    const [showProperties, setShowProperties] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('all'); // Default location

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setSelectedLocation(params.get('location') || 'all');
    }, []);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                let url = `https://backend-git-main-pawan-togas-projects.vercel.app/api/listings?city=${encodeURIComponent(selectedCity)}`;
                if (selectedLocation && selectedLocation !== 'all') {
                    url += `&location=${encodeURIComponent(selectedLocation)}`;
                }

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setProperties(data);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };

        fetchProperties();
    }, [selectedCity, selectedLocation]);

    const handleCityClick = (e, city) => {
        e.preventDefault(); // Prevent default link behavior
        // Redirect the user to the desired URL with the selected city and location as query parameters
        window.location.href = `/properties?city=${encodeURIComponent(city)}`;
    };

    const data = [
        {
            category: "Company",
            items: [
                { name: "About Us", link: "/about-us" },
                { name: "Create A Listing", link: "/place-an-ad" },
                { name: "Terms of Use", link: "/terms-and-conditions" },
            ],
        },
        {
            category: "UAE",
            items: [
                { name: "Dubai", link: "#", onClick: (e) => handleCityClick(e, 'Dubai') },
                { name: "Abu Dhabi", link: "#", onClick: (e) => handleCityClick(e, 'Abu Dhabi') },
                { name: "Ras Al Khaimah", link: "#", onClick: (e) => handleCityClick(e, 'Ras Al Khaimah') },
                { name: "Sharjah", link: "#", onClick: (e) => handleCityClick(e, 'Sharjah') },
                { name: "Fujairah", link: "#", onClick: (e) => handleCityClick(e, 'Fujairah') },
                { name: "Ajman", link: "#", onClick: (e) => handleCityClick(e, 'Ajman') },
                { name: "Umm Al Quwain", link: "#", onClick: (e) => handleCityClick(e, 'Umm Al Quwain') },
                { name: "Al Ain", link: "#", onClick: (e) => handleCityClick(e, 'Al Ain') },
            ],
        },
        {
            category: "Support",
            items: [
                { name: "Contact Us", link: "/contact-us" },
                { name: "Consultant", link: "/ConsultancyPage" },
            ],
        },
    ];

    return (
        <footer className="bg-primary py-8 px-4 lg:px-0 text-primary font-aller font-light shadow-lg">
            <div className="container mx-auto">
                {/* Footer content for larger screens */}
                <div className="hidden lg:flex lg:justify-between font-aller font-light pb-6">
                    {data.map((footerItem, index) => (
                        <div key={index} className="flex-1">
                            <h3 className="text-base font-aller font-bold mb-4 text-primary">
                                {footerItem.category}
                            </h3>
                            <ul className="space-y-1">
                                {footerItem.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>
                                        <a
                                            className="text-sm text-primary hover:underline"
                                            href={item.link}
                                            onClick={item.onClick}
                                        >
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Footer content for smaller screens */}
                <div className="lg:hidden grid grid-cols-2 gap-4 pb-6 font-aller font-light">
                    {data.map((footerItem, index) => (
                        <div key={index}>
                            <h3 className="text-base font-aller font-bold mb-2 text-primary">
                                {footerItem.category}
                            </h3>
                            <ul className="space-y-1">
                                {footerItem.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>
                                        <a
                                            className="text-sm text-primary hover:underline"
                                            href={item.link}
                                            onClick={item.onClick}
                                        >
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Footer Bottom Section */}
                <div className="mt-6 flex flex-col items-center font-aller font-light lg:items-start lg:flex-row justify-between">
                    <div className="flex items-center space-x-4">
                        <img className="w-32" src={logoDark} alt="Logo" />
                        <small className="text-primary text-center lg:text-left mt-4 lg:mt-0">
                            &copy; InvestiBayt.com {new Date().getFullYear()}, All Rights Reserved.
                        </small>
                    </div>
                </div>
            </div>
        </footer>
    );
}
