import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ListingsContext from "../contexts/ListingsContext";

export default function EditPropertyForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { listings, updateListing } = useContext(ListingsContext);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const selectedProperty = listings.find((listing) => listing._id === id);
        if (selectedProperty) {
            setFormData(selectedProperty);
            setLoading(false);
        } else {
            setLoading(false); // Stop loading if no property is found
        }
    }, [id, listings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            images: Array.from(e.target.files),
        }));
    };

 const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true); // Set updating status to true
        
        const user = localStorage.getItem('user');
        const parsedUser = JSON.parse(user);
        const token = parsedUser.token;

        const submissionData = new FormData();
        for (const key in formData) {
            if (key === "images" && formData.images) {
                formData.images.forEach((image) => {
                    submissionData.append("images", image);
                });
            } else if (key !== "images") {
                submissionData.append(key, formData[key]);
            }
        }

        try {
            const response = await fetch(`https://backend-git-main-pawan-togas-projects.vercel.app/api/listings/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: submissionData
            });

            if (!response.ok) {
                throw new Error(`Failed to update listing: ${response.statusText}`);
            }

            const data = await response.json();
            setIsUpdating(false); // Set updating status to false after success
            setSubmitted(true);
        } catch (error) {
            setIsUpdating(false); // Set updating status to false after error
            alert("Failed to update listing: " + error.message);
        }
    };

    if (loading) {
        return <div className="text-center text-primary font-aller font-light">Loading...</div>;
    }

    if (!formData) {
        return <div className="text-center text-primary font-aller font-light">No property data found</div>;
    }

    if (submitted) {
        return (
            <div className="container mx-auto p-4 font-aller font-light">
                <div className="text-center bg-primary-dark text-primary p-4 rounded">
                    Your ad has been modified successfully!
                </div>
                <div className="flex justify-center mt-4 font-aller font-light">
                    <button onClick={() => navigate("/")} className="px-6 py-3 bg-button text-button rounded">
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 bg-primary text-primary font-aller font-lightr">
            <h2 className="text-2xl font-bold text-center text-primary ">Edit Property</h2>
            
            {isUpdating ? (
            <div className="text-center bg-primary text-primary p-2 rounded mb-4 font-aller font-light">
                Your Ad is updating...
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="flex font-aller font-light flex-col space-y-4 w-full max-w-md mx-auto bg-primary p-6 rounded ">
                <input
                    name="title"
                    type="text"
                    value={formData.title || ''}
                    onChange={handleChange}
                    placeholder="Title"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="price"
                    type="text"
                    value={formData.price || ''}
                    onChange={handleChange}
                    placeholder="Price"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="city"
                    type="text"
                    value={formData.city || ''}
                    onChange={handleChange}
                    placeholder="City"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="location"
                    type="text"
                    value={formData.location || ''}
                    onChange={handleChange}
                    placeholder="Location"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="country"
                    type="text"
                    value={formData.country || ''}
                    onChange={handleChange}
                    placeholder="Country"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="developments"
                    type="text"
                    value={formData.developments || ''}
                    onChange={handleChange}
                    placeholder="Developments"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="amenities"
                    type="text"
                    value={formData.amenities || ''}
                    onChange={handleChange}
                    placeholder="Amenities"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="propertyType"
                    type="text"
                    value={formData.propertyType || ''}
                    onChange={handleChange}
                    placeholder="Property Type"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="beds"
                    type="number"
                    value={formData.beds || ''}
                    onChange={handleChange}
                    placeholder="Beds"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="bathrooms"
                    type="number"
                    value={formData.bathrooms || ''}
                    onChange={handleChange}
                    placeholder="Bathrooms"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    placeholder="Description"
                    className="border border-primary-400 p-2 rounded w-full h-24 bg-primary text-primary"
                />
                <input
                    name="propertyReferenceId"
                    type="text"
                    value={formData.propertyReferenceId || ''}
                    onChange={handleChange}
                    placeholder="Property Reference ID"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="building"
                    type="text"
                    value={formData.building || ''}
                    onChange={handleChange}
                    placeholder="Building"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="neighborhood"
                    type="text"
                    value={formData.neighborhood || ''}
                    onChange={handleChange}
                    placeholder="Neighborhood"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="landlordName"
                    type="text"
                    value={formData.landlordName || ''}
                    onChange={handleChange}
                    placeholder="Landlord Name"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="reraTitleNumber"
                    type="text"
                    value={formData.reraTitleNumber || ''}
                    onChange={handleChange}
                    placeholder="RERA Title Number"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="reraPreRegistrationNumber"
                    type="text"
                    value={formData.reraPreRegistrationNumber || ''}
                    onChange={handleChange}
                    placeholder="RERA Pre Registration Number"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="agentName"
                    type="text"
                    value={formData.agentName || ''}
                    onChange={handleChange}
                    placeholder="Agent Name"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="agentCallNumber"
                    type="text"
                    value={formData.agentCallNumber || ''}
                    onChange={handleChange}
                    placeholder="Agent Call Number"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="agentEmail"
                    type="email"
                    value={formData.agentEmail || ''}
                    onChange={handleChange}
                    placeholder="Agent Email"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="agentWhatsapp"
                    type="text"
                    value={formData.agentWhatsapp || ''}
                    onChange={handleChange}
                    placeholder="Agent WhatsApp"
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <input
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="border border-primary-400 p-2 rounded w-full bg-primary text-primary"
                />
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => navigate(-1)} // Go back to the previous page
                        className="px-4 py-2 bg-button text-button rounded  transition duration-300"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-button text-button rounded  transition duration-300"
                    >
                        Submit
                    </button>
                </div>
            </form>
            )}
        </div>
    );
}
