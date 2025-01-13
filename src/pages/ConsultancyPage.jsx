import React, { useState } from "react";
import emailjs from "emailjs-com";

export default function ConsultancyPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        propertyType: "residential",
        message: "",
        contactMethod: "email",
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const templateParams = {
            from_name: formData.name,
            reply_to: formData.email,
            phone: formData.phone,
            property_type: formData.propertyType,
            preferred_contact_method: formData.contactMethod,
            query_message: formData.message,
        };

        emailjs
            .send(
                "service_v5kh1li",
                "template_dry15bi",
                templateParams,
                "P2ZFcnicoD2IhAgfn"
            )
            .then(() => {
                setSuccess(true);
                setError(false);
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    propertyType: "residential",
                    message: "",
                    contactMethod: "email",
                });
                setTimeout(() => setSuccess(false), 3000);
            })
            .catch(() => {
                setError(true);
                setSuccess(false);
                setTimeout(() => setError(false), 3000);
            });
    };

    return (
        <div className="flex font-aller font-light items-center justify-center min-h-screen bg-primary">
            <div className="w-full max-w-md bg-accent-color p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-primary text-center">
                    Consultancy Form
                </h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label
                            className="block text-primary text-sm font-semibold mb-1"
                            htmlFor="name"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label
                            className="block text-primary text-sm font-semibold mb-1"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label
                            className="block text-primary text-sm font-semibold mb-1"
                            htmlFor="phone"
                        >
                            Phone (Optional)
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-primary text-sm font-aller font-bold mb-1"
                            htmlFor="propertyType"
                        >
                            Property Type
                        </label>
                        <select
                            id="propertyType"
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            required
                        >
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="rental">Rental</option>
                        </select>
                    </div>
                    <div>
                        <label
                            className="block text-primary text-sm font-semibold mb-1"
                            htmlFor="message"
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label
                            className="block text-primary text-sm font-aller font-bold mb-1"
                            htmlFor="contactMethod"
                        >
                            Preferred Contact Method
                        </label>
                        <select
                            id="contactMethod"
                            name="contactMethod"
                            value={formData.contactMethod}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            required
                        >
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="in-person">In-Person Meeting</option>
                        </select>
                    </div>
                    <div className="text-center">
                        <button
                            className="w-full bg-button text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </form>
                {success && (
                    <div className="mt-4 text-center bg-accent text-primary p-4 rounded">
                        Your message has been sent successfully!
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
