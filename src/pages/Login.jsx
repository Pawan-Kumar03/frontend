import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext"; // Import UserContext

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(UserContext); // Use UserContext

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const response = await fetch('https://backend-git-main-pawan-togas-projects.vercel.app/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });
      
          const data = await response.json();
          if (response.ok) {
            // Ensure both _id and name are set
            const userData = { _id: data.userId, name: data.username, email: data.email, isVerified: data.isVerified, token: data.token };
            login(userData);  // Update user state with correct data
            navigate("/");
          } else {
            setErrorMessage(data.message || 'Login failed');
          }
        } catch (error) {
          setErrorMessage('An error occurred. Please try again.');
        }
    };
    
    const handleSignupRedirect = () => {
        navigate("/signup");
    };

    const handleForgotPassword = () => {
        navigate("/forgot-password");
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-800 ">
            <div className="bg-grey-dark p-8 rounded shadow-md w-full max-w-md border-4 border-custom">
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Log in to favorite an Ad</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-custom text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-custom text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    {errorMessage && (
                        <div className="mb-4 p-2 bg-red-500 text-white rounded">
                            {errorMessage}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-custom text-black py-2 px-4 rounded transition-colors duration-300 hover:bg-custom-dark"
                    >
                        Login
                    </button>
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={handleSignupRedirect}
                            className="text-red-400 underline"
                        >
                            Don't have an account? Create one
                        </button>
                        <div className="mt-2">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-blue-400 underline"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
