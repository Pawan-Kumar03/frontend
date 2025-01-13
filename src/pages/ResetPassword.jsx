import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            const response = await fetch('https://backend-git-main-pawan-togas-projects.vercel.app/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, newPassword })
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage('Password has been reset successfully');
                setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
            } else {
                setErrorMessage(data.message || 'Password reset failed');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-primary font-aller font-light">
            <div className="bg-primary p-8 rounded shadow-md w-full max-w-md border-4  font-aller font-light">
                <h2 className="text-2xl font-bold mb-6 text-primary text-center">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-primary text-sm font-bold mb-2" htmlFor="newPassword">
                            New Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"} // Toggle input type
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-primary text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"} // Toggle input type
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="inline-flex items-center text-primary">
                            <input
                                type="checkbox"
                                className="form-checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)} // Toggle showPassword state
                            />
                            <span className="ml-2">Show Password</span>
                        </label>
                    </div>
                    {errorMessage && (
                        <div className="mb-4 p-2 bg-red-500 text-white rounded">
                            {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-4 p-2 bg-green-500 text-white rounded">
                            {successMessage}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-button text-button py-2 px-4 rounded transition-colors duration-300 "
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}
