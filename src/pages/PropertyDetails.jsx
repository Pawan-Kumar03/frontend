import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ListingsContext from "../contexts/ListingsContext";
import AuthContext from "../contexts/UserContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { jsPDF } from "jspdf";
import AgentCard from "../components/Card/AgentCard";

export default function PropertyDetails() {
  const { id } = useParams();
  const { listings } = useContext(ListingsContext);
  const { user } = useContext(AuthContext);
  const [property, setProperty] = useState(null);
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
    <div className="container mx-auto p-6">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center bg-gray-100 px-4 py-2 rounded-full shadow-md hover:bg-gray-200 transition"
        >
          <ArrowBackIcon className="mr-2" />
          Back
        </button>
      </div>

      {property && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Agent Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              {agent && <AgentCard agent={agent} />}
            </div>
          </div>

          {/* Right Column - Property Details */}
          <div className="lg:col-span-2">
            {/* Full-width Image Carousel */}
            {property.images && processImages(property.images).length > 1 ? (
              <Carousel showThumbs={false} infiniteLoop autoPlay>
                {processImages(property.images).map((image, index) => (
                  <div key={index}>
                    <img className="w-full h-[400px] object-cover" src={image} alt={property.title} />
                  </div>
                ))}
              </Carousel>
            ) : (
              <img
                className="w-full h-[400px] object-cover rounded-lg"
                src={property.image}
                alt={property.title}
              />
            )}

            {/* Property Details */}
            <div className="mt-6">
              <h1 className="text-2xl font-bold">{property.title}</h1>
              <p className="text-lg text-gray-600 font-semibold mt-2">AED {property.price}</p>

              <p className="text-gray-600 mt-2 flex items-center">
                <LocationOnIcon className="mr-2 text-red-500" />
                {property.building}, {property.developments}, {property.location}, {property.city}, {property.country}
              </p>

              <div className="mt-4 space-y-2">
                <p><strong>Property Type:</strong> {property.propertyType}</p>
                <p><strong>Beds:</strong> {property.beds}</p>
                <p><strong>Baths:</strong> {property.baths}</p>
                <p><strong>Agent:</strong> {property.agentName}</p>
              </div>

              {/* Description */}
              {property.description && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold">Description</h2>
                  <p className="text-gray-700 mt-2">{property.description}</p>
                </div>
              )}

              {/* Contact Buttons */}
              <div className="mt-6 flex space-x-4">
                <a
                  href={`mailto:${property.agentEmail}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <EmailIcon className="mr-2" />
                  Email
                </a>
                <a
                  href={`tel:${property.agentCallNumber}`}
                  className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <PhoneIcon className="mr-2" />
                  Call
                </a>
                <a
                  href={`https://wa.me/${property.agentWhatsapp}`}
                  className="bg-gray-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <WhatsAppIcon className="mr-2" />
                  WhatsApp
                </a>
              </div>

              {/* View Brochure Button */}
              {property.pdf && (
                <div className="mt-4">
                  <a
                    href={property.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 text-white px-4 py-2 rounded-md inline-block"
                  >
                    View Brochure
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
