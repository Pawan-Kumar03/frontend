import React, { useState } from 'react';

export default function Broker({ onNext, onBack, formData = {}, setFormData }) {
  const [reraBrokerID, setReraBrokerID] = useState(formData.reraBrokerID || '');
  const [companyLicenseNumber, setCompanyLicenseNumber] = useState(formData.companyLicenseNumber || '');
  const [companyTelephoneNumber, setCompanyTelephoneNumber] = useState(formData.companyTelephoneNumber || '');
  const [reraIDCard, setReraIDCard] = useState(formData.reraIDCard || null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPublishing(true);
    setError(false);
    setSuccess(false);

    if (!reraBrokerID || !companyLicenseNumber || !companyTelephoneNumber || !reraIDCard) {
      setError(true);
      setIsPublishing(false);
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('reraBrokerID', reraBrokerID);
    formDataToSubmit.append('companyLicenseNumber', companyLicenseNumber);
    formDataToSubmit.append('companyTelephoneNumber', companyTelephoneNumber);
    formDataToSubmit.append('reraIDCard', reraIDCard);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://backend-git-main-pawan-togas-projects.vercel.app/api/broker-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSubmit,
      });

      if (response.status === 201) {
        const data = await response.json();
        console.log('Broker profile created:', data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Failed to save Broker profile');
      }
    } catch (error) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReraIDCard(file);
    }
  };

  return (
    <div className="flex font-primary items-center justify-center min-h-screen bg-primary">
      <div className="w-full max-w-md bg-accent-color p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-primary text-center">
          Broker Profile
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-primary text-sm font-semibold mb-1"
              htmlFor="reraBrokerID"
            >
              RERA Broker ID
            </label>
            <input
              id="reraBrokerID"
              type="text"
              value={reraBrokerID}
              onChange={(e) => setReraBrokerID(e.target.value)}
              className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              className="block text-primary text-sm font-semibold mb-1"
              htmlFor="companyLicenseNumber"
            >
              Company License Number
            </label>
            <input
              id="companyLicenseNumber"
              type="text"
              value={companyLicenseNumber}
              onChange={(e) => setCompanyLicenseNumber(e.target.value)}
              className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              className="block text-primary text-sm font-semibold mb-1"
              htmlFor="companyTelephoneNumber"
            >
              Company Telephone Number
            </label>
            <input
              id="companyTelephoneNumber"
              type="tel"
              value={companyTelephoneNumber}
              onChange={(e) => setCompanyTelephoneNumber(e.target.value)}
              className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              className="block text-primary text-sm font-semibold mb-1"
              htmlFor="reraIDCard"
            >
              RERA ID Card
            </label>
            <input
              id="reraIDCard"
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
            {reraIDCard && (
              <p className="text-sm text-green-500 mt-2">
                Selected file: {reraIDCard.name}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="w-1/2 bg-accent text-primary font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isPublishing}
              className={`w-1/2 bg-button text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent ${
                isPublishing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isPublishing ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>

        {success && (
          <div className="mt-4 text-center bg-accent text-primary p-4 rounded">
            Broker profile created successfully!
          </div>
        )}
        {error && (
          <div className="mt-4 text-center bg-button-hover text-button p-4 rounded">
            Oops! Something went wrong. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}