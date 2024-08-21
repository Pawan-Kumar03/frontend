import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from '../components/Card/Card';

function PropertiesPage() {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [purpose, setPurpose] = useState("All");
    const [propertyType, setPropertyType] = useState("All");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [beds, setBeds] = useState("Any");
    const [baths, setBaths] = useState("Any");
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const city = queryParams.get("city");
    const location = queryParams.get("location");

    useEffect(() => {
        if (city && location) {
            fetch(`https://backend-git-main-pawan-togas-projects.vercel.app/api/listings?city=${city}&location=${encodeURIComponent(location)}`)
                .then(response => response.json())
                .then(data => {
                    const filtered = data.filter(property => property.location.toLowerCase() === location.toLowerCase());
                    setProperties(filtered);
                    setFilteredProperties(filtered);
                })
                .catch(error => console.error('Error fetching properties:', error));
        }
    }, [city, location]);

    const handleSearch = () => {
        let filtered = properties;

        if (searchQuery) {
            filtered = filtered.filter(property => 
                property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (purpose !== "All") {
            filtered = filtered.filter(property => property.purpose === purpose);
        }

        if (propertyType !== "All") {
            filtered = filtered.filter(property => property.propertyType === propertyType);
        }

        if (minPrice) {
            filtered = filtered.filter(property => parseInt(property.price.replace(/[^\d]/g, ''), 10) >= parseInt(minPrice, 10));
        }

        if (maxPrice) {
            filtered = filtered.filter(property => parseInt(property.price.replace(/[^\d]/g, ''), 10) <= parseInt(maxPrice, 10));
        }

        if (beds !== "Any") {
            filtered = filtered.filter(property => property.beds === parseInt(beds, 10));
        }

        if (baths !== "Any") {
            filtered = filtered.filter(property => property.baths === parseInt(baths, 10));
        }

        setFilteredProperties(filtered);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-custom">Properties in {location} ({city})</h1>
            </div>
            
            <div className="mb-8 flex flex-col sm:flex-wrap sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 text-custom">
                <div className="flex flex-col w-full sm:w-auto">
                    <label className="text-sm sm:text-base">Purpose</label>
                    <select
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className="p-2 text-sm sm:text-base border border-gray-300 rounded"
                    >
                        <option value="All">All</option>
                        <option value="Sale">For Sale</option>
                        <option value="Rent">For Rent</option>
                    </select>
                </div>

                <div className="flex flex-col w-full sm:w-auto">
                    <label className="text-sm sm:text-base">Property Type</label>
                    <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="p-2 text-sm sm:text-base border border-gray-300 rounded"
                    >
                        <option value="All">All</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Penthouse">Penthouse</option>
                    </select>
                </div>

                <div className="flex flex-col w-full sm:w-auto">
                    <label className="text-sm sm:text-base">Price Range</label>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="p-2 text-sm sm:text-base border border-gray-300 rounded w-full sm:w-auto"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="p-2 text-sm sm:text-base border border-gray-300 rounded w-full sm:w-auto"
                        />
                    </div>
                </div>

                <div className="flex flex-col w-full sm:w-auto">
                    <label className="text-sm sm:text-base">Beds</label>
                    <select
                        value={beds}
                        onChange={(e) => setBeds(e.target.value)}
                        className="p-2 text-sm sm:text-base border border-gray-300 rounded"
                    >
                        <option value="Any">Any</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>

                <div className="flex flex-col w-full sm:w-auto">
                    <label className="text-sm sm:text-base">Baths</label>
                    <select
                        value={baths}
                        onChange={(e) => setBaths(e.target.value)}
                        className="p-2 text-sm sm:text-base border border-gray-300 rounded"
                    >
                        <option value="Any">Any</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>

                <div className="flex flex-col w-full sm:w-auto justify-end">
                    <button
                        onClick={handleSearch}
                        className="p-2 text-sm sm:text-base bg-custom text-black rounded"
                    >
                        Filter
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProperties.map((property) => (
                    <Card key={property._id} item={property} />
                ))}
            </div>
        </div>
    );
}

export default PropertiesPage;