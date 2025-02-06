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
import AgentCard from "../Card/Card/AgentCard.jsx";

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
        `https://backend-git-main-pawan-togas-projects.vercel.app/api/agents/${agentEmail}`
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
    <div className="container mt-8 bg-white p-6 rounded-lg shadow-lg">
      {property && (
        <>
          <h2 className="text-lg font-bold">{property.title}</h2>
          <p>{property.price}</p>
          <p>{property.location}</p>

          {/* Render AgentCard if agent data is available */}
          {agent && <AgentCard agent={agent} />}
        </>
      )}
    </div>
  );
  
//   return (
// <div className="container mt-8 bg-primary backdrop-blur-lg text-primary p-6 rounded-lg font-aller font-light shadow-lg max-w-5xl mx-auto">
//   {isDeleted && (
//     <div className="text-center bg-primary text-primary font-aller font-light p-4 rounded mb-4">
//       Your ad has been deleted successfully!
//     </div>
//   )}
//   {!isDeleted && property && (
//         <>
//           <div className="flex items-center mb-4 justify-between">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center text-primary hover:underline bg-primary rounded-full px-4 py-2 transition duration-300"
//             >
//               <ArrowBackIcon className="mr-1 sm:text-lg text-primary" />
//               <span className="flex items-center">Back</span>
//             </button>
//             <button
//   onClick={property.pdf ? handleViewPDF : undefined}
//   disabled={!property.pdf}
//   className={`flex items-center rounded-full px-4 py-2 transition duration-300 ${
//     property.pdf
//       ? "text-primary hover:underline bg-primary"
//       : "text-gray-400 bg-gray-200 cursor-not-allowed"
//   }`}
// >
//   <span className="flex items-center">View Brochure</span>
// </button>


//           </div>

//       <div className="flex flex-col lg:flex-row">
//         <div className="lg:w-1/2 lg:pr-4">
//           {property.images && processImages(property.images).length > 1 ? (
//             <Carousel
//               showThumbs={false}
//               infiniteLoop
//               useKeyboardArrows
//               autoPlay
//               className="h-80 rounded-lg shadow-md"
//             >
//               {processImages(property.images).map((image, index) => (
//                 <div
//                   key={index}
//                   className="h-100 flex justify-center items-center"
//                   onClick={() => openFullscreenImage(image)} // Add click handler
//                 >
//                   <img
//                     className="rounded-lg object-cover h-80 w-full cursor-pointer"
//                     src={image}
//                     alt={property.title}
//                   />
//                 </div>
//               ))}
//             </Carousel>
//           ) : (
//             <img
//               className="rounded-lg mb-4 object-cover h-80 w-full cursor-pointer shadow-md"
//               src={`${property.image}`}
//               alt={property.title}
//               onClick={() => openFullscreenImage(property.image)} // Add click handler
//             />
//           )}
//           {/* Description */}
//           {property.description && (
//             <div className="mb-4">
//               <p className="text-sm font-aller font-light">{property.description}</p>
//             </div>
//           )}
//         </div>
//         <div className="lg:w-1/2 lg:pl-4">
//           <h3 className="text-lg font-aller font-bold mb-2 ">
//             {property.title}
//           </h3>
//           <p className="text-sm mb-2 flex items-center">
//           {/* <span className="mr-2 font-medium">AED</span>  */}
//           {property.price}
//         </p>
//           <p className="text-sm  mb-2">
//             <LocationOnIcon className="mr-2 text-primary" />
//             {property.building}, {property.developments}, {property.location}, {property.city}, {property.country}
//           </p>
//           <p className="text-sm mb-2">
//             <strong className="font-aller font-bold">Property Type:</strong> {property.propertyType}
//           </p>
//           <p className="text-sm mb-2">
//             <strong className="font-aller font-bold">Beds:</strong> {property.beds}
//           </p>
//           <p className="text-sm mb-2">
//             <strong className="font-aller font-bold">Baths:</strong> {property.baths}
//           </p>
//           <p className="text-sm mb-2">
//             <strong className="font-aller font-bold">Agent:</strong> {property.agentName}
//           </p>
//           {/* <p className="text-sm mb-2">
//             <strong className="font-aller font-bold">Developer:</strong> {property.landlordName}
//           </p> */}
//           <p className="text-sm mb-2">
//             <strong className="font-aller font-bold">Purpose:</strong>{property.purpose}
//           </p>
//           <p className="text-sm mb-2">
//             <strong className="font-aller font-bold">Completion Status:</strong>{" "}
//             {property.status === "false" ? "Off-Plan" : "Ready"}
//           </p>

//           {/* Amenities */}
//           {property.amenities && (
//             <div className="mb-4">
//               <h4  className="font-aller font-bold">Amenities:</h4>
//               <ul className="list-disc pl-5">
//                 {property.amenities.map((amenity, index) => (
//                   <li key={index} className="text-sm">{amenity}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* Contact Buttons */}
//           <div className="mb-4 flex items-center space-x-4 text-primary">
//             <EmailIcon
//               style={{ cursor: "pointer" }}
//               onClick={() => handleContactBroker("Email")}
//               className=" transition duration-300"
//             />
//             <PhoneIcon
//               style={{ cursor: "pointer" }}
//               onClick={() => handleContactBroker("Call")}
//               className=" transition duration-300"
//             />
//             <WhatsAppIcon
//               style={{ cursor: "pointer" }}
//               onClick={() => handleContactBroker("WhatsApp")}
//               className=" transition duration-300"
//             />
//           </div>

//           {user && property && user._id === property.user && (
//             <>
//               <button
//                 onClick={handleEditProperty}
//                 className="px-6 py-3 bg-button text-button rounded-full  transition duration-300 mb-2"
//               >
//                 Edit Property
//               </button>
//               <button
//                 onClick={() => setShowDeleteModal(true)}
//                 className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
//               >
//                 Delete Property
//               </button>
//             </>
//           )}
//         </div>
//       </div>
      
//       {fullscreenImage && (
//         <div
//           className="fixed inset-0 bg-primary flex justify-center items-center z-50"
//           onClick={closeFullscreenImage}
//         >
//           <img
//             src={fullscreenImage}
//             alt="Fullscreen View"
//             className="max-w-full max-h-full"
//           />
//           <button
//             className="absolute top-4 right-4 text-primary bg-primary rounded-full p-2"
//             onClick={closeFullscreenImage}
//           >
//             <CloseIcon />
//           </button>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-primary backdrop-blur-lg flex items-center justify-center z-50">
//           <div className="bg-primary rounded-lg p-8 text-primary shadow-lg">
//             <h3 className="text-lg font-semibold mb-4 text-primary">
//               Confirm Deletion
//             </h3>
//             <p className="mb-4 text-primary">
//               Are you sure you want to delete this property?
//             </p>
//             <div className="flex justify-end">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="px-4 py-2 bg-button text-button rounded-full transition duration-300 mr-2"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteProperty}
//                 className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   )}
// </div>

//   );
  
}
