import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function VerifyPage() {
  const { token } = useParams(); // Get the token from the URL
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Function to handle the verification process
  const handleVerification = async () => {
    try {
      const response = await fetch('https://backend-git-main-pawan-togas-projects.vercel.app/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }), // Send the token to the backend
      });

      if (response.ok) {
        setMessage('Verification successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setMessage('An error occurred during verification');
    }
  };

  // Automatically trigger the verification when the component mounts
  useEffect(() => {
    if (token) {
      handleVerification();
    }
  }, [token]);

  return (
    <div className="flex justify-center items-center min-h-screen font-aller font-light">
      <div className="w-full max-w-md bg-primary p-8 rounded shadow-md font-aller font-light">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">Email Verification</h2>
        <p className="text-primary">{message}</p>
      </div>
    </div>
  );
}
