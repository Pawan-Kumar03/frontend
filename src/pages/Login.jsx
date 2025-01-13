import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext"; // Import UserContext

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(UserContext); // Use UserContext

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://backend-git-main-pawan-togas-projects.vercel.app/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                const userData = {
                    _id: data.userId,
                    name: data.username,
                    email: data.email,
                    isVerified: data.isVerified,
                    token: data.token,
                };
                login(userData); // Update user state with correct data
                navigate("/");
            } else {
                setErrorMessage(data.message || "Login failed");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    const handleSignupRedirect = () => {
        navigate("/signup");
    };

    const handleForgotPassword = () => {
        navigate("/forgot-password");
    };

    return (
        <div className="flex font-aller font-light items-center justify-center min-h-screen bg-primary">
            <div className="w-full max-w-md bg-accent-color p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-primary text-center">
                    Log in to favorite an Ad
                </h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-primary text-sm font-bold mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-primary text-sm font-bold mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            required
                        />
                    </div>
                    <div className="flex items-center">
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
                    {errorMessage && (
                        <div className="mt-4 text-center bg-button-hover text-button p-4 rounded">
                            {errorMessage}
                        </div>
                    )}
                    <div className="text-center">
                        <button
                            className="w-full bg-button text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                            type="submit"
                        >
                            Login
                        </button>
                    </div>
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
                                className="text-primary underline"
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
