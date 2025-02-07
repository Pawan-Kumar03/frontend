import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { jsPDF } from "jspdf";
import AgentCard from "../components/Card/AgentCard";
import ListingsContext from "../contexts/ListingsContext";
import AuthContext from "../contexts/UserContext";

export default function PropertyDetails() {
  const { id } = useParams();
  const { listings } = useContext(ListingsContext);
  const { user } = useContext(AuthContext);
  const [property, setProperty] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [agent, setAgent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedProperty = listings.find((listing) => listing._id === id);
    if (selectedProperty) {
      setProperty(selectedProperty);
      fetchAgent(selectedProperty.agentEmail);
    } else {
      fetchProperty();
    }
  }, [id, listings]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(
        `https://backend-git-main-pawan-togas-projects.vercel.app/api/listings/${id}`
      );
      if (!response.ok) throw new Error("Property not found");
      const data = await response.json();
      setProperty(data);
      fetchAgent(data.agentEmail);
    } catch (error) {
      console.error("Failed to fetch property:", error);
    }
  };

  const fetchAgent = async (agentEmail) => {
    if (!agentEmail) return;
    try {
      const response = await fetch(
        `https://backend-git-main-pawan-togas-projects.vercel.app/api/agents/${agentEmail}`
      );
      if (!response.ok) throw new Error("Agent not found");
      const agentData = await response.json();
      setAgent(agentData);
    } catch (error) {
      console.error("Failed to fetch agent:", error);
    }
  };

  const processImages = (images) => {
    if (typeof images === "string") {
      return images
        .split("/uploads/")
        .filter((image) => image)
        .map((image) => `/uploads/${image}`);
    }
    return images;
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg max-w-6xl">
      {isDeleted && (
        <div className="text-center bg-red-100 text-red-600 p-4 rounded mb-4">
          Your ad has been deleted successfully!
        </div>
      )}
      {!isDeleted && property && (
        <>
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:underline"
            >
              <ArrowBackIcon className="mr-1" />
              Back
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Sticky Agent Card */}
            <div className="lg:w-1/4 hidden lg:block sticky top-20 self-start">
              {agent && <AgentCard agent={agent} />}
            </div>

            {/* Right: Property Details */}
            <div className="lg:w-3/4">
              {/* Image Carousel - Full Width */}
              {property.images && processImages(property.images).length > 0 ? (
                <Carousel
                  showThumbs={false}
                  infiniteLoop
                  useKeyboardArrows
                  autoPlay
                  className="w-full h-auto rounded-lg overflow-hidden"
                >
                  {processImages(property.images).map((image, index) => (
                    <div key={index} className="w-full">
                      <img
                        className="w-full h-[450px] object-cover"
                        src={image}
                        alt={property.title}
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <img
                  className="w-full h-[450px] object-cover rounded-lg"
                  src={property.image}
                  alt={property.title}
                />
              )}

              {/* Description and Details */}
              <div className="mt-6">
                <h3 className="text-2xl font-bold mb-2">{property.title}</h3>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  AED {property.price}
                </p>
                <p className="text-sm flex items-center text-gray-600 mb-2">
                  <LocationOnIcon className="mr-1 text-red-500" />
                  {property.building}, {property.developments}, {property.location}, {property.city}, {property.country}
                </p>
                <p className="text-gray-700 mb-4">{property.description}</p>

                {/* Property Info */}
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <p>
                    <strong>Property Type:</strong> {property.propertyType}
                  </p>
                  <p>
                    <strong>Beds:</strong> {property.beds}
                  </p>
                  <p>
                    <strong>Baths:</strong> {property.baths}
                  </p>
                  <p>
                    <strong>Agent:</strong> {property.agentName}
                  </p>
                </div>
              </div>

              {/* Mobile Agent Card */}
              <div className="mt-6 lg:hidden">
                {agent && <AgentCard agent={agent} />}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
