import React, { useState,useEffect } from "react";
import saleProperty from "../../assets/icons/sale-property.svg";
import inputSearch from "../../assets/icons/input-search.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Banner({ onSearch, onPlaceAnAd }) {
    const [city, setCity] = useState("");
    const [locations, setLocations] = useState([]);
    const [propertyType, setPropertyType] = useState("");
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const [beds, setBeds] = useState("");
    const [baths, setBaths] = useState("");
    const [agentType, setAgentType] = useState("");
    const [status, setStatus] = useState("");
    const [purpose, setPurpose] = useState("");
    const [locationCounts, setLocationCounts] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640 ) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Set the initial state on component mount

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
      if (city) {
          fetch(`https://backend-git-main-pawan-togas-projects.vercel.app/api/listings/${city}`)
              .then(response => response.json())
              .then(data => {
                  const locationMap = data.reduce((acc, property) => {
                      const location = property.location;
                      if (location) {
                          if (!acc[location]) {
                              acc[location] = { location: location, count: 0 };
                          }
                          acc[location].count += 1;
                      }
                      return acc;
                  }, {});

                  const groupedLocations = Object.values(locationMap);
                  setLocationCounts(groupedLocations);
              })
              .catch(error => console.error('Error fetching location counts:', error));
      } else {
          setLocationCounts([]);
      }
  }, [city]);
    
    
    const totalProperties = locationCounts.reduce((total, loc) => {
        return total + (typeof loc.count === 'number' ? loc.count : 0);
    }, 0);
    // Check if any filters are applied
  const isFilterApplied = city || locations.length > 0 || propertyType || priceMin || priceMax || beds || baths;

  const handleSearch = (event) => {
    event.preventDefault();
    const searchParams = {
        city: city || "",
        location: locations.join(",") || "",
        propertyType: propertyType || "",
        priceMin: priceMin || "",
        priceMax: priceMax || "",
        beds: beds || "",
        baths: baths || "",
        agentType: agentType || "",
        status: status !== "" ? status : "", // Include status if present
        purpose: purpose || ""
    };

    const queryString = new URLSearchParams(searchParams).toString();
    navigate(`/properties?${queryString}`);
};
    
    
const handleAddLocation = (e) => {
  const value = e.target.value.trim();
  // If a key press happens and it's not "Enter", or if the user clicks away, add the location
  if (value && (e.key === "Enter" || e.key === "Tab")) {
      setLocations((prevLocations) => {
          if (!prevLocations.includes(value)) {
              return [...prevLocations, value];
          }
          return prevLocations; // Don't add duplicates
      });
      e.target.value = ""; // Reset input after adding the location
  }
};

    const handleRemoveLocation = (index) => {
        const updatedLocations = [...locations];
        updatedLocations.splice(index, 1);
        setLocations(updatedLocations);
    };

    const handleClearFilters = () => {
        setCity("");
        setLocations([]);
        setPropertyType("");
        setPriceMin("");
        setPriceMax("");
        setBeds("");
        setBaths("");
        setAgentType("");
        setStatus("");
        setPurpose("");
    };

    const handleSaleClick = () => {
        setPurpose("sell"); // For sale, set the purpose to 'sell'
        onSearch({ purpose: "sell" }); // Trigger search with purpose 'sell'
    };
    
    const handleRentClick = () => {
        setPurpose("buy"); // For rent, set the purpose to 'buy'
        onSearch({ purpose: "buy" }); // Trigger search with purpose 'buy'
    };
    
    const handleOffPlanClick = () => {
        const searchParams = {
            city: city || "",
            location: locations.join(",") || "",
            propertyType: propertyType || "",
            priceMin: priceMin || "",
            priceMax: priceMax || "",
            beds: beds || "",
            baths: baths || "",
            agentType: agentType || "",
            status: "false", // This ensures that only off-plan properties are shown
            purpose: purpose || ""
        };
    
        // console.log("Searching for off-plan properties with parameters:", searchParams); // Add this to inspect search parameters
    
        onSearch(searchParams); // Pass the search params including the status=false for off-plan properties
    };
    
    
    
    
    
    const handleLocationClick = (location) => {
        const query = new URLSearchParams({
            city,
            location,
        }).toString();
        window.location.href = `/properties?${query}`;
    };

    return (
        <section>
 <div
                className={`container font-primary lg:relative lg:bg-right lg:bg-no-repeat lg:bg-[length:50%] lg:my-2 lg:pt-10 rounded-md ${
                    !isMobile ? "bg-banner" : ""
                }`}
                style={{
                    backgroundImage: !isMobile ? "url('/bg-remove.png')" : "none",
                    backgroundPosition: "top right",
                }}
            >

        <div className="lg:bg-banner lg:bg-opacity-50 rounded-md lg:p-4 lg:w-[88%] mx-auto">
        <div className="flex flex-wrap justify-center items-center space-x-4 lg:space-x-10 mb-8">
  <ul className="flex flex-wrap justify-center items-center gap-2 lg:gap-6 text-sm sm:text-base">
    <li>
      <button
        className="bg-primary text-primary hover:bg-primary-dark transition duration-300 px-4 py-2 sm:px-6 sm:py-2 rounded-full font-semibold shadow-md"
        onClick={handleSaleClick}
      >
        Sale
      </button>
    </li>
    <li>
      <button
        className="bg-primary text-primary hover:bg-primary-dark transition duration-300 px-4 py-2 sm:px-6 sm:py-2 rounded-full font-semibold shadow-md"
        onClick={handleRentClick}
      >
        Rent
      </button>
    </li>
    <li>
      <button
        className="bg-primary text-primary hover:bg-primary-dark  transition duration-300 px-4 py-2 sm:px-6 sm:py-2 rounded-full font-semibold shadow-md"
        onClick={handleOffPlanClick}
      >
        Off-Plan
      </button>
    </li>
    <li>
      <Link
        className="bg-primary text-primary hover:bg-primary-dark transition duration-300 px-4 py-2 sm:px-6 sm:py-2 rounded-full font-semibold shadow-md"
        to="/place-an-ad"
      >
        Create A Listing
      </Link>
    </li>
  </ul>
</div>

<h1 className="text-5xl text-left font-primary text-primary mt-28 lg:text-primary lg:mb-8">
  Your <span className="animate-blink font-bold">InvestiBayt</span> <br /> Journey Starts Here
</h1>

<form
      className="px-3 py-3 bg-primary rounded-lg lg:grid lg:grid-cols-8 lg:gap-4"
      onSubmit={handleSearch}
    >
      {/* Toggle Filters Button for Mobile */}
      <button
        type="button"
        className="lg:hidden bg-button text-button hover:bg-primary-dark transition duration-300 px-4 py-2 rounded-full font-semibold shadow-md w-full mb-3"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Filter Fields Container */}
      <div
        className={`${
          showFilters ? "block" : "hidden"
        } lg:block lg:contents space-y-4 lg:space-y-0`}
      >
        {/* City Filter */}
        <div className="flex flex-col w-full">
          <label className="mb-1 text-sm font-medium text-primary">City</label>
          <select
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 h-10 rounded-md border border-primary text-sm text-primary w-full"
          >
            <option value="">Any</option>
            <option value="Dubai">Dubai</option>
            <option value="Abu Dhabi">Abu Dhabi</option>
            <option value="Sharjah">Sharjah</option>
            <option value="Ajman">Ajman</option>
            <option value="Fujairah">Fujairah</option>
            <option value="Ras Al Khaimah">Ras Al Khaimah</option>
            <option value="Umm Al Quwain">Umm Al Quwain</option>
          </select>
        </div>

        {/* Locations */}
        <div className="flex flex-col w-full">
                                <label className="mb-1 text-sm font-medium text-primary">Location</label>
                                <input
                                    type="text"
                                    placeholder="Add Location"
                                    onKeyUp={handleAddLocation}
                                    className="p-2 h-10 rounded-md border border-primary text-sm text-primary w-full"
                                />
                                <div className="mt-2">
                                    {locations.map((location, index) => (
                                        <span
                                            key={index}
                                            className="bg-primary text-white text-xs px-2 py-1 rounded-full m-1"
                                        >
                                            {location}{" "}
                                            <button
                                                className="text-xs ml-1"
                                                type="button"
                                                onClick={() => handleRemoveLocation(index)}
                                            >
                                                X
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
        {/* Property Type Filter */}
        <div className="flex flex-col w-full">
          <label className="mb-1 text-sm font-medium text-primary">Property Type</label>
          <select
            name="propertyType"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="p-2 h-10 rounded-md border border-primary text-sm text-primary w-full"
          >
            <option value="">Any</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Penthouse">Penthouse</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="flex flex-col w-full">
          <label className="mb-1 text-sm font-medium text-primary">Price Range</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="p-2 h-10 rounded-md text-primary border border-primary focus:ring-2 focus:ring-gray-500 outline-none w-1/2"
            />
            <input
              type="text"
              placeholder="max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="p-2 h-10 rounded-md text-primary border border-primary focus:ring-2 focus:ring-gray-500 outline-none w-1/2"
            />
          </div>
        </div>

        {/* Beds Filter */}
        <div className="flex flex-col w-full">
          <label className="mb-1 text-sm font-medium text-primary">Beds</label>
          <select
            name="beds"
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
            className="p-2 h-10 rounded-md border border-primary text-sm text-primary w-full"
          >
            <option value="">Any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Baths Filter */}
        <div className="flex flex-col w-full">
          <label className="mb-1 text-sm font-medium text-primary">Baths</label>
          <select
            name="baths"
            value={baths}
            onChange={(e) => setBaths(e.target.value)}
            className="p-2 h-10 rounded-md border border-primary text-sm text-primary w-full"
          >
            <option value="">Any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </div>
        {/* Search and Clear Filters Buttons */}
      <div className="flex items-center gap-4 w-full col-span-2 mt-auto">
        <button
          type="submit"
          className="bg-button text-button hover:bg-primary-dark transition duration-300 px-4 py-2 rounded-full font-semibold shadow-md w-full"
        >
          Search
        </button>
        {isFilterApplied && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="bg-primary-dark text-primary hover:bg-primary transition duration-300 px-4 py-2 rounded-full font-semibold shadow-md"
          >
            Clear
          </button>
        )}
      </div>
      </div>

      
    </form>
                </div>

            </div>
            {city && locationCounts.length > 0 && (
    <div className="bg-primary font-primary pl-14">
        <h2 className="text-xl font-semibold text-primary font-primary">
            Properties by Location in {city}. {totalProperties} Ads
        </h2>
        <div className="mt-2 flex overflow-x-auto space-x-2">
            {locationCounts.map((loc, index) => (
                <div
                    key={index}
                    className="flex-shrink-0 font-playfair items-center px-4 py-2 rounded shadow-md cursor-pointer text-primary bg-white"
                    onClick={() => handleLocationClick(loc.location)}
                    style={{ minWidth: '150px' }}
                >
                    <span className="mr-2 font-playfair truncate max-w-[120px]">
                        {loc.location.split(' ').slice(0, 2).join(' ')}
                    </span>
                    <span className="text-primary font-playfair">({loc.count})</span>
                </div>
            ))}
        </div>
    </div>
)}

        </section>
    );
}