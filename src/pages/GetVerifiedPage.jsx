import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function GetVerifiedPage() {
    const { user } = useContext(UserContext);
    const [status, setStatus] = useState('');
    const [error, setError] = useState(null);
    const [isRequesting, setIsRequesting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        if (!user) {
            sessionStorage.setItem('redirectPath', '/get-verified');
            return;
        }
        setStatus(user.isVerified ? 'Verified' : 'Not verified yet');
    }, [user, navigate]);

    const handleRequestVerification = async () => {
        setIsRequesting(true);
        const user = localStorage.getItem('user');
        const parsedUser = JSON.parse(user);
        const token = parsedUser.token;

        try {
            const response = await fetch(
                'https://backend-git-main-pawan-togas-projects.vercel.app/api/verify/request',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                alert('Verification email sent successfully. Please check your inbox.');
                setStatus('Verification requested');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred');
            }
        } catch (err) {
            console.error('Verification request error:', err);
            setError(err.message || 'An error occurred');
        } finally {
            setIsRequesting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-primary font-aller font-light">
            <div className="w-full max-w-md bg-accent-color p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-primary text-center">Get Verified</h2>
                {error && (
                    <div className="mb-4 p-3 text-center bg-button-hover text-white rounded">
                        {error}
                    </div>
                )}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1 text-primary">
                        Verification Status:
                    </label>
                    <p className={`w-full p-2 rounded ${status === 'Verified' ? 'bg-button text-white' : 'bg-button text-white'}`}>
                        {status}
                    </p>
                </div>
                {status !== 'Verified' && (
                    <button
                        onClick={handleRequestVerification}
                        disabled={isRequesting}
                        className={`w-full py-2 px-4 rounded text-white font-bold ${
                            isRequesting
                                ? 'bg-button cursor-not-allowed'
                                : 'bg-button hover:bg-button-hover'
                        }`}
                    >
                        {isRequesting ? 'Requesting...' : 'Request Verification'}
                    </button>
                )}
            </div>
        </div>
    );
}
