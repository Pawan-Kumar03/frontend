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
    const city = queryParams.get("city") || "All Cities";
    const location = queryParams.get("location") || "All Locations";
    const [showFilters, setShowFilters] = useState(false);
   
    useEffect(() => {
        let url = `https://backend-git-main-pawan-togas-projects.vercel.app/api/listings?city=${encodeURIComponent(city)}`;

        if (location !== "All Locations") {
            url += `&location=${encodeURIComponent(location)}`;
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
                    setFilteredProperties(data);
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
            filtered = filtered.filter(property => 
                parseInt(property.price.replace(/[^\d]/g, ''), 10) >= parseInt(minPrice, 10)
            );
        }
    
        if (maxPrice) {
            filtered = filtered.filter(property => 
                parseInt(property.price.replace(/[^\d]/g, ''), 10) <= parseInt(maxPrice, 10)
            );
        }
    
        if (beds !== "Any") {
            filtered = filtered.filter(property => property.beds === parseInt(beds));
        }
    
        if (baths !== "Any") {
            filtered = filtered.filter(property => property.baths === parseInt(baths));
        }
    
        setFilteredProperties(filtered);
    };    
   

    return (
      <div className="container mx-auto p-4 font-primary">
          {/* Banner Section */}
          <Banner city={city} location={location} />
  
          {/* Page Title */}
          <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                  Properties in {location} ({city})
              </h1>
          </div>
  
          {/* Filter Section */}
          <div className="mb-8">
              {/* Show/Hide Filters Button for Mobile */}
              <button
                  className="block sm:hidden bg-button text-button px-4 py-2 rounded w-full text-center"
                  onClick={() => setShowFilters((prev) => !prev)}
              >
                  {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
  
              {/* Filters */}
              <div
                  className={`${
                      showFilters ? "block" : "hidden"
                  } sm:flex items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0`}
              >
                  {/* Purpose Filter */}
                  <div className="flex flex-col sm:w-[160px] w-full">
                      <label className="text-sm sm:text-base mb-1">Purpose</label>
                      <select
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                          className="text-primary p-2 border border-primary-400 rounded"
                      >
                          <option value="All">All</option>
                          <option value="sell">For Sale</option>
                          <option value="rent">For Rent</option>
                      </select>
                  </div>
  
                  {/* Additional Filters (Example: Price Range) */}
                  <div className="flex flex-col sm:w-[160px] w-full">
                      <label className="text-sm sm:text-base mb-1">Price Range</label>
                      <input
                          type="number"
                          placeholder="Min Price"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="mb-2 sm:mb-0 text-primary p-2 border border-primary-400 rounded"
                      />
                      <input
                          type="number"
                          placeholder="Max Price"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="text-primary p-2 border border-primary-400 rounded"
                      />
                  </div>
  
                  {/* Beds Filter */}
                  <div className="flex flex-col sm:w-[160px] w-full">
                      <label className="text-sm sm:text-base mb-1">Beds</label>
                      <select
                          value={beds}
                          onChange={(e) => setBeds(e.target.value)}
                          className="text-primary p-2 border border-primary-400 rounded"
                      >
                          <option value="Any">Any</option>
                          <option value="1">1+</option>
                          <option value="2">2+</option>
                          <option value="3">3+</option>
                          <option value="4">4+</option>
                          <option value="5">5+</option>
                      </select>
                  </div>
              </div>
  
              {/* Apply Filters Button */}
              <button
                  onClick={handleSearch}
                  className="mt-4 p-2 bg-button text-button rounded w-full sm:w-auto"
              >
                  Apply Filters
              </button>
          </div>
  
          {/* Properties Display Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                      <Card key={property._id} item={property} />
                  ))
              ) : (
                  <p className="text-primary">
                      No properties found for the selected criteria.
                  </p>
              )}
          </div>
      </div>
  );
  
}

export default PropertiesPage;
