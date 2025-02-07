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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from "@mui/icons-material/Close"; 
import { jsPDF } from "jspdf";
import AgentCard from "../components/Card/AgentCard";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPropertyById, deleteProperty } = useContext(ListingsContext);
  const { user } = useContext(AuthContext);
  const [property, setProperty] = useState(null);
  const [agent, setAgent] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      const data = await getPropertyById(id);
      setProperty(data);
      setAgent(data.agent);
    };
    fetchProperty();
  }, [id, getPropertyById]);

  const handleEditProperty = () => {
    navigate(`/edit-property/${id}`);
  };

  const handleDeleteProperty = async () => {
    await deleteProperty(id);
    setIsDeleted(true);
    setShowDeleteModal(false);
  };

  const handleContactBroker = (method) => {
    if (!agent) return;
    
    switch (method) {
      case "Email":
        window.location.href = `mailto:${agent.email}`;
        break;
      case "Call":
        window.location.href = `tel:${agent.phone}`;
        break;
      case "WhatsApp":
        window.open(`https://wa.me/${agent.phone}`, '_blank');
        break;
      default:
        break;
    }
  };

  const processImages = (images) => {
    if (typeof images === 'string') {
      return [images];
    }
    return images;
  };

  const openFullscreenImage = (image) => {
    setFullscreenImage(image);
  };

  const closeFullscreenImage = () => {
    setFullscreenImage(null);
  };

  const handleViewPDF = () => {
    if (property.pdf) {
      window.open(property.pdf, '_blank');
    }
  };

  return (
    <div className="container mt-8 bg-primary backdrop-blur-lg text-primary p-6 rounded-lg font-aller font-light shadow-lg max-w-7xl mx-auto">
      {isDeleted && (
        <div className="text-center bg-primary text-primary font-aller font-light p-4 rounded mb-4">
          Your ad has been deleted successfully!
        </div>
      )}
      {!isDeleted && property && (
        <>
          <div className="flex items-center mb-4 justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-primary hover:underline bg-primary rounded-full px-4 py-2 transition duration-300"
            >
              <ArrowBackIcon className="mr-1 sm:text-lg text-primary" />
              <span className="flex items-center">Back</span>
            </button>
            <button
              onClick={property.pdf ? handleViewPDF : undefined}
              disabled={!property.pdf}
              className={`flex items-center rounded-full px-4 py-2 transition duration-300 ${
                property.pdf
                  ? "text-primary hover:underline bg-primary"
                  : "text-gray-400 bg-gray-200 cursor-not-allowed"
              }`}
            >
              <span className="flex items-center">View Brochure</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content area - 70% width */}
            <div className="lg:w-[70%]">
              {/* Full-width image carousel */}
              <div className="mb-6">
                {property.images && processImages(property.images).length > 1 ? (
                  <Carousel
                    showThumbs={false}
                    infiniteLoop
                    useKeyboardArrows
                    autoPlay
                    className="rounded-lg shadow-md"
                  >
                    {processImages(property.images).map((image, index) => (
                      <div
                        key={index}
                        className="h-[500px]"
                        onClick={() => openFullscreenImage(image)}
                      >
                        <img
                          className="rounded-lg object-cover w-full h-full cursor-pointer"
                          src={image}
                          alt={property.title}
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <div className="h-[500px]">
                    <img
                      className="rounded-lg object-cover w-full h-full cursor-pointer shadow-md"
                      src={`${property.image}`}
                      alt={property.title}
                      onClick={() => openFullscreenImage(property.image)}
                    />
                  </div>
                )}
              </div>

              {/* Property title and price */}
              <div className="mb-6">
                <h3 className="text-2xl font-aller font-bold mb-2">
                  {property.title}
                </h3>
                <p className="text-xl mb-2">
                  {property.price}
                </p>
              </div>

              {/* Property description */}
              {property.description && (
                <div className="mb-6">
                  <h4 className="text-lg font-aller font-bold mb-2">Description</h4>
                  <p className="text-sm font-aller font-light leading-relaxed">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Property details */}
              <div className="mb-6">
                <h4 className="text-lg font-aller font-bold mb-4">Property Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <p className="text-sm mb-2">
                    <LocationOnIcon className="mr-2 text-primary" />
                    {property.building}, {property.developments}, {property.location}, {property.city}, {property.country}
                  </p>
                  <p className="text-sm mb-2">
                    <strong className="font-aller font-bold">Property Type:</strong> {property.propertyType}
                  </p>
                  <p className="text-sm mb-2">
                    <strong className="font-aller font-bold">Beds:</strong> {property.beds}
                  </p>
                  <p className="text-sm mb-2">
                    <strong className="font-aller font-bold">Baths:</strong> {property.baths}
                  </p>
                  <p className="text-sm mb-2">
                    <strong className="font-aller font-bold">Purpose:</strong> {property.purpose}
                  </p>
                  <p className="text-sm mb-2">
                    <strong className="font-aller font-bold">Completion Status:</strong>{" "}
                    {property.status === "false" ? "Off-Plan" : "Ready"}
                  </p>
                </div>
              </div>

              {/* Amenities */}
              {property.amenities && (
                <div className="mb-6">
                  <h4 className="text-lg font-aller font-bold mb-2">Amenities</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {property.amenities.map((amenity, index) => (
                      <p key={index} className="text-sm">• {amenity}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - 30% width */}
            <div className="lg:w-[30%]">
              <div className="sticky top-4">
                {/* Agent Card */}
                {agent && <AgentCard agent={agent} />}

                {/* Contact Buttons */}
                <div className="mt-6 flex items-center justify-center space-x-6 text-primary">
                  <EmailIcon
                    style={{ cursor: "pointer", fontSize: "2rem" }}
                    onClick={() => handleContactBroker("Email")}
                    className="transition duration-300 hover:scale-110"
                  />
                  <PhoneIcon
                    style={{ cursor: "pointer", fontSize: "2rem" }}
                    onClick={() => handleContactBroker("Call")}
                    className="transition duration-300 hover:scale-110"
                  />
                  <WhatsAppIcon
                    style={{ cursor: "pointer", fontSize: "2rem" }}
                    onClick={() => handleContactBroker("WhatsApp")}
                    className="transition duration-300 hover:scale-110"
                  />
                </div>

                {/* Admin buttons */}
                {user && property && user._id === property.user && (
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={handleEditProperty}
                      className="w-full px-6 py-3 bg-button text-button rounded-full transition duration-300"
                    >
                      Edit Property
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                    >
                      Delete Property
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fullscreen Image Modal */}
          {fullscreenImage && (
            <div
              className="fixed inset-0 bg-primary flex justify-center items-center z-50"
              onClick={closeFullscreenImage}
            >
              <img
                src={fullscreenImage}
                alt="Fullscreen View"
                className="max-w-full max-h-full"
              />
              <button
                className="absolute top-4 right-4 text-primary bg-primary rounded-full p-2"
                onClick={closeFullscreenImage}
              >
                <CloseIcon />
              </button>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-primary backdrop-blur-lg flex items-center justify-center z-50">
              <div className="bg-primary rounded-lg p-8 text-primary shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  Confirm Deletion
                </h3>
                <p className="mb-4 text-primary">
                  Are you sure you want to delete this property?
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-button text-button rounded-full transition duration-300 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteProperty}
                    className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}