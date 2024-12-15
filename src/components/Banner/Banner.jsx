import React, { useState,useEffect } from "react";
import saleProperty from "../../assets/icons/sale-property.svg";
import inputSearch from "../../assets/icons/input-search.svg";
import { Link } from "react-router-dom";

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

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 769 ) {
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
                    // console.log(data); // Inspect the API response
    
                    // Grouping properties by location
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
    
                    // Convert the grouped data back to an array
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
            status: status !== "" ? status : "", // Ensure status is included in the search
            purpose: purpose || ""
        };
        onSearch(searchParams); // Pass searchParams to onSearch function
    };
    
    
    const handleAddLocation = (e) => {
        if (e.key === "Enter" && e.target.value.trim() !== "") {
            setLocations([...locations, e.target.value.trim()]);
            e.target.value = "";
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
    className="flex flex-wrap items-center gap-4 px-4 py-6 lg:gap-6 bg-primary lg:bg-transparent lg:justify-between"
    onSubmit={handleSearch}
>
    {/* City Input */}
    <div className="flex flex-col flex-grow max-w-[200px]">
        <label className="mb-1 font-playfair text-primary">City</label>
        <select
            className="w-full p-3 h-12 rounded-md"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
        >
            <option value="">Select City</option>
            <option value="Dubai">Dubai</option>
            <option value="Abu Dhabi">Abu Dhabi</option>
            <option value="Sharjah">Sharjah</option>
            <option value="Ajman">Ajman</option>
            <option value="Fujairah">Fujairah</option>
            <option value="Ras Al Khaimah">Ras Al Khaimah</option>
            <option value="Umm Al Quwain">Umm Al Quwain</option>
        </select>
    </div>

    {/* Location Input */}
    <div className="flex flex-col flex-grow max-w-[250px]">
        <label className="mb-1 font-playfair text-primary">Location</label>
        <div className="flex items-center">
            <input
                type="text"
                placeholder="Add location and press Enter"
                onKeyPress={handleAddLocation}
                className="flex-grow p-3 h-12 text-primary rounded-md border border-primary"
            />
            {locations.map((loc, index) => (
                <div
                    key={index}
                    className="flex items-center ml-2 bg-primary px-2 py-1 rounded-full"
                >
                    <span className="text-sm">{loc}</span>
                    <button
                        type="button"
                        onClick={() => handleRemoveLocation(index)}
                        className="ml-1 text-red-600"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    </div>

    {/* Property Type */}
    <div className="flex flex-col flex-grow max-w-[200px]">
        <label className="mb-1 font-playfair text-primary">Property Type</label>
        <select
            className="w-full p-3 h-12 rounded-md"
            name="propertyType"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
        >
            <option value="">Select Property Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
        </select>
    </div>

    {/* Price Min and Max */}
    <div className="flex gap-4 flex-grow">
        <div className="flex flex-col max-w-[120px]">
            <label className="mb-1 font-playfair text-primary">Price Min</label>
            <input
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="p-3 h-12 rounded-md"
            />
        </div>
        <div className="flex flex-col max-w-[120px]">
            <label className="mb-1 font-playfair text-primary">Price Max</label>
            <input
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="p-3 h-12 rounded-md"
            />
        </div>
    </div>

    {/* Beds and Baths */}
    <div className="flex gap-4 flex-grow">
        <div className="flex flex-col max-w-[120px]">
            <label className="mb-1 text-primary font-playfair">Beds</label>
            <select
                className="p-3 h-12 rounded-md"
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
            >
                <option value="">Select Beds</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5+">5+</option>
            </select>
        </div>
        <div className="flex flex-col max-w-[120px]">
            <label className="mb-1 text-primary font-playfair">Baths</label>
            <select
                className="p-3 h-12 rounded-md"
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
            >
                <option value="">Select Baths</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5+">5+</option>
            </select>
        </div>
    </div>

    {/* Buttons */}
    <div className="flex flex-col flex-grow max-w-[200px] items-center">
        <button
            type="submit"
            className="w-full p-3 rounded-md bg-primary-dark text-white font-semibold shadow-md"
        >
            Search
        </button>
        <button
            type="button"
            onClick={handleClearFilters}
            className="w-full mt-2 p-2 rounded-md bg-primary text-primary font-semibold"
        >
            Clear Filters
        </button>
    </div>
</form>



                </div>

            </div>
            {city && locationCounts.length > 0 && (
    <div className=" bg-primary font-primary pl-14">
        <h2 className="text-xl font-semibold  text-primary font-primary">
            Properties by Location in {city}. {totalProperties} Ads
        </h2>
        <ul className="mt-2 flex flex-wrap gap-2 text-black">
            {locationCounts.map((loc, index) => (
                <li 
                    key={index}
                    className="flex  font-playfair items-center px-4 rounded shadow-md cursor-pointer text-primary"
                    onClick={() => handleLocationClick(loc.location)}
                >
                    <span className="mr-2 font-playfair truncate max-w-[120px]">{loc.location.split(' ').slice(0, 2).join(' ')}</span>
                    <span className="text-primary font-playfair">( {loc.count} )</span>
                </li>
            ))}
        </ul>
    </div>
)}
        </section>
    );
}

