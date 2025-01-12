import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from '../components/Card/Card';
import Banner from "../components/Banner/Banner"; // Assuming the banner is a separate component

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
    const city = queryParams.get("city") || "";
    const location = queryParams.get("location") || "";
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        let url = `https://backend-git-main-pawan-togas-projects.vercel.app/api/listings?city=${encodeURIComponent(city)}`;

        if (location && location !== "All Locations") {
            url += `&location=${encodeURIComponent(location)}`;
        }

        // Adding filters directly to the URL for API-side filtering
        if (purpose !== "All") {
            url += `&purpose=${encodeURIComponent(purpose)}`;
        }
        if (propertyType !== "All") {
            url += `&propertyType=${encodeURIComponent(propertyType)}`;
        }
        if (minPrice) {
            url += `&minPrice=${encodeURIComponent(minPrice)}`;
        }
        if (maxPrice) {
            url += `&maxPrice=${encodeURIComponent(maxPrice)}`;
        }
        if (beds !== "Any") {
            url += `&beds=${encodeURIComponent(beds)}`;
        }
        if (baths !== "Any") {
            url += `&baths=${encodeURIComponent(baths)}`;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setProperties(data);
                    setFilteredProperties(data); // In case the filters are applied server-side
                } else {
                    console.error('Data format is not as expected:', data);
                    setProperties([]);
                    setFilteredProperties([]);
                }
            })
            .catch(error => {
                console.error('Error fetching properties:', error);
                setProperties([]);
                setFilteredProperties([]);
            });
    }, [city, location, purpose, propertyType, minPrice, maxPrice, beds, baths]);

    const handleSearch = () => {
        let filtered = properties;

        if (searchQuery) {
            filtered = filtered.filter(property =>
                property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredProperties(filtered);
    };

    return (
        <div className="container mx-auto p-4 font-primary">
            {/* Conditionally render Banner */}
            {!city && !location && <Banner city={city} location={location} />}

            <div className="text-center mb-8 font-primary">
                <h1 className="text-2xl sm:text-3xl font-bold text-primary">Properties in {location || "All Locations"} ({city})</h1>
            </div>

            <div className="mb-8">
                {/* Filter Toggle Button for Mobile */}
                <button
                    className="block sm:hidden bg-button text-button px-4 py-2 rounded w-full text-center"
                    onClick={() => setShowFilters(prev => !prev)}
                >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>

                  {/* Filters Section */}
  <div
    className={`${
      showFilters ? "block" : "hidden"
    } sm:flex items-center space-y-4 sm:space-y-0 sm:space-x-4 overflow-x-auto sm:overflow-visible scrollbar-hide mt-4 sm:mt-0`}
  >
    {/* Purpose */}
    <div className="flex flex-col sm:w-[160px] w-full">
      <label className="text-sm sm:text-base mb-1">Purpose</label>
      <select
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        className="text-primary p-2 text-sm sm:text-base border border-primary-400 rounded w-full"
      >
        <option value="All">All</option>
        <option value="sell">For Sale</option>
        <option value="rent">For Rent</option>
      </select>
    </div>

    {/* Property Type */}
    <div className="flex flex-col sm:w-[160px] w-full">
      <label className="text-sm sm:text-base mb-1">Property Type</label>
      <select
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
        className="text-primary p-2 text-sm sm:text-base border border-primary-400 rounded w-full"
      >
        <option value="All">All</option>
        <option value="Apartment">Apartment</option>
        <option value="Villa">Villa</option>
        <option value="Townhouse">Townhouse</option>
        <option value="Penthouse">Penthouse</option>
      </select>
    </div>

    {/* Price Range */}
    <div className="flex flex-col sm:w-[160px] w-full">
      <label className="text-sm sm:text-base mb-1">Price Range</label>
      <div className="flex space-x-2">
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="text-primary p-2 text-sm sm:text-base border border-primary-400 rounded w-full"
        />
        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="text-primary p-2 text-sm sm:text-base border border-primary-400 rounded w-full"
        />
      </div>
    </div>

    {/* Beds */}
    <div className="flex flex-col sm:w-[160px] w-full">
      <label className="text-sm sm:text-base mb-1">Beds</label>
      <select
        value={beds}
        onChange={(e) => setBeds(e.target.value)}
        className="text-primary p-2 text-sm sm:text-base border border-primary-400 rounded w-full"
      >
        <option value="Any">Any</option>
        {[...Array(5).keys()].map((i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
    </div>

    {/* Baths */}
    <div className="flex flex-col sm:w-[160px] w-full">
      <label className="text-sm sm:text-base mb-1">Baths</label>
      <select
        value={baths}
        onChange={(e) => setBaths(e.target.value)}
        className="text-primary p-2 text-sm sm:text-base border border-primary-400 rounded w-full"
      >
        <option value="Any">Any</option>
        {[...Array(5).keys()].map((i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
    </div>

    {/* Filter Button */}
    <div className="flex flex-col sm:w-[160px] w-full">
      <button
        onClick={handleSearch}
        className="p-2 text-sm sm:text-base bg-button text-button rounded w-full"
      >
        Filter
      </button>
    </div>
  </div>
</div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-primary">
                {filteredProperties.length > 0 ? (
                    filteredProperties.map(property => (
                        <Card key={property._id} item={property} />
                    ))
                ) : (
                    <p className="text-primary">No properties found for the selected criteria.</p>
                )}
            </div>
        </div>
    );
}

export default PropertiesPage;

