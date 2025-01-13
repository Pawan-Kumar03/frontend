import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListingsContext from "../contexts/ListingsContext";
import imageCompression from 'browser-image-compression';
import { PDFDocument } from 'pdf-lib';

export default function PlaceAnAdPage() {
  const { addListing } = useContext(ListingsContext); // Use listings context
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    city: '',
    location: '',
    propertyType: '',
    beds: 0,
    extension: '',
    images: [], // Store images as an array,
    broker: '',
    email: '',
    phone: '',
    whatsapp: '',
    agentName: '',      // New fields for Agent details
    agentCallNumber: '',
    agentEmail: '',
    agentWhatsapp: '',
    landlord: false, // to distinguish between landlord and agent
    country: '',        
    developments: '', 
    description: '', // Added description
    amenities: [], // Added amenities
    pdf: null,
  });
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false); // State variable for submission success
  const [isPublishing, setIsPublishing] = useState(false);
  // const { user } = useContext(UserContext); // Access user from UserContext
   // Get the user from localStorage
   const user = localStorage.getItem('user');
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is not logged in, redirect to the login page
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
   // Early return to avoid rendering the component before navigation
   if (!user) {
    return null;
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = (name === 'beds' || name === 'baths') ? parseInt(value, 10) || 0 : value;
    setFormData(prev => {
      const updatedData = { ...prev, [name]: newValue };
      if (name === 'city' || name === 'location') {
        updatedData.extension = `${updatedData.city}, ${updatedData.location}`;
      }
      return updatedData;
    });
  };
  

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const handleNextStep = (newData) => {
    setFormData({ ...formData, ...newData });
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPublishing(true); // Set publishing state to true
  
    try {
      // Adding a 2-second delay at the start
      await new Promise((resolve) => setTimeout(resolve, 2000));
  
      const submissionData = new FormData();
  
      if (!formData.status) {
        formData.status = false;
      }
  
      // Compress images before appending them
      const compressedImages = await Promise.all(
        formData.images.map(async (image) => {
          const options = {
            maxSizeMB: 1, // Target size of 1MB
            maxWidthOrHeight: 1920, // Maximum width or height in pixels
            useWebWorker: true, // Use a web worker for faster processing
          };
          try {
            const compressedImage = await imageCompression(image, options);
            return compressedImage;
          } catch (error) {
            console.error("Error compressing image:", error);
            throw error;
          }
        })
      );
  
      // Append all compressed images to the FormData
      compressedImages.forEach((image) => {
        submissionData.append("images", image);
      });
  
      // Compress the PDF file before appending
      if (formData.pdf) {
        try {
          const compressedPdf = await compressPDF(formData.pdf);
          submissionData.append("pdf", compressedPdf);
        } catch (error) {
          console.error("Failed to compress PDF:", error);
          throw error;
        }
      }
  
      // Append other form data
      for (const key in formData) {
        if (key !== "images" && key !== "pdf") {
          submissionData.append(key, formData[key]);
        }
      }
  
      // Append additional broker data
      submissionData.set("broker", formData.agentName);
      submissionData.set("email", formData.agentEmail);
      submissionData.set("phone", formData.agentCallNumber);
      submissionData.set("whatsapp", formData.agentWhatsapp);
  
      // Retrieve token from localStorage
      const user = localStorage.getItem("user");
      const parsedUser = JSON.parse(user);
      const token = parsedUser.token;
  
      // Send the form data to the backend
      let postResponse = await fetch(
        "https://backend-git-main-pawan-togas-projects.vercel.app/api/listings",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: submissionData,
        }
      );
  
      if (postResponse.ok) {
        const newListing = await postResponse.json(); // Get the newly created listing data
        setSubmitted(true);
        addListing(newListing);
      } else {
        throw new Error("Failed to publish listing");
      }
    } catch (error) {
      console.error("Failed to submit listing: " + error.message);
    } finally {
      setIsPublishing(false); // Reset publishing state after submission
    }
  };
  
  // Compress PDF Function
  const compressPDF = async (pdfFile) => {
    // Get the size of the original PDF
    console.log(`Original PDF size: ${(pdfFile.size / 1024).toFixed(2)} KB`);
  
    const { PDFDocument } = await import("pdf-lib");
    try {
      const pdfBytes = await pdfFile.arrayBuffer(); // Convert PDF file to ArrayBuffer
      const pdfDoc = await PDFDocument.load(pdfBytes); // Load the PDF document
  
      // Recreate the document to compress it
      const compressedPdfDoc = await PDFDocument.create();
      const copiedPages = await compressedPdfDoc.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
  
      copiedPages.forEach((page) => compressedPdfDoc.addPage(page));
  
      // Serialize the compressed PDF to a Uint8Array
      const compressedPdfBytes = await compressedPdfDoc.save();
  
      // Create a new Blob for the compressed PDF
      const compressedPdfBlob = new Blob([compressedPdfBytes], {
        type: "application/pdf",
      });
  
      // Log the size of the compressed PDF
      console.log(
        `Compressed PDF size: ${(compressedPdfBlob.size / 1024).toFixed(2)} KB`
      );
  
      // Ensure the compressed file is below 2000 KB (2 MB)
      if (compressedPdfBlob.size > 2000 * 1024) {
        throw new Error("Compressed PDF exceeds 2000 KB limit");
      }
  
      return new File([compressedPdfBlob], pdfFile.name, { type: "application/pdf" });
    } catch (error) {
      console.error("Error compressing PDF:", error);
      throw error;
    }
  };
  
  

  const handleCategorySelect = (category) => {
    if (category === "Land" || category === "Multiple Units") {
      setFormData({ ...formData, category, subcategory: category });
      setStep(4);
    } else {
      setFormData({ ...formData, category });
      setStep(3);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto p-4 font-aller font-light">
        <div className="text-center bg-green-200 text-green-700 p-4 rounded font-aller font-light">
          Your ad has been published successfully!
        </div>
        <div className="flex justify-center mt-4 font-aller font-light">
          <button onClick={() => navigate("/")} className="px-6 py-3 bg-custom text-white rounded">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 font-aller font-light">
      {isPublishing ? (
        <div className="text-center text-primary bg-custom  p-4 rounded">
          Your Ad is publishing...
        </div>
      ) : (
        <>
      {step === 1 && <Step1 onNext={handleNextStep} />}
      {step === 2 && <StepChooseCategory onNext={handleCategorySelect} onBack={handlePrevStep} title={formData.title} />}
      {step === 3 && formData.category === "Residential" && (
        <Step2Residential onNext={handleNextStep} onBack={handlePrevStep} category={formData.category} title={formData.title} />
      )}
      {step === 3 && formData.category === "Commercial" && (
        <Step2Commercial onNext={handleNextStep} onBack={handlePrevStep} category={formData.category} title={formData.title} />
      )}
      {step === 4 && (
        <Step3Details
          onNext={handleNextStep}
          onBack={handlePrevStep}
          formData={formData}
          noAmenities={formData.category === "Land" || formData.category === "Multiple Units"}
        />
      )}
      {step === 5 && <Step4Review onSubmit={handleSubmit} onBack={handlePrevStep} formData={formData} />}
      </>
      )}
    </div>
  );
}

function Step1({ onNext }) {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    onNext({ title });
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto font-aller font-light">
      <h2 className="text-2xl font-bold text-center text-primary">Enter a short title to describe your listing</h2>
      <h3 className="text-center text-primary">Make your title informative and attractive.</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. 1 Bedroom available in Al-Barsha"
        className="text-primary border border-primary-400 p-2 rounded w-full focus:outline-none focus:border-custom"
      />
      <button onClick={handleSubmit} className="px-4 py-2 bg-button text-button rounded w-full">Let's Go</button>
    </div>
  );
}

function StepChooseCategory({ onNext, onBack, title }) {
  const [category, setCategory] = useState("");

  const handleCategorySelect = (category) => {
    setCategory(category);
    onNext(category);
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto font-aller font-light">
      <h2 className="text-2xl  font-aller font-light font-bold text-center text-primary">Now choose the right category for your ad: {title}</h2>
      <div className="space-y-2 w-3/4 font-aller font-light">
        <button onClick={() => handleCategorySelect("Residential")} className={`block w-full px-6 py-3 rounded ${category === "Residential" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Residential</button>
        <button onClick={() => handleCategorySelect("Commercial")} className={`block w-full px-6 py-3 rounded ${category === "Commercial" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Commercial</button>
        <button onClick={() => handleCategorySelect("Land")} className={`block w-full px-6 py-3 rounded ${category === "Land" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Land</button>
        <button onClick={() => handleCategorySelect("Multiple Units")} className={`block w-full px-6 py-3 rounded ${category === "Multiple Units" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Multiple Units</button>
      </div>
      <button onClick={onBack} className="px-4 py-2 font-aller font-light  bg-button text-button rounded w-full">Back</button>
    </div>
  );
}

function Step2Residential({ onNext, onBack, category, title }) {
  const [subcategory, setSubcategory] = useState("Apartment");

  const handleSubmit = () => {
    onNext({ subcategory, propertyType: subcategory });
  };

  return (
    <div className="flex font-aller font-light flex-col items-center space-y-4 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-aller font-light font-bold text-center text-primary">Now choose the right category for your ad: {title} {">"} {category}</h2>
      <div className="space-y- font-aller font-light w-3/4">
        <button onClick={() => setSubcategory("Apartment")} className={`block w-full px-6 py-3 rounded ${subcategory === "Apartment" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Apartment</button>
        <button onClick={() => setSubcategory("Villa")} className={`block w-full px-6 py-3 rounded ${subcategory === "Villa" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Villa</button>
        <button onClick={() => setSubcategory("Townhouse")} className={`block w-full px-6 py-3 rounded ${subcategory === "Townhouse" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Townhouse</button>
        <button onClick={() => setSubcategory("Penthouse")} className={`block w-full px-6 py-3 rounded ${subcategory === "Penthouse" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Penthouse</button>
        <button onClick={() => setSubcategory("Residential Building")} className={`block w-full px-6 py-3 rounded ${subcategory === "Residential Building" ? 'bg-rcustom text-white' : 'bg-gray-200'}`}>Residential Building</button>
        <button onClick={() => setSubcategory("Residential Floor")} className={`block w-full px-6 py-3 rounded ${subcategory === "Residential Floor" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Residential Floor</button>
        <button onClick={() => setSubcategory("Villa Compound")} className={`block w-full px-6 py-3 rounded ${subcategory === "Villa Compound" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Villa Compound</button>
      </div>
      <button onClick={handleSubmit} className="px-6 py-3 bg-button text-button rounded w-3/4">Continue</button>
      <button onClick={onBack} className="px-6 py-3 bg-button text-button rounded w-3/4">Back</button>
    </div>
  );
}

function Step2Commercial({ onNext, onBack, category, title }) {
  const [subcategory, setSubcategory] = useState("Office");

  const handleSubmit = () => {
    onNext({ subcategory, propertyType: subcategory });
  };

  return (
    <div className="flex font-aller font-light flex-col items-center space-y-4 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-aller font-light font-bold text-center text-primary">Now choose the right category for your ad: {title} {">"} {category}</h2>
      <div className="space-y-2 w-3/4 font-aller font-light">
        <button onClick={() => setSubcategory("Office")} className={`block w-full px-6 py-3 rounded ${subcategory === "Office" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Office</button>
        <button onClick={() => setSubcategory("Retail")} className={`block w-full px-6 py-3 rounded ${subcategory === "Retail" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Retail</button>
        <button onClick={() => setSubcategory("Industrial")} className={`block w-full px-6 py-3 rounded ${subcategory === "Industrial" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Industrial</button>
        <button onClick={() => setSubcategory("Staff Accommodation")} className={`block w-full px-6 py-3 rounded ${subcategory === "Staff Accommodation" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Staff Accommodation</button>
        <button onClick={() => setSubcategory("Shop")} className={`block w-full px-6 py-3 rounded ${subcategory === "Shop" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Shop</button>
        <button onClick={() => setSubcategory("Warehouse")} className={`block w-full px-6 py-3 rounded ${subcategory === "Warehouse" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Warehouse</button>
        <button onClick={() => setSubcategory("Commercial Floor")} className={`block w-full px-6 py-3 rounded ${subcategory === "Commercial Floor" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Commercial Floor</button>
        <button onClick={() => setSubcategory("Commercial Building")} className={`block w-full px-6 py-3 rounded ${subcategory === "Commercial Building" ? 'bg-rcustom text-white' : 'bg-gray-200'}`}>Commercial Building</button>
        <button onClick={() => setSubcategory("Commercial Villa")} className={`block w-full px-6 py-3 rounded ${subcategory === "Commercial Villa" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Commercial Villa</button>
        <button onClick={() => setSubcategory("Factory")} className={`block w-full px-6 py-3 rounded ${subcategory === "Factory" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Factory</button>
        <button onClick={() => setSubcategory("Other")} className={`block w-full px-6 py-3 rounded ${subcategory === "Other" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Other</button>
        <button onClick={() => setSubcategory("Showroom")} className={`block w-full px-6 py-3 rounded ${subcategory === "Showroom" ? 'bg-custom text-white' : 'bg-gray-200'}`}>Showroom</button>
      </div>
      <button onClick={handleSubmit} className="px-6 py-3 bg-button text-button rounded w-3/4">Continue</button>
      <button onClick={onBack} className="px-6 py-3 bg-button text-button rounded w-3/4">Back</button>
    </div>
  );
}

function Step3Details({ onNext, onBack, formData, noAmenities }) {
  const [details, setDetails] = useState({
    description: "",
    images: [],
    price: '',
    city: '',
    location: '',
    beds: 0,
    baths: "",
    propertyReferenceId: "",
    amenities: [],
    landlordName: "",
    reraTitleNumber: "",
    reraPreRegistrationNumber: "",
    building: "",
    neighborhood: "",
    propertyType: formData.propertyType || '',
    agentName: formData.agentName,
    agentCallNumber: formData.agentCallNumber,
    agentEmail: formData.agentEmail,
    agentWhatsapp: formData.agentWhatsapp,
    landlord: formData.landlord,
    country: '', 
    developments: '', 
    description: '', // Added description
    amenities: [], // Added amenities
    pdf: null,
    errors: {}, // Error messages state
    ...formData,
  });

  // Add a handler for PDF file changes
const handlePdfChange = (e) => {
  const file = e.target.files[0];
  if (file && file.type === "application/pdf") {
    setDetails({ ...details, pdf: file });
  } else {
    setDetails({ ...details, errors: { ...details.errors, pdf: "Please upload a valid PDF file." } });
  }
};
  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'beds' && value === '' ? '' : (name === 'beds' ? parseInt(value, 10) || 0 : value);
    setDetails(prev => ({ ...prev, [name]: newValue }));
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    setDetails((prevDetails) => {
      if (checked) {
        return { ...prevDetails, amenities: [...prevDetails.amenities, value] };
      } else {
        return { ...prevDetails, amenities: prevDetails.amenities.filter((amenity) => amenity !== value) };
      }
    });
  };

  const handleImageChange = (e) => {
    setDetails(prev => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ['title', 'price', 'city','images', 'location', 'propertyType','images', 'beds', 'baths', 'landlordName','agentName', 'agentCallNumber', 'agentEmail', 'agentWhatsapp', 'purpose', 'country', 'developments','amenities','description'];

    requiredFields.forEach(field => {
      if (!details[field] || details[field] === '') {
        errors[field] = `${field} field is required`;
      }
      // if(field === 'status' && details.status === null) {
      //   errors[field] = 'You must select if the property is complete or incomplete' ;
      // }
      // if(field=='images'){
      //   errors[field] = `${field} field is required`;

      // }
    });

    setDetails(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      const extension = `${details.city}, ${details.location}`;
      onNext({ ...details, extension });
    }
  };

  const getAmenitiesOptions = () => {
    switch (formData.category) {
      case "Residential":
        return [
          "Maids Room", "Study", "Central A/C & Heating", "Concierge Service", "Balcony", "Private Garden", "Private Pool", "Private Gym", "Private Jacuzzi",
          "Shared Pool", "Shared Spa", "Shared Gym", "Security", "Maid Service", "Covered Parking", "Built in Wardrobes", "Walk-in Closet", "Built in Kitchen Appliances",
          "View of Water", "View of Landmark", "Pets Allowed", "Double Glazed Windows", "Day Care Center", "Electricity Backup", "First Aid Medical Center", "Service Elevators",
          "Prayer Room", "Laundry Room", "Broadband Internet", "Satellite / Cable TV", "Business Center", "Intercom", "ATM Facility", "Kids Play Area", "Reception / Waiting Room",
          "Maintenance Staff", "CCTV Security", "Cafeteria or Canteen", "Shared Kitchen", "Facilities for Disabled", "Storage Areas", "Cleaning Services", "Barbeque Area",
          "Lobby in Building", "Waste Disposal"
        ];
      case "Commercial":
        return [
          "Shared Spa", "Shared Gym", "Covered Parking", "View of Water", "View of Landmark", "Conference Room", "Available Furnished", "Available Networked",
          "Dining in Building", "Retail in Building"
        ];
      default:
        return [];
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'baths' && value === '' ? '' : (name === 'baths' ? parseInt(value, 10) || 0 : value);
    setDetails(prev => ({ ...prev, [name]: newValue }));
  };
  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-lg mx-auto font-aller font-light">
      <h2 className="text-2xl font-bold text-center text-primary">You’re almost there!</h2>
      <h3 className="text-center text-primary">Include as much details and pictures as possible, and set the right price!</h3>
      <h4 className="text-center text-primary">{formData.title} {">"} {formData.category}</h4>
      <input
      name="country"
      type="text"
      value={details.country || ""}
      onChange={handleDetailsChange}
      placeholder="Country"
      className="text-primary border border-primary-400 p-2 rounded w-full"
    />
    {details.errors.country && <p className="text-red-500 text-sm">{details.errors.country}</p>}

      <input
        type="text"
        name="city"
        value={details.city}
        onChange={handleDetailsChange}
        placeholder="City"
        className="text-primary border border-primary-400 p-2 rounded w-full"
      />
      {details.errors.city && <p className="text-red-500 text-sm">{details.errors.city}</p>}
      
      <input
        name="location"
        type="text"
        value={details.location}
        onChange={handleDetailsChange}
        placeholder="Location"
        className="text-primary border border-primary-400 p-2 rounded w-full"
      />
      {details.errors.location && <p className="text-red-500 text-sm">{details.errors.location}</p>}
      
      <input
        name="propertyType"
        type="text"
        value={details.propertyType}
        onChange={handleDetailsChange}
        placeholder="Property Type"
        className="text-primary border border-primary-400 p-2 rounded w-full"
      />
      {details.errors.propertyType && <p className="text-red-500 text-sm">{details.errors.propertyType}</p>}
      
      <input
        name="beds"
        type="number"
        value={details.beds || ""}
        onChange={handleDetailsChange}
        placeholder="Beds"
        className="text-primary border border-primary-400 p-2 rounded w-full"
      />
      {details.errors.beds && <p className="text-red-500 text-sm">{details.errors.beds}</p>}
      
      <div className="text-primary border border-primary-400 p-2 rounded w-full">
  <label
    htmlFor="imageInput"
    className="block text-primary font-aller font-light cursor-pointer"
  >
    Choose images
  </label>
  <input
    id="imageInput"
    type="file"
    multiple
    name="images"
    accept="image/*"
    onChange={handleImageChange}
    className="hidden"
  />
</div>

        {details.errors.images && <p className="text-red-500 text-sm">{details.errors.images}</p>}
      
        <div className="text-primary border border-primary-400 p-2 rounded w-full">
  <label
    htmlFor="pdfInput"
    className="block text-primary font-medium cursor-pointer"
  >
    Choose PDF
  </label>
  <input
    id="pdfInput"
    type="file"
    name="pdf"
    accept="application/pdf"
    onChange={handlePdfChange}
    className="hidden"
  />
</div>

    {details.errors.pdf && <p className="text-red-500 text-sm">{details.errors.pdf}</p>}
    
      <textarea
        name="description"
        value={details.description}
        onChange={(e) => setDetails({ ...details, description: e.target.value })}
        placeholder="Description"
        className="text-primary border border-primary-400 p-2 rounded w-full h-24"
      />
      
      <input
        name="price"
        type="text"
        value={details.price}
        onChange={handleDetailsChange}
        placeholder="Price"
        className="text-primary border border-primary-400 p-2 rounded w-full"
      />
      {details.errors.price && <p className="text-red-500 text-sm">{details.errors.price}</p>}
      
      <input
        name="baths"
        type="number"
        value={details.baths || ""}
        onChange={handleDetailsChange}
        placeholder="Baths"
        className="text-primary border border-primary-400 p-2 rounded w-full"
      />
      {details.errors.baths && <p className="text-red-500 text-sm">{details.errors.baths}</p>}
      
      <select
        name="purpose"
        value={details.purpose}
        onChange={handleDetailsChange}
        className="text-primary border border-primary-400 p-2 rounded w-full"
      >
        <option value="">Select Purpose</option>
        <option value="sell">Sell</option>
        <option value="buy">Buy</option>
      </select>
      {details.errors.purpose && <p className="text-red-500 text-sm">{details.errors.purpose}</p>}
      
      <input
        name="propertyReferenceId"
        type="text"
        value={details.propertyReferenceId}
        onChange={handleDetailsChange}
        placeholder="Property Reference ID"
        className="text-primary border border-primary-400 p-2 rounded w-full"
      />
      
      {!noAmenities && (
        <div className="grid grid-cols-2 gap-4 w-full text-primary">
          {getAmenitiesOptions().map((amenity) => (
            <label key={amenity}>
              <input
                type="checkbox"
                value={amenity}
                onChange={handleAmenityChange}
              /> {amenity}
            </label>
          ))}
        </div>
      )}
      
      <h2 className="text-lg font-bold text-center text-primary">Are you a Landlord or an Agent?</h2>
      <div className="flex space-x-4">
        <button onClick={() => setDetails({ ...details, landlord: true })} className="px-4 py-2 bg-button text-button rounded">Landlord</button>
        <button onClick={() => setDetails({ ...details, landlord: false })} className="px-4 py-2 bg-button text-button rounded">Agent</button>
        
      </div>
      
      {details.landlord ? (
        <>
          <input
            type="text"
            name="landlordName"
            value={details.landlordName}
            onChange={handleDetailsChange}
            placeholder="Landlord Name"
            className="text-primary border border-primary-400 p-2 rounded w-full"
          />
             {/* {details.errors.landlordName && <p className="text-red-500 text-sm">{details.errors.landlordName}</p>}
    */}
             <div className="flex space-x-4">
                        <button onClick={() => setDetails({ ...details, status: true })} className="px-4 py-2 bg-button text-button rounded">Property Complete</button>
                        <button onClick={() => setDetails({ ...details, status: false })} className="px-4 py-2 bg-button text-button rounded">Property Incomplete</button>
                      
                    </div>
                    {details.status ? (
                        <input
                            type="text"
                            value={details.reraTitleNumber}
                            onChange={(e) => setDetails({ ...details, reraTitleNumber: e.target.value })}
                            placeholder="RERA Title Number"
                            className="text-primary border border-primary-400 p-2 rounded w-full"
                        />
                    ) : (
                        <input
                            type="text"
                            value={details.reraPreRegistrationNumber}
                            onChange={(e) => setDetails({ ...details, reraPreRegistrationNumber: e.target.value })}
                            placeholder="RERA Pre Registration Number"
                            className="text-primary border border-primary-400 p-2 rounded w-full"
                        />
                    )}
                    <input
                        type="text"
                        value={details.building}
                        onChange={(e) => setDetails({ ...details, building: e.target.value })}
                        placeholder="Building"
                        className="text-primary border border-primary-400 p-2 rounded w-full"
                    />
                    <input
      name="developments"
      type="text"
      value={details.developments || ""}
      onChange={handleDetailsChange}
      placeholder="Development"
      className="text-primary border border-primary-400 p-2 rounded w-full"
    />
    {details.errors.developments && <p className="text-red-500 text-sm">{details.errors.developments}</p>}

                    <input
                        type="text"
                        value={details.neighborhood}
                        onChange={(e) => setDetails({ ...details, neighborhood: e.target.value })}
                        placeholder="Neighborhood"
                        className="text-primary border border-primary-400 p-2 rounded w-full"
                    />
                </>
            ) : (
                <>
  
                </>
            )}
        <>
        <input
            type="text"
            name="agentName"
            value={details.agentName}
            onChange={handleChange}
            placeholder="Agent Name"
            className="text-primary border border-primary-400 p-2 rounded w-full"
          />
            {details.errors.agentName && <p className="text-red-500 text-sm">{details.errors.agentName}</p>}
    
          <input
            type="text"
            name="agentCallNumber"
            value={details.agentCallNumber}
            onChange={handleChange}
            placeholder="Agent Call Number"
            className="text-primary border border-primary-400 p-2 rounded w-full"
          />
            {details.errors.agentCallNumber && <p className="text-red-500 text-sm">{details.errors.agentCallNumber}</p>}
    
          <input
            type="email"
            name="agentEmail"
            value={details.agentEmail}
            onChange={handleChange}
            placeholder="Agent Email"
            className="text-primary border border-primary-400 p-2 rounded w-full"
          />
            {details.errors.agentEmail && <p className="text-red-500 text-sm">{details.errors.agentEmail}</p>}
    
          <input
            type="text"
            name="agentWhatsapp"
            value={details.agentWhatsapp}
            onChange={handleChange}
            placeholder="Agent WhatsApp"
            className="text-primary border border-primary-400 p-2 rounded w-full"
          />
            {details.errors.agentWhatsapp && <p className="text-red-500 text-sm">{details.errors.agentWhatsapp}</p>}
    
        </>
    
        {/* {details.errors.status && <p className="text-red-500 text-sm mt-2">Please Select Property Complete/Incomplete Under Landlord</p>} */}
        {details.errors.landlordName && <p className="text-red-500 text-sm">Please Click Landlord</p>}
        {/* {details.errors.images && <p className="text-red-500 text-sm">{details.errors.images}</p>} */}
      
   
      <div className="flex space-x-4 w-full">
        <button onClick={onBack} className="px-4 py-2 bg-button text-button rounded w-full">Back</button>
        <button onClick={handleNext} className="px-4 py-2  bg-button text-button rounded w-full">Next</button>
      </div>
    </div>
  );
}



function Step4Review({ onSubmit, onBack, formData }) {
  return (
    <div className="flex font-aller font-light flex-col items-center space-y-4 w-full max-w-lg mx-auto p-4 bg-primary shadow-lg rounded">
      <h2 className="text-2xl font-bold text-center mb-4">Review Your Ad</h2>

      <div className="w-full space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="font-bold">Title:</label>
          <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.title}</div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-bold">Category:</label>
          <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.category}</div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-bold">Subcategory:</label>
          <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.subcategory}</div>
        </div>

        {formData.images.length > 0 && (
          <div className="flex flex-col space-y-2">
            <label className="font-bold">Images:</label>
            <div className="flex flex-wrap">
              {formData.images.map((image, index) => (
                <img key={index} src={URL.createObjectURL(image)} alt={`Upload ${index + 1}`} className="w-24 h-24 object-cover m-2 border border-primary-400 rounded" />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <label className="font-bold">Description:</label>
          <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.description}</div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-bold">Price:</label>
          <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.price}</div>
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-bold">Country:</label>
          <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.country}</div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-bold">Development:</label>
          <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.developments}</div>
        </div>
        {formData.bedrooms && (
          <div className="flex flex-col space-y-2">
            <label className="font-bold">Bedrooms:</label>
            <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.bedrooms}</div>
          </div>
        )}

        {formData.baths && (
          <div className="flex flex-col space-y-2">
            <label className="font-bold">Bathrooms:</label>
            <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.baths}</div>
          </div>
        )}

        {formData.propertyReferenceId && (
          <div className="flex flex-col space-y-2">
            <label className="font-bold">Property Reference ID:</label>
            <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.propertyReferenceId}</div>
          </div>
        )}

        {formData.amenities.length > 0 && (
          <div className="flex flex-col space-y-2">
            <label className="font-bold">Amenities:</label>
            <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.amenities.join(", ")}</div>
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <label className="font-bold">Landlord/Agent:</label>
          <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.landlord ? "Landlord" : "Agent"}</div>
        </div>

        {formData.landlord ? (
          <>
            <div className="flex flex-col space-y-2">
              <label className="font-bold">Landlord Name:</label>
              <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.landlordName}</div>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-bold">Property Status:</label>
              <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.status ? "Complete" : "Incomplete"}</div>
            </div>
            {formData.status ? (
              <div className="flex flex-col space-y-2">
                <label className="font-bold">RERA Title Number:</label>
                <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.reraTitleNumber}</div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <label className="font-bold">RERA Pre Registration Number:</label>
                <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.reraPreRegistrationNumber}</div>
              </div>
            )}
            <div className="flex flex-col space-y-2">
              <label className="font-bold">Building:</label>
              <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.building}</div>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-bold">Neighborhood:</label>
              <div className="p-2 border border-primary-400 rounded bg-gray-100">{formData.neighborhood}</div>
            </div>
          </>
        ) : (
          <div className="flex flex-col space-y-2">
            <div className="text-primary border border-primary-400 p-2 rounded w-full">
              <h3 className="font-bold">Agent Name</h3>
              <p>{formData.agentName}</p>
            </div>
            <div className="text-primary border border-primary-400 p-2 rounded w-full">
              <h3 className="font-bold">Agent Call Number</h3>
              <p>{formData.agentCallNumber}</p>
            </div>
            <div className="text-primary border border-primary-400 p-2 rounded w-full">
              <h3 className="font-bold">Agent Email</h3>
              <p>{formData.agentEmail}</p>
            </div>
            <div className="text-primary border border-primary-400 p-2 rounded w-full">
              <h3 className="font-bold">Agent WhatsApp</h3>
              <p>{formData.agentWhatsapp}</p>
            </div>
          </div>
        )}
      </div>

      <button onClick={onSubmit} className="px-4 py-2 bg-button text-button rounded w-full">Submit</button>
      <button onClick={onBack} className="px-4 py-2 bg-button text-button rounded w-full">Back</button>
    </div>
  );
}