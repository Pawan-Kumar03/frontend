import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TermsAndConditions = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        if (location.state && location.state.from) {
            navigate(location.state.from);
        } else {
            navigate(-1); // Go back to the previous page
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-primary font-aller font-light">
            <div className="bg-primary p-8 rounded shadow-md w-full max-w-md w-full max-w-md font-aller font-light bg-primary p-8 rounded shadow-md shadow-lg ">
                <h2 className="text-2xl font-bold mb-6 text-primary text-center">Terms and Conditions</h2>
                <div className="text-primary text-sm">
                    <p className="mb-4">
<h3 className="text-1xl font-bold mb-6 text-primary text-center">1. Introduction</h3>
By using <b>InvestiBayt</b>, you agree to these Terms and Conditions. If you disagree, please do not use our website.

<h3 className="text-1xl font-bold mb-6 text-primary text-center">2. Account Responsibilities</h3>
Eligibility: Must be 18 or older.
Account Security: You are responsible for maintaining your account and password confidentiality.
<h3 className="text-1xl font-bold mb-6 text-primary text-center">3. Property Listings</h3>
Accuracy: Ensure your property information is correct and lawful.
Disclaimers: We do not guarantee listing accuracy or availability. Transactions are between users.
<h3 className="text-1xl font-bold mb-6 text-primary text-center">4. Privacy and Security</h3>
Privacy Policy: Governed by our Privacy Policy.<br></br>
Security: We strive to protect your data, but cannot ensure complete security.
<h3 className="text-1xl font-bold mb-6 text-primary text-center">5. Prohibited Actions</h3>
No Misuse: Do not misuse the website or submit false information.<br></br>
Compliance: Follow all applicable laws and do not use automated tools without permission.
<h3 className="text-1xl font-bold mb-6 text-primary text-center">6. Limitation of Liability</h3>
We are not liable for any damages resulting from your use of the website.

<h3 className="text-1xl font-bold mb-6 text-primary text-center">7. Termination</h3>
We may suspend or terminate your account for violations of these terms.

<h3 className="text-1xl font-bold mb-6 text-primary text-center">8. Changes</h3>
We may update these terms periodically. Continued use implies acceptance of the changes.

<h3 className="text-1xl font-bold mb-6 text-primary text-center">9. Governing Law</h3>
These terms are governed by the laws of the United Arab Emirates. Disputes will be handled in the courts of Dubai, UAE.                    </p>
                </div>
                <div className="mt-6 text-center">
                    <button
                        onClick={handleBack}
                        className="bg-button text-button py-2 px-4 rounded transition-colors duration-300 "
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
