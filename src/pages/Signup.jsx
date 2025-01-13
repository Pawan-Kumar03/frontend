import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false); // New state for terms acceptance
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        if (!acceptedTerms) {
            setErrorMessage("You must agree to the Terms and Conditions to proceed.");
            return;
        }

        try {
            const response = await fetch('https://backend-git-main-pawan-togas-projects.vercel.app/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Display success message
                setSuccessMessage("Signup successful! Redirecting to login...");
                // Redirect to login page after a delay
                setTimeout(() => navigate("/login"), 2000); // Delay of 2 seconds before redirection
            } else {
                setErrorMessage(data.message || 'Signup failed');
            }
        } catch (error) {
            console.error("Signup failed:", error);
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    const handleTermsRedirect = () => {
        navigate("/terms-and-conditions", { state: { from: "/signup" } });
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-primary font-aller font-light">
            <div className="bg-primary p-8 rounded shadow-md w-full max-w-md font-aller font-light">
                <h2 className="text-2xl font-bold mb-6 text-primary text-center">Create an Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-primary text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-primary text-sm font-bold mb-2" htmlFor="email">
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
                    <div className="mb-4">
                        <label className="block text-primary text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-primary text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                            className="mr-2"
                        />
                        <label htmlFor="showPassword" className="text-primary text-sm">
                            Show Password
                        </label>
                    </div>
                    {/* Terms and Conditions Checkbox */}
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={acceptedTerms}
                            onChange={() => setAcceptedTerms(!acceptedTerms)}
                            className="mr-2"
                        />
                        <label htmlFor="terms" className="text-primary text-sm">
                            By signing up, I agree to the{" "}
                            <button
                                onClick={handleTermsRedirect}
                                className="text-primary underline"
                            >
                                Terms and Conditions
                            </button>.
                        </label>
                    </div>
                    {errorMessage && (
                        <div className="mb-4 p-2 bg-red-500 text-primary rounded">
                            {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-4 p-2 bg-primary text-black rounded">
                            {successMessage}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-button text-button py-2 px-4 rounded transition-colors duration-300 "
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
