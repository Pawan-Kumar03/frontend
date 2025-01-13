import React, { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isRequestSent, setIsRequestSent] = useState(false); // Track button state

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        'https://backend-git-main-pawan-togas-projects.vercel.app/api/password-reset-request',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setIsRequestSent(true); // Disable the button
      } else {
        setError(data.message || 'Request failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex font-aller font-light items-center justify-center min-h-screen bg-primary">
      <div className="w-full max-w-md bg-accent-color p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-primary text-center">Forgot Password</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-primary text-sm font-bold mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          {message && (
            <div className="mt-4 p-2 bg-accent text-primary text-center rounded">
              {message}
            </div>
          )}
          {error && (
            <div className="mt-4 p-2 bg-button-hover text-button text-center rounded">
              {error}
            </div>
          )}
          <div className="text-center">
            <button
              type="submit"
              className={`w-full bg-button text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent ${
                isRequestSent ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isRequestSent}
            >
              {isRequestSent ? "Email Sent" : "Request Password Reset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
