import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { useNavigate } from 'react-router-dom';

export default function ContactUsPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const sendEmail = (e) => {
        e.preventDefault();

        const templateParams = {
            from_name: name,        // Sender's name
            reply_to: email,        // Sender's email
            query_message: query    // The actual query message
        };

        emailjs.send(
            'service_v5kh1li',       // Replace with your actual Service ID
            'template_81xid4a',      // Replace with your actual Template ID
            templateParams,
            'P2ZFcnicoD2IhAgfn'      // Replace with your actual Public Key
        )
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            document.querySelector('#success-message').style.display = 'block';
            setTimeout(() => navigate("/"), 3000); // Redirect after 3 seconds
        })
        .catch((error) => {
            console.error('FAILED...', error);
            document.querySelector('#error-message').style.display = 'block';
            setTimeout(() => navigate("/"), 3000); // Redirect after 3 seconds
        });

        setName('');
        setEmail('');
        setQuery('');
    };

    return (
        <div className="flex font-aller font-light items-center justify-center min-h-screen bg-primary ">
            <div className="w-full max-w-md bg-accent-color p-8 rounded-lg shadow-lg ">
                <h1 className="text-3xl font-bold mb-6 text-primary text-center">Contact Us</h1>
                <form className="space-y-4" onSubmit={sendEmail}>
                    <div>
                        <label className="block text-primary text-sm font-bold mb-1" htmlFor="name">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            required
                        />
                    </div>
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
                        <label className="block text-primary text-sm font-bold mb-1" htmlFor="query">
                            Query
                        </label>
                        <textarea
                            id="query"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full p-2 rounded bg-accent text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            rows="4"
                            required
                        ></textarea>
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
                <div
                    id="success-message"
                    className="mt-4 hidden text-center bg-accent text-primary p-4 rounded"
                >
                    Your query has been sent successfully!
                </div>
                <div
                    id="error-message"
                    className="mt-4 hidden text-center bg-button-hover text-button p-4 rounded"
                >
                    Error in Sending Your Query.
                </div>
            </div>
        </div>
    );
}
