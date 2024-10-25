import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ListingsContext from "../contexts/ListingsContext";
import AuthContext from "../contexts/UserContext";

export default function PropertyDetails() {
    const { id } = useParams();
    const { listings, setListings } = useContext(ListingsContext);
    const { user } = useContext(AuthContext); // Get the logged-in user
    const [property, setProperty] = useState(null);
    const [isDeleted, setIsDeleted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const selectedProperty = listings.find((listing) => listing._id === id);
        if (selectedProperty) {
            setProperty(selectedProperty);
        } else {
            const fetchProperty = async () => {
                try {
                    const response = await fetch(`https://backend-git-main-pawan-togas-projects.vercel.app/api/listings/${id}`);
                    if (!response.ok) {
                        throw new Error('Property not found');
                    }
                    const data = await response.json();
                    setProperty(data);
                } catch (error) {
                    console.error("Failed to fetch property:", error);
                }
            };
            fetchProperty();
        }
    }, [id, listings]);

    const handleEditProperty = () => {
        navigate(`/edit-property/${property._id}`);
    };

    const handleDeleteProperty = async () => {
       // Get the user from localStorage
       const user = localStorage.getItem('user');
       // Parse the string back into an object
       const parsedUser = JSON.parse(user);
       // Now you can access the token
       const token = parsedUser.token;
       // console.log('user:', parsedUser);
       // console.log('token:', token);
     if (window.confirm("Are you sure you want to delete this property?")) {
            try {
                const response = await fetch(`https://backend-git-main-pawan-togas-projects.vercel.app/api/listings/${property._id}`, {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }

                setIsDeleted(true);
                setListings(prevListings => prevListings.filter(listing => listing._id !== property._id));

                setTimeout(() => {
                    navigate("/");
                }, 2000);

            } catch (error) {
                console.error("Failed to delete listing:", error);
            }
        }
    };

    const handleContactBroker = (contactMethod) => {
        if (!property) return;
    
        // Generate the property URL
        const propertyLink = `${window.location.origin}/property/${property._id}`;
    
        // Update the message to include the property link
        const message = `Property Details:\n\nTitle: ${property.title}\nPrice: ${property.price}\nCity: ${property.city}\nLocation: ${property.location}\nProperty Type: ${property.propertyType}\nBeds: ${property.beds}\n\nProperty Link: ${propertyLink}`;
    
        switch (contactMethod) {
            case 'Email':
                const emailSubject = `Interested in ${property.title}`;
                const mailtoLink = `mailto:${property.agentEmail}?subject=${encodeURIComponent(
                    emailSubject
                )}&body=${encodeURIComponent(message)}`;
                window.open(mailtoLink);
                break;
            case 'Call':
                const telLink = `tel:${property.agentCallNumber}`;
                window.open(telLink);
                break;
            case 'WhatsApp':
                const whatsappMessage = `https://wa.me/${property.agentWhatsapp}?text=${encodeURIComponent(
                    message
                )}`;
                window.open(whatsappMessage);
                break;
            default:
                break;
        }
    };
    
    const processImages = (images) => {
        if (typeof images === "string") {
            return images.split('/uploads/').filter(image => image).map(image => `/uploads/${image}`);
        }
        return images;
    };

    return (
        <div className="container mt-8 bg-gray-800 text-gray-100 p-4 rounded-lg">
            {isDeleted && (
                <div className="text-center bg-green-200 text-green-700 p-4 rounded mb-4">
                    Your ad has been deleted successfully!
                </div>
            )}
            {!isDeleted && property && (
                <>
                    <h2 className="text-custom text-xl font-semibold mb-3">Property Details</h2>
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/2 lg:pr-4">
                            {property.images && processImages(property.images).length > 1 ? (
                                <Carousel
                                    showThumbs={false}
                                    infiniteLoop
                                    useKeyboardArrows
                                    autoPlay
                                    className="h-80"
                                >
                                    {processImages(property.images).map((image, index) => (
                                        <div key={index} className="h-100 flex justify-center items-center">
                                            <img
                                                className="rounded-lg object-cover h-80 w-full"
                                                src={`${image}`}
                                                alt={property.title}
                                            />
                                        </div>
                                    ))}
                                </Carousel>
                            ) : (
                                <img className="rounded-lg mb-4 object-cover h-80 w-full" src={`${property.image}`} alt={property.title} />
                            )}
                        </div>
                        <div className="lg:w-1/2 lg:pl-4">
                            <h3 className="text-lg font-semibold mb-2" style={{ color: '#c5a47e' }}>
                                {property.title}
                            </h3>
                            <p className="text-sm mb-2">{property.price}</p>
                            <p className="mb-4 text-sm">{property.city}, {property.location}</p>
                            <p className="mb-4 text-sm">{property.propertyType}</p>
                            <p className="mb-4 text-sm">{property.beds} Beds</p>
                            <p className="mb-4 text-sm">{property.baths} Baths</p>
                            <p className="mb-4 text-sm">Landlord: {property.landlordName}</p>
                            <p className="mb-4 text-sm">{property.propertyComplete ? 'Property Complete' : 'Property Incomplete'}</p>
                            <p className="mb-4 text-sm">Broker: {property.broker}</p>
                            <div className="mb-4 flex items-center space-x-4 text-gray-100">
                                <EmailIcon style={{ cursor: 'pointer' }} onClick={() => handleContactBroker('Email')} />
                                <PhoneIcon style={{ cursor: 'pointer' }} onClick={() => handleContactBroker('Call')} />
                                <WhatsAppIcon style={{ cursor: 'pointer' }} onClick={() => handleContactBroker('WhatsApp')} />
                            </div>

                            {user && property && user._id === property.user && ( // Check if the logged-in user is the owner
                                <>
                                    <button 
                                        onClick={handleEditProperty}
                                        className="px-6 py-3 bg-blue-600 bg-custom text-white rounded mr-2"
                                    >
                                        Edit Property
                                    </button>
                                    <button
                                        onClick={handleDeleteProperty}
                                        className="px-6 py-3 bg-red-600 bg-custom text-white rounded"
                                    >
                                        Delete Property
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
            {isDeleted && (
                <div className="flex justify-center mt-4">
                    <button onClick={() => navigate("/")} className="px-6 py-3 bg-green-600 text-white rounded">
                        Go to Home
                    </button>
                </div>
            )}
        </div>
    );
}
