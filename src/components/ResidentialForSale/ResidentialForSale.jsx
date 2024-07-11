// ResidentialForSale.jsx
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Card from "../Card/Card";

export default function ResidentialForSale({ searchParams = {}, showAll, listings }) {
    const [filteredResults, setFilteredResults] = useState([]);
    const [relatedResults, setRelatedResults] = useState([]);

    useEffect(() => {
        const filtered = listings.filter((listing) => {
            return (
                (searchParams.city ? listing.city === searchParams.city : true) &&
                (searchParams.location ? listing.location.toLowerCase().includes(searchParams.location.toLowerCase()) : true) &&
                (searchParams.propertyType ? listing.propertyType === searchParams.propertyType : true) &&
                (searchParams.priceRange ? parseInt(listing.price.replace(/[^0-9]/g, "")) <= parseInt(searchParams.priceRange.replace(/[^0-9]/g, "")) : true) &&
                (searchParams.beds ? listing.beds === parseInt(searchParams.beds) : true)
            );
        });
        
        setFilteredResults(filtered);

        if (filtered.length === 0) {
            const related = listings.filter((listing) => {
                return (
                    (searchParams.city ? listing.city === searchParams.city : false) &&
                    (searchParams.propertyType ? listing.propertyType === searchParams.propertyType : false)
                );
            });
            setRelatedResults(related);
        } else {
            setRelatedResults([]);
        }
    }, [searchParams, listings]);

    return (
        <section className="py-2 px-2 lg:px-0">
            <div className="container">
                <h1 className="text-2xl font-semibold mb-5 dark:text-gray-100">
                    {searchParams.city ? `Properties in ${searchParams.city}` : "Popular Properties for Sale in UAE"}
                </h1>
                {filteredResults.length > 0 ? (
                    <Swiper
                        spaceBetween={10}
                        autoplay={{ delay: 5000 }}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            400: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 5 },
                        }}
                    >
                        {filteredResults.map((item, index) => (
                            <SwiperSlide className="mb-10" key={index}>
                                <Card item={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <>
                        <p className="text-center dark:text-gray-400">No properties match your search criteria.</p>
                        {relatedResults.length > 0 && (
                            <>
                                <h2 className="text-xl font-semibold mt-8 dark:text-gray-100">
                                    Related Properties in {searchParams.city} - {searchParams.propertyType}
                                </h2>
                                <Swiper
                                    spaceBetween={10}
                                    autoplay={{ delay: 5000 }}
                                    pagination={{ clickable: true }}
                                    breakpoints={{
                                        400: { slidesPerView: 2 },
                                        768: { slidesPerView: 3 },
                                        1024: { slidesPerView: 5 },
                                    }}
                                >
                                    {relatedResults.map((item, index) => (
                                        <SwiperSlide className="mb-10" key={index}>
                                            <Card item={item} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
