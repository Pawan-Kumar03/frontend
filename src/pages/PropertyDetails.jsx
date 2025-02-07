import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Mail, Phone, ArrowLeft, X } from "lucide-react";
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
  const { listings } = useContext(ListingsContext);
  const { user } = useContext(AuthContext);
  const [property, setProperty] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null); 
  const [agent, setAgent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedProperty = listings.find((listing) => listing._id === id);
    if (selectedProperty) {
      setProperty(selectedProperty);
      fetchAgent(selectedProperty.agentEmail); // Fetch agent data
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
      fetchAgent(data.agentEmail); // Fetch agent when property is loaded
    } catch (error) {
      console.error("Failed to fetch property:", error);
    }
  };

  const fetchAgent = async (agentEmail) => {
    if (!agentEmail) return;

    try {
      const response = await fetch(
        `https://backend-git-main-pawan-togas-projects.vercel.app/api/agents/pawan.kumar@investibayt.com`
      );
      if (!response.ok) throw new Error("Agent not found");

      const agentData = await response.json();
      setAgent(agentData);
    } catch (error) {
      console.error("Failed to fetch agent:", error);
    }
  };


  const openFullscreenImage = (image) => {
    setFullscreenImage(image);
  };

  const closeFullscreenImage = () => {
    setFullscreenImage(null);
  };

  const handleEditProperty = () => {
    navigate(`/edit-property/${property._id}`);
  };

  const handleDeleteProperty = async () => {
    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);
    const token = parsedUser.token;

    try {
      const response = await fetch(
        `https://backend-git-main-pawan-togas-projects.vercel.app/api/listings/${property._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setIsDeleted(true);
      // Optionally, you could also update the listings context here

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Failed to delete listing:", error);
    }
  };

  const handleContactBroker = (contactMethod) => {
    if (!property) return;

    const propertyLink = `${window.location.origin}/property/${property._id}`;
    const message = `Property Details:\n\nTitle: ${property.title}\nPrice: ${property.price}\nCity: ${property.city}\nLocation: ${property.location}\nProperty Type: ${property.propertyType}\nBeds: ${property.beds}\n\nProperty Link: ${propertyLink}`;

    switch (contactMethod) {
      case "Email":
        const emailSubject = `Interested in ${property.title}`;
        const mailtoLink = `mailto:${
          property.agentEmail
        }?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
          message
        )}`;
        window.open(mailtoLink);
        break;
      case "Call":
        const telLink = `tel:${property.agentCallNumber}`;
        window.open(telLink);
        break;
      case "WhatsApp":
        const whatsappMessage = `https://wa.me/${
          property.agentWhatsapp
        }?text=${encodeURIComponent(message)}`;
        window.open(whatsappMessage);
        break;
      default:
        break;
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
  const handleViewPDF = () => {
    if (property.pdf) {
      window.open(property.pdf, "_blank");
    }
  };
  return (
    <div className="min-h-screen bg-background">
      {isDeleted && (
        <div className="max-w-7xl mx-auto px-4 py-6 text-center bg-green-100 text-green-800 rounded-lg mt-8">
          Your ad has been deleted successfully!
        </div>
      )}
      
      {!isDeleted && property && (
        <div className="w-full">
          {/* Navigation Bar */}
          <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-full hover:bg-muted"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
            
            <button
              onClick={property.pdf ? handleViewPDF : undefined}
              disabled={!property.pdf}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                property.pdf
                  ? "hover:bg-muted"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              View Brochure
            </button>
          </div>

          {/* Full Width Image Section */}
          <div className="w-full mb-8">
            {property.images && processImages(property.images).length > 1 ? (
              <div className="w-full h-[70vh]">
                <Carousel
                  showThumbs={false}
                  infiniteLoop
                  useKeyboardArrows
                  autoPlay
                  className="h-full"
                >
                  {processImages(property.images).map((image, index) => (
                    <div
                      key={index}
                      className="w-full h-[70vh]"
                      onClick={() => openFullscreenImage(image)}
                    >
                      <img
                        src={image}
                        alt={`${property.title} - ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            ) : (
              <div
                className="w-full h-[70vh]"
                onClick={() => openFullscreenImage(property.image)}
              >
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
              <p className="text-2xl font-semibold mb-6">{property.price}</p>
              
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm font-medium">Property Type</p>
                    <p className="text-lg">{property.propertyType}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm font-medium">Purpose</p>
                    <p className="text-lg">{property.purpose}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm font-medium">Beds</p>
                    <p className="text-lg">{property.beds}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm font-medium">Baths</p>
                    <p className="text-lg">{property.baths}</p>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none mb-8">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground">{property.description}</p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-muted text-sm"
                      >
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Agent Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {agent && <AgentCard agent={agent} />}
                
                <div className="p-6 rounded-lg bg-muted space-y-4">
                  <h3 className="font-semibold">Contact Agent</h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleContactBroker("Email")}
                      className="flex-1 flex items-center justify-center p-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      <Mail className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleContactBroker("Call")}
                      className="flex-1 flex items-center justify-center p-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      <Phone className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleContactBroker("WhatsApp")}
                      className="flex-1 flex items-center justify-center p-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {user && property && user._id === property.user && (
                  <div className="space-y-3">
                    <button
                      onClick={handleEditProperty}
                      className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Edit Property
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Delete Property
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={closeFullscreenImage}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={fullscreenImage}
              alt="Fullscreen View"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-background/50 hover:bg-background/70 transition-colors"
              onClick={closeFullscreenImage}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-muted-foreground">
              Are you sure you want to delete this property?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProperty}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



