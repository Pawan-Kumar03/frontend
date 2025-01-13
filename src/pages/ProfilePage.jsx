import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const { user, login } = useContext(UserContext);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                login(JSON.parse(storedUser));
            } else {
                navigate('/login');
            }
        } else {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user, navigate, login]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updateData = {};
        if (name && name !== user.name) updateData.name = name;
        if (email && email !== user.email) updateData.email = email;
        if (password) {
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }
            updateData.password = password;
        }

        try {
             // Get the user from localStorage
             const user = localStorage.getItem('user');
             // Parse the string back into an object
             const parsedUser = JSON.parse(user);
             // Now you can access the token
             const token = parsedUser.token;
         
            const response = await fetch('https://backend-git-main-pawan-togas-projects.vercel.app/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred');
            }

            const data = await response.json();
            login(data); // Update the user context with the updated data
            alert('Profile updated successfully');
            navigate('/')
        } catch (err) {
            console.error('Profile update error:', err);
            setError(err.message || 'An error occurred');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-primary font-aller font-light">
            <div className="w-full max-w-md bg-accent-color p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-primary text-center">Edit Profile</h2>
                {error && (
                    <div className="mb-4 p-3 text-center bg-button-hover text-white rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block  text-sm font-medium mb-2 text-primary">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 text-primary rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-primary">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 text-primary rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-primary">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 text-primary rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-primary">Confirm Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 text-primary rounded"
                        />
                    </div>
                    <div className="mb-4 flex items-center">
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                            className="mr-2"
                        />
                        <label className="text-sm text-primary">Show Password</label>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-button text-white py-2 px-4 rounded hover:bg-button-hover"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
