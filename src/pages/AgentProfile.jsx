import React, { useState } from 'react';

export default function AgentProfile({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    agentName: '',
    agentEmail: '',
    contactNumber: '',
    contactWhatsApp: '',
    profilePhoto: null
  });

  const [isPublishing, setIsPublishing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePhoto: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPublishing(true);
    setError(false);
    setSuccess(false);

    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSubmit.append(key, formData[key]);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://backend-git-main-pawan-togas-projects.vercel.app/api/agent-profile', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSubmit,
      });

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          agentName: '',
          agentEmail: '',
          contactNumber: '',
          contactWhatsApp: '',
          profilePhoto: null
        });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Failed to save agent profile');
      }
    } catch (error) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex font-primary items-center justify-center min-h-screen bg-primary">
      <div className="w-full max-w-md bg-accent-color p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-primary text-center">
          Agent Profile
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-primary text-sm font-semibold mb-1"
              htmlFor="agentName"
            >
              Agent Name
            </label>
            <input
              id="agentName"
              name="agentName"
              type="text"
              value={formData.agentName}
              onChange={handleChange}
              className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              className="block text-primary text-sm font-semibold mb-1"
              htmlFor="agentEmail"
            >
              Agent Email
            </label>
            <input
              id="agentEmail"
              name="agentEmail"
              type="email"
              value={formData.agentEmail}
              onChange={handleChange}
              className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              className="block text-primary text-sm font-semibold mb-1"
              htmlFor="contactNumber"
            >
              Contact Number
            </label>
            <input
              id="contactNumber"
              name="contactNumber"
              type="tel"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              className="block text-primary text-sm font-semibold mb-1"
              htmlFor="contactWhatsApp"
            >
              WhatsApp Contact
            </label>
            <input
              id="contactWhatsApp"
              name="contactWhatsApp"
              type="tel"
              value={formData.contactWhatsApp}
              onChange={handleChange}
              className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              className="block text-primary text-sm font-semibold mb-1"
              htmlFor="profilePhoto"
            >
              Agent Profile Photo
            </label>
            <input
              id="profilePhoto"
              name="profilePhoto"
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
            {formData.profilePhoto && (
              <p className="text-sm text-primary mt-2">
                Selected file: {formData.profilePhoto.name}
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
              className="w-1/2 bg-button text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPublishing ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>

        {success && (
          <div className="mt-4 text-center bg-accent text-primary p-4 rounded">
            Agent profile created successfully!
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