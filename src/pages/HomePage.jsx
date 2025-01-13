import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner/Banner";
import ResidentialForSale from "../components/ResidentialForSale/ResidentialForSale";
import ListingsContext from "../contexts/ListingsContext";

export default function HomePage() {
    const { listings, setListings } = useContext(ListingsContext); // Assuming you have a setListings method in your context
    const [searchParams, setSearchParams] = useState({});
    const [showAllListings, setShowAllListings] = useState(false);
    const [loading, setLoading] = useState(false); // New loading state
    const [submitted, setSubmitted] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Automatically fetch listings on page load
        handleDisplayAllListings();
    }, []);

    const handleSearch = (query) => {
        setSearchParams(query);
        setShowAllListings(false);
        // console.log('Query: ',query)
    };

const handleDisplayAllListings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token'); // Retrieve token if available
            const headers = token
                ? { Authorization: `Bearer ${JSON.parse(token)}` }
                : {};
            
            const response = await fetch(
                'https://backend-git-main-pawan-togas-projects.vercel.app/api/listings',
                {
                    headers,
                }
            );

            if (!response.ok) {
                throw new Error(`Error fetching listings: ${response.statusText}`);
            }

            const data = await response.json();
            if (data && Array.isArray(data)) {
                setListings(data);
            } else {
                console.error("Unexpected data format:", data);
            }
            setShowAllListings(true);
        } catch (error) {
            console.error("Failed to fetch listings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceAnAd = () => {
        navigate("/place-an-ad");
    };

    const handleEditProperty = (id) => {
        if (/^[0-9a-fA-F]{24}$/.test(id)) {
            navigate(`/edit-property/${id}`);
        } else {
            console.error("Invalid property ID");
        }
    };

    const handleDeleteProperty = async (id) => {
        try {
            const response = await fetch(`https://backend-git-main-pawan-togas-projects.vercel.app/api/listings/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const result = await response.json();
            // console.log("Listing deleted:", result);

            // Set the submitted state to true and set the delete message
            setSubmitted(true);
            setDeleteMessage("Your ad has been deleted successfully!");
            // Remove the deleted listing from the state
            setListings((prevListings) => prevListings.filter((listing) => listing._id !== id));

        } catch (error) {
            console.error("Failed to delete listing:", error);
        }
    };

    if (submitted) {
        return (
            <div className="container mx-auto p-4 bg-primary text-primary font-aller font-light">
                <div className="text-center bg-primary text-primary p-4 rounded">
                    {deleteMessage}
                </div>
                <div className="flex justify-center mt-4 font-aller font-light">
                    <button onClick={() => { setSubmitted(false); navigate("/"); }} className="px-6 py-3 bg-green-600 text-white rounded">
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }
    let refreshTimeout;

    // Function to start the refresh timeout
    function startTokenRefreshTimer(expiryTime) {
        // Clear any existing timeouts
        clearTimeout(refreshTimeout);
    
        // Calculate time remaining (e.g., refresh 5 minutes before expiry)
        const timeRemaining = expiryTime - Date.now() - (5 * 60 * 1000);
     // Get the user from localStorage
     const user = localStorage.getItem('user');
     // Parse the string back into an object
     const parsedUser = JSON.parse(user);
     // Now you can access the token
     const token = parsedUser.token;
     // console.log('user:', parsedUser);
     // console.log('token:', token);
 
        // Set timeout to refresh token
        refreshTimeout = setTimeout(() => {
            fetch('https://backend-git-main-pawan-togas-projects.vercel.app/api/refresh-token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    startTokenRefreshTimer(Date.now() + 3600000); // Restart timer with new expiry
                }
            })
            .catch(error => {
                console.error('Token refresh error:', error);
                // Handle error, possibly force logout
            });
        }, timeRemaining);
    }
    
    // Start the timer when the user logs in or refreshes the page
    document.addEventListener('DOMContentLoaded', () => {
        const token = localStorage.getItem('token');
        if (token) {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            startTokenRefreshTimer(tokenData.exp * 1000);
        }
    });
    
    return (
        <div className="bg-primary min-h-screen font-aller font-light">
            <Banner
                onSearch={handleSearch}
                onDisplayAllListings={handleDisplayAllListings}
                onPlaceAnAd={handlePlaceAnAd}
            />
            {loading ? (
                <div className="text-center text-primary">Loading...</div>
            ) : (
                <ResidentialForSale
                    searchParams={searchParams}
                    showAll={showAllListings}
                    listings={listings}
                    onEditProperty={handleEditProperty}
                    onDeleteProperty={handleDeleteProperty}
                />
            )}
        </div>
    );
}
