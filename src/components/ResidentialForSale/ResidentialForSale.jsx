import React, { useState, useEffect } from "react";
import Card from "../Card/Card";

export default function ResidentialForSale({ searchParams = {}, listings = [] }) {
    const [filteredResults, setFilteredResults] = useState([]);
    const [relatedResults, setRelatedResults] = useState([]);
    const [isVertical, setIsVertical] = useState(false); // State to toggle between horizontal and vertical layouts

    useEffect(() => {
        const isEmptySearch = Object.values(searchParams).every((param) => param === "");

        const filtered = Array.isArray(listings)
            ? listings.filter((listing) => {
                  const listingPrice = parseInt(listing.price.replace(/[^0-9]/g, ""));
                  const minPrice = searchParams.priceMin ? parseInt(searchParams.priceMin) : 0;
                  const maxPrice = searchParams.priceMax ? parseInt(searchParams.priceMax) : Infinity;

                  return (
                      (searchParams.city ? listing.city === searchParams.city : true) &&
                      (searchParams.location
                          ? searchParams.location.split(",").some((loc) =>
                                listing.location.toLowerCase().includes(loc.trim().toLowerCase())
                            )
                          : true) &&
                      (searchParams.propertyType ? listing.propertyType === searchParams.propertyType : true) &&
                      listingPrice >= minPrice &&
                      listingPrice <= maxPrice &&
                      (searchParams.beds
                          ? searchParams.beds === "5"
                              ? listing.beds >= 5
                              : listing.beds === parseInt(searchParams.beds)
                          : true) &&
                      (searchParams.baths
                          ? searchParams.baths === "5"
                              ? listing.baths >= 5
                              : listing.baths === parseInt(searchParams.baths)
                          : true) &&
                      (searchParams.status === "false" ? listing.status === "false" : "true") &&
                      (searchParams.purpose ? listing.purpose === searchParams.purpose : true) &&
                      (searchParams.agentType
                          ? searchParams.agentType === "Owner"
                              ? listing.landlordName
                              : listing.agentName
                          : true)
                  );
              })
            : [];

        setFilteredResults(isEmptySearch ? listings : filtered);

        if (filtered.length === 0 && !isEmptySearch) {
            const related = Array.isArray(listings)
                ? listings.filter((listing) => {
                      return (
                          (searchParams.city ? listing.city === searchParams.city : false) ||
                          (searchParams.propertyType ? listing.propertyType === searchParams.propertyType : false)
                      );
                  })
                : [];
            setRelatedResults(related);
        } else {
            setRelatedResults([]);
        }

        // Set vertical layout only after a search
        if (!isEmptySearch) {
            setIsVertical(true);
        } else {
            setIsVertical(false);
        }
    }, [searchParams, listings]);

    return (
        <section className="py-8 px-4 lg:px-0 bg-primary font-primary text-primary">
            <div className="container mx-auto font-primary">
                <h1 className="text-3xl font-bold mb-6 text-primary font-primary flex justify-between items-center relative">
                    <span>
                        {searchParams.city
                            ? `Properties in ${searchParams.city}`
                            : "Popular Developments"}
                    </span>
                    {isVertical ? (
                        <span className="absolute right-0 text-primary text-2xl animate-bounce">↓</span>
                    ) : (
                        <span className="absolute right-0 text-primary text-2xl animate-bounce">→</span>
                    )}
                </h1>

                {filteredResults.length > 0 ? (
                    <div
                        className={`${
                            isVertical
                                ? "grid grid-cols-1 lg:grid-cols-2 gap-6" // Vertical layout: 2 cards per row on large screens
                                : "flex overflow-x-scroll space-x-4" // Horizontal layout with scrolling
                        }`}
                    >
                        {filteredResults.map((item, index) => (
                            <div
                                key={index}
                                className={`${!isVertical ? "min-w-[300px]" : ""}`} // For horizontal layout, set card width
                            >
                                <Card item={item} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <p className="text-center text-primary font-primary">
                            No properties match your search criteria.
                        </p>
                        {relatedResults.length > 0 && (
                            <>
                                <h2 className="text-2xl font-semibold mt-8 text-primary font-primary">
                                    Related Properties in {searchParams.city} - {searchParams.propertyType}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {relatedResults.map((item, index) => (
                                        <div key={index}>
                                            <Card item={item} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
